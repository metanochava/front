<template>
  <q-dialog v-model="dialog" full-width full-height persistent>
    <s-modal-card :title="title" icon="fact_check" fullscreen @close="dialog = false">
      <div v-if="!Pedidoexamemedico.requestItems.length" class="text-grey-6 text-center q-pa-lg">
        {{ tdc('No exams in this request.') }}
      </div>

      <q-card
        v-for="item in Pedidoexamemedico.requestItems"
        :key="item.id"
        class="q-mb-lg"
        flat
        bordered
        :data-test="`result-item-${item.id}`"
      >
        <q-bar class="bg-grey-2 text-dark">
          <div class="text-subtitle2 text-weight-bold ellipsis">{{ item?.exame?.label }}</div>
          <q-space />
          <q-badge
            v-if="item.resultado?.id"
            :color="item.resultado.validado ? 'positive' : 'grey'"
            class="q-mr-xs"
            :label="tdc(item.resultado.validado ? 'Validated' : 'Not validated')"
          />
          <q-badge
            v-if="item.resultado?.released"
            color="primary"
            class="q-mr-xs"
            :label="tdc('Released')"
          />
          <q-badge :color="item.estado_exame?.id === 'pendente' ? 'orange' : 'positive'">
            {{ item.estado_exame?.label }}
          </q-badge>
        </q-bar>

        <q-card-section>
          <!-- a validated result is read-only: corrections are an amendment (new
               revision). The whole result beside its file. -->
          <template v-if="item.resultado?.validado">
            <div class="text-caption text-grey-7 q-mb-sm">
              {{ tdc('This result is validated and cannot be changed. Amend it to create a new revision.') }}
            </div>
            <div class="row q-col-gutter-md">
              <div :class="fileOf(item) ? 'col-12 col-md-8' : 'col-12'">
                <!-- everything entered: value, report, observation, parameter values (exam_values) -->
                <ResultValuesCard v-if="details[item.resultado.id]" :row="details[item.resultado.id]" :header="false" :data-test="`result-details-${item.id}`" />
                <template v-else>
                  <div v-if="item.resultado.valor_resultado"><b>{{ tdc('Result value') }}:</b> {{ item.resultado.valor_resultado }}</div>
                  <!-- eslint-disable-next-line vue/no-v-html -- the laboratory's report (s-editor), sanitized -->
                  <div v-if="item.resultado.laudo" class="q-mt-sm" v-html="sanitizeClinicalHtml(item.resultado.laudo)" />
                  <!-- eslint-disable-next-line vue/no-v-html -- sanitized -->
                  <div v-if="item.resultado.observacao" class="q-mt-sm text-grey-8" v-html="sanitizeClinicalHtml(item.resultado.observacao)" />
                </template>
              </div>
              <div v-if="fileOf(item)" class="col-12 col-md-4">
                <ResultFileCard :item="item" :file="fileOf(item)" @view="viewFile(item)" />
              </div>
            </div>
          </template>

          <template v-else>
            <s-input
              v-model="draftOf(item).valor_resultado"
              :label="tdc('Result value')"
              maxlength="200"
              :error="!!errorsOf(item).valor_resultado"
              :error-message="errorsOf(item).valor_resultado"
            />
            <!-- findings and observation side by side, one full-width row -->
            <div class="row q-col-gutter-sm q-mt-xs">
              <div class="col-12 col-md-6">
                <s-editor v-model="draftOf(item).laudo" :label="tdc('Findings')" min-height="120px" />
              </div>
              <div class="col-12 col-md-6">
                <s-editor v-model="draftOf(item).observacao" :label="tdc('Observation')" min-height="120px" />
              </div>
            </div>
            <div class="row q-col-gutter-sm q-mt-xs">
              <div class="col-12 col-sm-6">
                <s-file v-model="draftOf(item).file" :label="tdc('File')" />
              </div>
              <!-- the patient's results folder the file goes into (empty = the patient's root) -->
              <div class="col-12 col-sm-6">
                <s-select
                  v-model="draftOf(item).pai"
                  :label="tdc('Patient folder')"
                  :options="folderOptions"
                  emit-value
                  map-options
                  clearable
                  :error="!!errorsOf(item).pai"
                  :error-message="errorsOf(item).pai"
                  :data-test="`result-folder-${item.id}`"
                />
              </div>
            </div>
          </template>

          <!-- the file already attached (a draft): its preview; click to view it -->
          <div v-if="fileOf(item) && !item.resultado?.validado" class="row q-mt-sm" :data-test="`result-file-${item.id}`">
            <div class="col-12 col-sm-6 col-md-4">
              <ResultFileCard :item="item" :file="fileOf(item)" @view="viewFile(item)" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- actions of THIS exam (one card per exam, inside the scrolling list) -->
        <q-card-actions align="right">
          <s-btn
            flat
            color="primary"
            icon="edit_note"
            :label="tdc('Record result')"
            data-test="open-structured-result"
            @click="openStructured(item)"
          />
          <s-btn
            v-if="canRun('validate', item)"
            flat
            color="positive"
            icon="verified"
            :label="tdc('Validate')"
            :loading="running === `validate-${item.id}`"
            data-test="result-validate"
            @click="runResultAction(item, 'validate')"
          />
          <s-btn
            v-if="canRun('release', item)"
            flat
            color="primary"
            icon="publish"
            :label="tdc('Release')"
            :loading="running === `release-${item.id}`"
            data-test="result-release"
            @click="runResultAction(item, 'release')"
          />
          <s-btn
            v-if="!item.resultado?.validado"
            color="primary"
            icon="save"
            :label="tdc('Save report')"
            :loading="saving === item.id"
            data-test="save-report"
            @click="saveReport(item)"
          />
        </q-card-actions>
      </q-card>
    </s-modal-card>
  </q-dialog>

  <ExamResultDialog
    v-model="structuredOpen"
    :item-id="structuredItemId"
    @saved="reload"
    @changed="reload"
  />
  <s-pdf-render v-model="viewer.open" :src="viewer.src" :title="viewer.title" />
