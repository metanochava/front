<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="receipt_long" class="q-mr-sm" />
      {{ tdc('Movimentos de Stock') }}
      <q-space />
      <q-btn color="primary" icon="add" :label="tdc('Novo Movimento')" @click="openForm" />
    </div>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-5">
        <s-select
          v-model="filterProduct"
          :api="productSelectUrl"
          option-label="label" option-value="value"
          emit-value map-options clearable
          :label="tdc('Filtrar por Produto')"
          @update:model-value="fetch"
        />
      </div>
      <div class="col-12 col-sm-5">
        <s-select
          v-model="filterWarehouse"
          :api="warehouseSelectUrl"
          option-label="label" option-value="value"
          emit-value map-options clearable
          :label="tdc('Filtrar por Armazém')"
          @update:model-value="fetch"
        />
      </div>
    </div>

    <q-table
      flat bordered
      :rows="Stockmovement.rows"
      :columns="columns"
      row-key="id"
      :loading="Stockmovement.loading"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template #body-cell-quantidade="props">
        <q-td :props="props">
          <span :class="Number(props.value) < 0 ? 'text-negative' : 'text-positive'">
            {{ Number(props.value) > 0 ? '+' : '' }}{{ props.value }}
          </span>
        </q-td>
      </template>
      <template #body-cell-tipo="props">
        <q-td :props="props">
          <q-badge :color="tipoColor(props.row.tipo?.value || props.row.tipo)">
            {{ props.row.tipo?.label || props.row.tipo }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <!-- FORM: NOVO MOVIMENTO -->
    <q-dialog v-model="showForm">
      <q-card style="min-width: 420px">
        <q-card-section class="text-h6">{{ tdc('Novo Movimento de Stock') }}</q-card-section>

        <q-card-section class="q-gutter-md">
          <s-select
            v-model="form.product"
            :api="productSelectUrl"
            option-label="label" option-value="value"
            emit-value map-options
            :label="tdc('Produto')"
          />
          <s-select
            v-model="form.warehouse"
            :api="warehouseSelectUrl"
            option-label="label" option-value="value"
            emit-value map-options
            :label="tdc('Armazém')"
          />
          <q-select
            v-model="form.tipo"
            :options="tipoOptions"
            emit-value map-options
            :label="tdc('Tipo')"
          />
          <q-input
            v-model.number="form.quantidadeAbsoluta"
            type="number" min="0" step="0.001"
            :label="tdc('Quantidade')"
          />
          <q-input
            v-model="form.motivo"
            type="textarea"
            :label="tdc('Motivo') + (form.tipo === 'ajuste' ? ' *' : '')"
            :hint="form.tipo === 'ajuste' ? tdc('Obrigatório para ajustes') : ''"
          />
          <div v-if="errorMsg" class="text-negative text-caption">{{ errorMsg }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="tdc('Cancelar')" v-close-popup />
          <q-btn color="primary" :label="tdc('Gravar')" :loading="saving" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tdc, url } from 'quasar_resaas'
import { useStockmovementStore } from './stockmovementStore'

const Stockmovement = useStockmovementStore()

const filterProduct = ref(null)
const filterWarehouse = ref(null)

const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })

const columns = [
  { name: 'data', label: tdc('Data'), field: 'data', align: 'left' },
  { name: 'product', label: tdc('Produto'), field: row => row.product?.label, align: 'left' },
  { name: 'warehouse', label: tdc('Armazém'), field: row => row.warehouse?.label, align: 'left' },
  { name: 'tipo', label: tdc('Tipo'), field: 'tipo', align: 'left' },
  { name: 'quantidade', label: tdc('Quantidade'), field: 'quantidade', align: 'right' },
  { name: 'motivo', label: tdc('Motivo'), field: 'motivo', align: 'left' },
]

const pagination = reactive({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
  sortBy: 'data',
  descending: true,
})

function tipoColor(tipo) {
  return {
    entrada: 'positive',
    saida: 'negative',
    ajuste: 'warning',
    transferencia: 'info',
    devolucao: 'secondary',
  }[tipo] || 'grey'
}

async function fetch() {
  await Stockmovement.loadData({
    page: pagination.page,
    page_size: pagination.rowsPerPage,
    product: filterProduct.value || undefined,
    warehouse: filterWarehouse.value || undefined,
  })
  pagination.rowsNumber = Stockmovement.pagination.rowsNumber
}

function onRequest(props) {
  pagination.page = props.pagination.page
  pagination.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

const showForm = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const tipoOptions = [
  { label: tdc('Entrada'), value: 'entrada' },
  { label: tdc('Saída'), value: 'saida' },
  { label: tdc('Ajuste'), value: 'ajuste' },
]

const form = reactive({
  product: null,
  warehouse: null,
  tipo: 'entrada',
  quantidadeAbsoluta: null,
  motivo: '',
})

function openForm() {
  form.product = filterProduct.value
  form.warehouse = filterWarehouse.value
  form.tipo = 'entrada'
  form.quantidadeAbsoluta = null
  form.motivo = ''
  errorMsg.value = ''
  showForm.value = true
}

async function save() {
  errorMsg.value = ''

  if (!form.product || !form.warehouse || !form.quantidadeAbsoluta) {
    errorMsg.value = tdc('Produto, armazém e quantidade são obrigatórios.')
    return
  }

  const sinal = form.tipo === 'saida' ? -1 : 1
  const quantidade = sinal * Math.abs(form.quantidadeAbsoluta)

  saving.value = true
  try {
    Stockmovement.form = {
      product: form.product,
      warehouse: form.warehouse,
      tipo: form.tipo,
      quantidade,
      motivo: form.motivo || null,
    }
    await Stockmovement.create()
    showForm.value = false
    await fetch()
  } catch (e) {
    errorMsg.value = e?.response?.data?.detail || e?.response?.data?.[0] || tdc('Erro ao gravar movimento.')
  } finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>
