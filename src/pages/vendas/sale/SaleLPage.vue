<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="point_of_sale" class="q-mr-sm" />
      {{ tdc('Vendas') }}
      <q-space />
      <q-input
        v-model="search" dense outlined debounce="400"
        :placeholder="tdc('Pesquisar')" style="width: 220px" class="q-mr-sm"
        @update:model-value="onSearch"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <q-btn color="primary" icon="add" :label="tdc('Nova Venda')" :to="{ name: 'add_sale' }" />
    </div>

    <q-table
      flat bordered
      :rows="Sale.rows"
      :columns="columns"
      row-key="id"
      :loading="Sale.loading"
      v-model:pagination="pagination"
      @request="onRequest"
      @row-click="(evt, row) => router.push({ name: 'view_sale', params: { id: row.id } })"
    >
      <template #body-cell-estado="props">
        <q-td :props="props">
          <q-badge :color="estadoColor(props.row.estado?.value || props.row.estado)">
            {{ props.row.estado?.label || props.row.estado }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'
import { useSaleStore } from './saleStore'

const Sale = useSaleStore()
const router = useRouter()
const search = ref('')

const columns = [
  { name: 'data', label: tdc('Data'), field: 'data', align: 'left' },
  { name: 'customer', label: tdc('Cliente'), field: row => row.cliente_label || row.customer?.label || tdc('Cliente Balcão'), align: 'left' },
  { name: 'estado', label: tdc('Estado'), field: 'estado', align: 'left' },
  { name: 'total', label: tdc('Total'), field: 'total', align: 'right' },
  { name: 'saldo_devedor', label: tdc('Saldo em Dívida'), field: 'saldo_devedor', align: 'right' },
]

function estadoColor(estado) {
  return { rascunho: 'grey', confirmada: 'info', paga: 'positive', anulada: 'negative' }[estado] || 'grey'
}

const pagination = reactive({ page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: 'data', descending: true })

async function fetch() {
  await Sale.loadData({ page: pagination.page, page_size: pagination.rowsPerPage })
  pagination.rowsNumber = Sale.pagination.rowsNumber
}

function onRequest(props) {
  pagination.page = props.pagination.page
  pagination.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

function onSearch(value) {
  Sale.setSearch(value)
  pagination.page = 1
  fetch()
}

onMounted(fetch)
</script>