</template>

<script setup>
// Two ways of entering the result of each exam of a request, both on the SAME
// result record (the item's current revision - saude/services/lab_result_service.py):
// - "Record result": the structured form built from the exam's parameters
//   (ExamResultDialog -> record_result);
// - the free-form report on this card: value, findings, observation, file
//   (record_report).
// Validating and releasing have their own permissions and are offered only in
// the state the backend accepts them; the backend enforces both (403 / 409).
import { computed, reactive, ref, watch } from 'vue'
import { tdc, url, HTTPAuth, useUserStore } from 'quasar_resaas'
import { usePedidoexamemedicoStore } from './../pedidoexamemedico/pedidoexamemedicoStore.js'
import ExamResultDialog from '../components/ExamResultDialog.vue'
import ResultValuesCard from '../components/ResultValuesCard.vue'
import ResultFileCard from '../components/ResultFileCard.vue'
import { sanitizeClinicalHtml } from '../components/clinicalHtml'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const Pedidoexamemedico = usePedidoexamemedicoStore()
const User = useUserStore()

// "Results of <patient> — request of <date>" (the request's label is its patient)
const title = computed(() => {
  const request = Pedidoexamemedico.row || {}
  const patient = request.label
  const created = ds(request.created_at)
  const head = patient ? `${tdc('Results of')} ${patient}` : tdc('Results')
  return created ? `${head} — ${tdc('request of')} ${created}` : head
})

// ---------------------------------------------------------------- structured form
const structuredOpen = ref(false)
const structuredItemId = ref(null)
function openStructured (item) {
  structuredItemId.value = item?.id
  structuredOpen.value = true
}

// ---------------------------------------------------------------- free-form report
const drafts = reactive({})
const errors = reactive({})
const saving = ref(null)

// a relation comes as {id, value, label} when read
const idOf = (value) => (value && typeof value === 'object' ? value.id : value) || null

function fromResult (resultado) {
  const pai = idOf(resultado?.pai)
  return {
    valor_resultado: resultado?.valor_resultado || '',
    laudo: resultado?.laudo || '',
    observacao: resultado?.observacao || '',
    file: null,
    // the folder is sent only when changed (record_report keeps it otherwise)
    pai,
    paiInitial: pai
  }
}

