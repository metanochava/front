
<template>
  <q-page class="q-pa-sm" v-if="Filafarmacia.row">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="local_pharmacy" class="q-mr-sm" />
      {{ Filafarmacia.row.label }}
      <q-badge class="q-ml-sm" :color="estadoColor">{{ Filafarmacia.row.estado?.label || estado }}</q-badge>
      <q-space />

      <q-btn
        v-if="estado === 'pendente' || estado === 'em_revisao'"
        color="primary" icon="fact_check" :label="tdc('Rever')"
        :loading="acting" class="q-mr-sm"
        @click="showRevisarDialog = true"
      />
      <q-btn
        v-if="estado === 'aprovada' || estado === 'dispensada_parcial'"
        color="positive" icon="medication" :label="tdc('Dispensar')"
        :loading="acting" class="q-mr-sm"
        @click="openDispensarDialog"
      />
      <q-btn
        v-if="estado === 'dispensada_parcial'"
        color="secondary" icon="task_alt" :label="tdc('Concluir')"
        :loading="acting"
        @click="concluir"
      />
    </div>

    <div v-if="actionError" class="q-mb-md">
      <q-banner class="bg-negative text-white" dense>{{ actionError }}</q-banner>
    </div>

    <q-banner v-if="estado === 'rejeitada' && Filafarmacia.row.motivo_rejeicao" class="bg-negative text-white q-mb-md" dense>
      {{ tdc('Motivo da rejeição') }}: {{ Filafarmacia.row.motivo_rejeicao }}
    </q-banner>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Prescrição') }}</div>
          <div class="text-body1">{{ Filafarmacia.row.receita?.label || '—' }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-4">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Revisado por') }}</div>
          <div class="text-body1">{{ Filafarmacia.row.revisado_por?.label || '—' }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-4">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Revisado em') }}</div>
          <div class="text-body1">{{ formatDateTime(Filafarmacia.row.revisado_em) }}</div>
        </q-card-section></s-card>
      </div>
    </div>

    <!-- ITENS DA PRESCRIÇÃO -->
    <s-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Itens da Prescrição') }}</div>
        <div v-if="!itensReceita.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
        <q-table
          v-else flat dense
          :rows="itensReceita"
          :columns="itemReceitaColumns"
          row-key="id"
          hide-pagination
          :rows-per-page-options="[0]"
        />
      </q-card-section>
    </s-card>

    <!-- HISTÓRICO DE DISPENSAÇÕES -->
    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Dispensações') }}</div>
        <div v-if="!dispensas.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
        <q-list v-else dense separator>
          <q-item v-for="d in dispensas" :key="d.id">
            <q-item-section>
              {{ formatDateTime(d.data) }} — {{ d.dispensado_por?.label || '—' }}
            </q-item-section>
            <q-item-section side>
              <q-badge :color="d.estado?.value === 'concluida' ? 'positive' : 'negative'">
                {{ d.estado?.label }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </s-card>

    <!-- DIALOG REVISAR -->
    <q-dialog v-model="showRevisarDialog">
      <q-card style="min-width: 380px">
        <q-card-section class="text-h6">{{ tdc('Rever Prescrição') }}</q-card-section>
        <q-card-section class="q-gutter-md">
          <s-select
            v-model="revisarForm.employee_id"
            :api="employeeSelectUrl"
            option-label="label" option-value="value"
            emit-value map-options
            :label="tdc('Farmacêutico')"
          />
          <q-option-group
            v-model="revisarForm.aprovado"
            :options="[
              { label: tdc('Aprovar'), value: true },
              { label: tdc('Rejeitar'), value: false },
            ]"
            inline
          />
          <q-input
            v-if="revisarForm.aprovado === false"
            v-model="revisarForm.motivo_rejeicao"
            type="textarea"
            :label="tdc('Motivo da Rejeição')"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="tdc('Cancelar')" v-close-popup />
          <q-btn
            color="primary" :label="tdc('Confirmar')" :loading="acting"
            :disable="!revisarForm.employee_id || revisarForm.aprovado === null || (revisarForm.aprovado === false && !revisarForm.motivo_rejeicao)"
            @click="revisar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG DISPENSAR -->
    <q-dialog v-model="showDispensarDialog">
      <q-card style="min-width: 520px; max-width: 90vw">
        <q-card-section class="text-h6">{{ tdc('Dispensar Medicação') }}</q-card-section>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <s-select
                v-model="dispensarForm.employee_id"
                :api="employeeSelectUrl"
                option-label="label" option-value="value"
                emit-value map-options
                :label="tdc('Farmacêutico')"
              />
            </div>
            <div class="col-12 col-sm-6">
              <s-select
                v-model="dispensarForm.warehouse_id"
                :api="warehouseSelectUrl"
                option-label="label" option-value="value"
                emit-value map-options
                clearable
                :label="tdc('Armazém') + ' (' + tdc('opcional — controlo de stock') + ')'"
              />
            </div>
          </div>

          <q-separator />

          <div v-for="line in dispensarLines" :key="line.item_receita_id" class="q-mb-sm">
            <div class="row q-col-gutter-sm items-center">
              <div class="col-1">
                <q-checkbox v-model="line.incluir" />
              </div>
              <div class="col-11 col-sm-3">
                <div class="text-body2">{{ line.medicamento_label }}</div>
                <div class="text-caption text-grey-6">{{ line.prescrito }}</div>
              </div>
              <div class="col-6 col-sm-2">
                <q-input
                  v-model.number="line.quantidade" type="number" dense
                  :label="tdc('Quantidade')" :disable="!line.incluir"
                />
              </div>
              <div class="col-6 col-sm-2">
                <q-input
                  v-model="line.lote" dense
                  :label="tdc('Lote') + ' (' + tdc('opcional') + ')'" :disable="!line.incluir"
                />
              </div>
              <div class="col-12 col-sm-4">
                <s-select
                  v-if="dispensarForm.warehouse_id"
                  v-model="line.produto_id"
                  :api="productSelectUrl"
                  option-label="label" option-value="value"
                  emit-value map-options
                  clearable dense
                  :disable="!line.incluir"
                  :label="tdc('Produto no Stock') + ' (' + tdc('opcional') + ')'"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="tdc('Cancelar')" v-close-popup />
          <q-btn
            color="positive" :label="tdc('Dispensar')" :loading="acting"
            :disable="!dispensarForm.employee_id || !dispensarLines.some(l => l.incluir && l.quantidade > 0)"
            @click="dispensar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import { useFilafarmaciaStore } from './filafarmaciaStore'

const route = useRoute()
const Filafarmacia = useFilafarmaciaStore()

const employeeSelectUrl = url({ type: 'u', url: 'hr/employees', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })
const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })

