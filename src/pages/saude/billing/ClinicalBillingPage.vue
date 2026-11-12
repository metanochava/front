<template>
  <!-- What clinical acts charge and consume (saude clinical_billing_service):
       billing rules (consultation / exam / medicine -> catalogued items),
       exam materials (goods an exam uses up) and the charges and consumptions
       made, read only. Every tab and button follows its permission (UX only -
       the backend checks again). -->
  <q-page class="q-pa-md">
    <s-card flat bordered>
      <q-tabs v-model="tab" dense no-caps align="left" active-color="primary" indicator-color="primary">
        <q-tab v-if="can('list_clinicalbillingrule')" name="rules" icon="request_quote" :label="tdc('Billing rules')" />
        <q-tab v-if="can('list_exammaterialrule')" name="materials" icon="science" :label="tdc('Exam materials')" />
        <q-tab v-if="can('list_clinicalcharge')" name="charges" icon="receipt_long" :label="tdc('Charges')" />
        <q-tab v-if="can('list_materialconsumption')" name="consumptions" icon="inventory" :label="tdc('Consumptions')" />
      </q-tabs>
      <q-separator />

      <q-card-section>
        <div v-if="tab === 'rules' || tab === 'materials'" class="row justify-end q-mb-sm">
          <s-btn
            v-if="can(tab === 'rules' ? 'add_clinicalbillingrule' : 'add_exammaterialrule')"
            color="primary" icon="add" no-caps
            :label="tdc(tab === 'rules' ? 'Add billing rule' : 'Add exam material')"
            data-test="billing-add"
            @click="openAdd"
          >
            <s-tooltip>{{ tdc(tab === 'rules' ? 'Add billing rule' : 'Add exam material') }}</s-tooltip>
          </s-btn>
        </div>

        <q-table
          flat dense
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 20 }"
          :no-data-label="tdc('No records found')"
          data-test="billing-table"
        >
          <template #body-cell-actions="scope">
            <q-td :props="scope" class="text-right">
              <s-btn v-if="scope.row.sale_id" flat dense round icon="open_in_new" color="primary"
                     :to="{ name: 'view_sale', params: { id: scope.row.sale_id } }">
                <s-tooltip>{{ tdc('Open the sale') }}</s-tooltip>
              </s-btn>
              <s-btn v-if="canDelete" flat dense round icon="delete_outline" color="negative"
                     data-test="billing-remove" @click="remove(scope.row)">
                <s-tooltip>{{ tdc('Remove') }}</s-tooltip>
              </s-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </s-card>

    <!-- add a billing rule / an exam material -->
    <q-dialog v-model="dialog" persistent>
      <s-modal-card :title="tdc(tab === 'rules' ? 'Add billing rule' : 'Add exam material')" icon="add" width="560px">
        <div class="column q-gutter-y-md">
          <template v-if="tab === 'rules'">
            <s-select v-model="draft.kind" :options="kindOptions" emit-value map-options :label="tdc('Kind')"
                      data-test="billing-kind" />
            <s-select v-if="draft.kind === 'consultation'" v-model="draft.specialty" :api="selectUrl('hr/specialtys')"
                      emit-value map-options clearable :label="tdc('Specialty')"
                      :hint="tdc('Empty: any consultation without a rule of its own')" />
            <s-select v-if="draft.kind === 'exam'" v-model="draft.exame" :api="selectUrl('saude/examemedicos')"
                      emit-value map-options :label="tdc('Exam')" />
            <s-select v-if="draft.kind === 'medication'" v-model="draft.medicamento" :api="selectUrl('saude/medicamentos')"
                      emit-value map-options :label="tdc('Medicine')" />
          </template>
          <s-select v-else v-model="draft.exame" :api="selectUrl('saude/examemedicos')" emit-value map-options
                    :label="tdc('Exam')" />

          <s-select v-model="draft.product_id" :api="selectUrl('catalog/products')" emit-value map-options
                    :label="tdc(tab === 'rules' ? 'Catalogued item charged' : 'Catalogued item consumed')"
                    data-test="billing-product" />
          <s-input v-model="draft.quantity" type="number" step="any" :label="tdc('Quantity')" />
          <div v-if="formError" class="text-negative text-caption">{{ formError }}</div>
        </div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" v-close-popup>
            <s-tooltip>{{ tdc('Close without saving') }}</s-tooltip>
          </s-btn>
          <s-btn color="primary" icon="save" :label="tdc('Save')" :loading="saving" data-test="billing-save" @click="save">
            <s-tooltip>{{ tdc('Save') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { HTTPAuth, url, tdc, ds, useUserStore, sDialog, rawValue, errorMessage } from 'quasar_resaas'

const User = useUserStore()
const can = perm => User.can(perm)

const ENDPOINTS = {
  rules: 'saude/clinicalbillingrules/',
  materials: 'saude/exammaterialrules/',
  charges: 'saude/clinicalcharges/',
  consumptions: 'saude/materialconsumptions/'
}

const TABS = [['rules', 'list_clinicalbillingrule'], ['materials', 'list_exammaterialrule'],
  ['charges', 'list_clinicalcharge'], ['consumptions', 'list_materialconsumption']]
const tab = ref(TABS.find(([, perm]) => can(perm))?.[0] || 'rules')

const rows = ref([])
const loading = ref(false)
const dialog = ref(false)
const saving = ref(false)
const formError = ref('')
const draft = reactive({ kind: 'consultation', specialty: null, exame: null, medicamento: null, product_id: null, quantity: 1 })

const kindOptions = computed(() => [
  { value: 'consultation', label: tdc('Consultation') },
  { value: 'exam', label: tdc('Exam') },
  { value: 'medication', label: tdc('Medicine') }
])

const label = value => (value && typeof value === 'object' ? (value.label ?? value.value) : value) || ''
const selectUrl = endpoint => url({ type: 'u', url: endpoint, params: { select: 'true' } })

const canDelete = computed(() => (tab.value === 'rules' && can('delete_clinicalbillingrule')) ||
  (tab.value === 'materials' && can('delete_exammaterialrule')))

const columns = computed(() => {
  const col = (name, text, field, extra = {}) => ({ name, label: tdc(text), field, align: 'left', ...extra })
  const actions = { name: 'actions', label: '', field: 'id', align: 'right' }
  switch (tab.value) {
    case 'rules':
      return [
        col('kind', 'Kind', r => tdc({ consultation: 'Consultation', exam: 'Exam', medication: 'Medicine' }[r.kind] || r.kind)),
        col('target', 'For', r => label(r.specialty) || label(r.exame) || label(r.medicamento) || tdc('Any consultation')),
        col('product', 'Catalogued item', 'product_label'),
        col('quantity', 'Quantity', 'quantity'),
        actions
      ]
    case 'materials':
      return [col('exam', 'Exam', r => label(r.exame)), col('product', 'Catalogued item', 'product_label'),
        col('quantity', 'Quantity', 'quantity'), actions]
    case 'charges':
      return [col('date', 'Date', r => ds(r.created_at)), col('patient', 'Patient', r => label(r.paciente)),
        col('source', 'Act', r => tdc(r.source_type === 'saude.agenda' ? 'Consultation' : 'Exam request')), actions]
    default:
      return [col('date', 'Date', r => ds(r.created_at)), col('source', 'Act', 'source_type'),
        col('status', 'Status', r => tdc(r.status === 'done' ? 'Done' : 'Failed')), col('reason', 'Reason', 'reason')]
  }
})

async function load () {
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: ENDPOINTS[tab.value], params: { page_size: 200, ordering: '-created_at' } }))
    rows.value = Array.isArray(data) ? data : (data?.results || [])
  } catch {
    rows.value = []
  } finally {
    loading.value = false
  }
}