// ---------------------------------------------------------------- patient folders
const folders = ref([])
const folderOptions = computed(() => folders.value.map(folder => ({ label: folder.path, value: folder.id })))

async function loadFolders () {
  folders.value = []
  const paciente = Pedidoexamemedico.row?.patient_id
  if (!paciente) return
  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'saude/resultadoexamemedicos/folders/', params: { paciente } }))
  folders.value = Array.isArray(data) ? data : []
}

watch(() => [props.modelValue, Pedidoexamemedico.row?.patient_id], ([open]) => {
  if (open) loadFolders()
}, { immediate: true })

// ---------------------------------------------------------------- attached file
const fileOf = (item) => {
  const file = item?.resultado?.file
  return file && typeof file === 'object' && file.url ? file : null
}
const viewer = reactive({ open: false, src: null, title: '' })

function viewFile (item) {
  const file = fileOf(item)
  viewer.src = file.url
  viewer.title = file.name || item.resultado.nome || tdc('File')
  viewer.open = true
}

// ---------------------------------------------------------------- full result
// everything entered with each result (resultadoexamemedicos/{id}/exam_values/,
// view_resultadoexamemedico), by result id
const details = reactive({})

async function loadDetails (items) {
  if (!User.can('view_resultadoexamemedico')) return
  await Promise.all((items || []).filter((item) => item.resultado?.id).map(async (item) => {
    const id = item.resultado.id
    try {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `saude/resultadoexamemedicos/${id}/exam_values/` }))
      details[id] = data
    } catch {
      // already shown by the HTTP funnel: the modal keeps the basic fields
      delete details[id]
    }
  }))
}

function draftOf (item) {
  if (!drafts[item.id]) drafts[item.id] = fromResult(item.resultado)
  return drafts[item.id]
}

function errorsOf (item) {
  return errors[item.id] || {}
}

// every (re)load shows what the server has
watch(() => Pedidoexamemedico.requestItems, (items) => {
  for (const item of items || []) drafts[item.id] = fromResult(item.resultado)
  if (props.modelValue) loadDetails(items)
}, { immediate: true })

watch(() => props.modelValue, (open) => { if (open) loadDetails(Pedidoexamemedico.requestItems) })

async function reload () {
  const pedidoId = Pedidoexamemedico.row?.id
  if (pedidoId) await Pedidoexamemedico.getItemPedido(pedidoId)
}

async function saveReport (item) {
  const draft = draftOf(item)
  const body = new FormData()
  for (const field of ['valor_resultado', 'laudo', 'observacao']) body.append(field, draft[field] ?? '')
  if (draft.file instanceof File) body.append('file', draft.file)
  if ((draft.pai || null) !== (draft.paiInitial || null)) body.append('pai', draft.pai || '')

  saving.value = item.id
  errors[item.id] = {}
  try {
    await HTTPAuth.post(url({ type: 'u', url: `saude/itempedidoexamemedicos/${item.id}/record_report/` }), body)
    await reload()
  } catch (error) {
    // field errors stay on their fields; the message goes through the normal
    // alert funnel (services/api interceptor)
    const details = error?.response?.data?.error?.details || {}
    errors[item.id] = Object.fromEntries(
      Object.entries(details).map(([field, messages]) => [field, tdc([].concat(messages)[0])])
    )
  } finally {
    saving.value = null
  }
}

// ---------------------------------------------------------------- lifecycle
const running = ref(null)
const LIFECYCLE = {
  validate: (r) => !r.validado,
  release: (r) => r.validado && !r.released
}

function canRun (action, item) {
  const result = item.resultado
  return !!result?.id && LIFECYCLE[action](result) && User.can(`${action}_resultadoexamemedico`)
}

async function runResultAction (item, action) {
  running.value = `${action}-${item.id}`
  try {
    await HTTPAuth.post(url({ type: 'u', url: `saude/resultadoexamemedicos/${item.resultado.id}/${action}/` }))
    await reload()
  } finally {
    running.value = null
  }
}
</script>