const estado = computed(() => Filafarmacia.row?.estado?.value || Filafarmacia.row?.estado)
const estadoColor = computed(() => ({
  pendente: 'grey',
  em_revisao: 'grey',
  aprovada: 'info',
  rejeitada: 'negative',
  dispensada_parcial: 'warning',
  dispensada: 'positive',
  cancelada: 'negative',
}[estado.value] || 'grey'))

const itemReceitaColumns = [
  { name: 'medicamento', label: tdc('Medicamento'), field: row => row.medicamento?.label, align: 'left' },
  { name: 'quantidade', label: tdc('Quantidade Prescrita'), field: 'quantidade', align: 'left' },
  { name: 'dosagem', label: tdc('Dosagem'), field: 'dosagem', align: 'left' },
  { name: 'observacao', label: tdc('Observação'), field: 'observacao', align: 'left' },
]

const itensReceita = ref([])
const dispensas = ref([])

function formatDateTime(value) {
  if (!value) return '—'
  return String(value).replace('T', ' ').slice(0, 16)
}

async function fetchItensReceita() {
  const receitaId = Filafarmacia.row?.receita?.id
  if (!receitaId) return

  const { data } = await HTTPAuth.get(
    url({ type: 'u', url: 'saude/itemreceitas/', params: { receita: receitaId, page_size: 200 } })
  )
  itensReceita.value = data.results || data
}

async function fetchDispensas() {
  const { data } = await HTTPAuth.get(
    url({ type: 'u', url: 'farmacia/dispensas/', params: { fila: route.params.id, page_size: 200, ordering: '-data' } })
  )
  dispensas.value = data.results || data
}

async function refreshAll() {
  Filafarmacia.row = await Filafarmacia.getById(route.params.id)
  await fetchItensReceita()
  await fetchDispensas()
}

// ---------------- AÇÕES ----------------
const acting = ref(false)
const actionError = ref('')

function extractError(e, fallback) {
  const detail = e?.response?.data?.detail
  if (Array.isArray(detail)) return detail[0]
  return detail || fallback
}

// -------- Revisar --------
const showRevisarDialog = ref(false)
const revisarForm = reactive({ employee_id: null, aprovado: null, motivo_rejeicao: '' })

async function revisar() {
  acting.value = true
  actionError.value = ''
  try {
    await Filafarmacia.revisar(route.params.id, { ...revisarForm })
    showRevisarDialog.value = false
    revisarForm.employee_id = null
    revisarForm.aprovado = null
    revisarForm.motivo_rejeicao = ''
    await refreshAll()
  } catch (e) {
    actionError.value = extractError(e, tdc('Erro ao rever prescrição.'))
  } finally {
    acting.value = false
  }
}

// -------- Dispensar --------
const showDispensarDialog = ref(false)
const dispensarForm = reactive({ employee_id: null, warehouse_id: null })
const dispensarLines = ref([])

function openDispensarDialog() {
  dispensarLines.value = itensReceita.value.map(item => ({
    item_receita_id: item.id,
    medicamento_label: item.medicamento?.label || '—',
    prescrito: [item.quantidade, item.dosagem].filter(Boolean).join(' — '),
    incluir: true,
    quantidade: null,
    lote: '',
    produto_id: null,
  }))
  showDispensarDialog.value = true
}

async function dispensar() {
  acting.value = true
  actionError.value = ''
  try {
    const itens = dispensarLines.value
      .filter(l => l.incluir && l.quantidade > 0)
      .map(l => ({
        item_receita_id: l.item_receita_id,
        quantidade: l.quantidade,
        lote: l.lote || null,
        produto_id: dispensarForm.warehouse_id ? l.produto_id : null,
      }))

    await Filafarmacia.dispensar(route.params.id, {
      employee_id: dispensarForm.employee_id,
      warehouse_id: dispensarForm.warehouse_id,
      itens,
    })
    showDispensarDialog.value = false
    dispensarForm.warehouse_id = null
    await refreshAll()
  } catch (e) {
    actionError.value = extractError(e, tdc('Erro ao dispensar.'))
  } finally {
    acting.value = false
  }
}

// -------- Concluir --------
async function concluir() {
  acting.value = true
  actionError.value = ''
  try {
    await Filafarmacia.concluir(route.params.id)
    await refreshAll()
  } catch (e) {
    actionError.value = extractError(e, tdc('Erro ao concluir.'))
  } finally {
    acting.value = false
  }
}

onMounted(refreshAll)
</script>
