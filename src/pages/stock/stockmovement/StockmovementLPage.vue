<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="receipt_long" class="q-mr-sm" />
      {{ tdc('Stock Movements') }}
      <q-space />
      <q-btn color="primary" icon="add" :label="tdc('New Movement')" @click="openForm" />
    </div>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-5">
        <s-select
          v-model="filterProduct"
          :api="productSelectUrl"
          option-label="label" option-value="value"
          emit-value map-options clearable
          :label="tdc('Filter by Product')"
          @update:model-value="fetch"
        />
      </div>
      <div class="col-12 col-sm-5">
        <s-select
          v-model="filterWarehouse"
          :api="warehouseSelectUrl"
          option-label="label" option-value="value"
          emit-value map-options clearable
          :label="tdc('Filter by Warehouse')"
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
      <s-modal-card :title="tdc('New Stock Movement')" width="420px">
        <div class="q-gutter-md">
          <s-select
            v-model="form.product"
            :api="productSelectUrl"
            option-label="label" option-value="value"
            emit-value map-options
            :label="tdc('Product')"
          />
          <s-select
            v-model="form.warehouse"
            :api="warehouseSelectUrl"
            option-label="label" option-value="value"
            emit-value map-options
            :label="tdc('Warehouse')"
          />
          <q-select
            v-model="form.tipo"
            :options="tipoOptions"
            emit-value map-options
            :label="tdc('Type')"
          />
          <q-input
            v-model.number="form.quantidadeAbsoluta"
            type="number" min="0" step="0.001"
            :label="tdc('Quantity')"
          />
          <q-input
            v-model="form.motivo"
            type="textarea"
            :label="tdc('Reason') + (form.tipo === 'ajuste' ? ' *' : '')"
            :hint="form.tipo === 'ajuste' ? tdc('Required for adjustments') : ''"
          />
          <div v-if="errorMsg" class="text-negative text-caption">{{ errorMsg }}</div>

        </div>

        <template #footer>
          <q-btn flat :label="tdc('Cancel')" v-close-popup />
          <q-btn color="primary" :label="tdc('Save')" :loading="saving" @click="save" />

        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tdc, url, errorMessage } from 'quasar_resaas'
import { useStockmovementStore } from './stockmovementStore'

const Stockmovement = useStockmovementStore()

const filterProduct = ref(null)
const filterWarehouse = ref(null)

const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })

const columns = [
  { name: 'data', label: tdc('Date'), field: 'data', align: 'left' },
  { name: 'product', label: tdc('Product'), field: row => row.product?.label, align: 'left' },
  { name: 'warehouse', label: tdc('Warehouse'), field: row => row.warehouse?.label, align: 'left' },
  { name: 'tipo', label: tdc('Type'), field: 'tipo', align: 'left' },
  { name: 'quantidade', label: tdc('Quantity'), field: 'quantidade', align: 'right' },
  { name: 'motivo', label: tdc('Reason'), field: 'motivo', align: 'left' },
]

const pagination = ref({
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
    page: pagination.value.page,
    page_size: pagination.value.rowsPerPage,
    product: filterProduct.value || undefined,
    warehouse: filterWarehouse.value || undefined,
  })
  pagination.value.rowsNumber = Stockmovement.pagination.rowsNumber
}

function onRequest(props) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

const showForm = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const tipoOptions = [
  { label: tdc('Inbound'), value: 'entrada' },
  { label: tdc('Outbound'), value: 'saida' },
  { label: tdc('Adjustment'), value: 'ajuste' },
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
    errorMsg.value = tdc('Product, warehouse and quantity are required.')
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
    errorMsg.value = errorMessage(e) || tdc('Error saving movement.')
  } finally {
    saving.value = false
  }
}

onMounted(fetch)
</script>