watch(tab, load, { immediate: true })

function openAdd () {
  Object.assign(draft, { kind: 'consultation', specialty: null, exame: null, medicamento: null, product_id: null, quantity: 1 })
  formError.value = ''
  dialog.value = true
}

async function save () {
  saving.value = true
  formError.value = ''
  const body = tab.value === 'rules'
    ? { kind: draft.kind, specialty: draft.kind === 'consultation' ? draft.specialty : null,
        exame: draft.kind === 'exam' ? draft.exame : null, medicamento: draft.kind === 'medication' ? draft.medicamento : null,
        product_id: draft.product_id, quantity: draft.quantity }
    : { exame: draft.exame, product_id: draft.product_id, quantity: draft.quantity }
  try {
    await HTTPAuth.post(url({ type: 'u', url: ENDPOINTS[tab.value] }), body)
    dialog.value = false
    await load()
  } catch (error) {
    formError.value = errorMessage(error) || tdc('Could not save.')
  } finally {
    saving.value = false
  }
}

function remove (row) {
  sDialog({
    title: tdc('Remove'),
    message: tdc('Remove this rule?'),
    cancel: { flat: true, label: tdc('Cancel') },
    ok: { color: 'negative', label: tdc('Remove') },
    persistent: true
  }).onOk(async () => {
    try {
      await HTTPAuth.delete(url({ type: 'u', url: `${ENDPOINTS[tab.value]}${rawValue(row.id)}/` }))
      await load()
    } catch { /* the alert funnel shows why */ }
  })
}
</script>
