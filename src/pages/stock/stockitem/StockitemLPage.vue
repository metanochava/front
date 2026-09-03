<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="inventory" class="q-mr-sm" />
      {{ tdc('Saldo de Stock') }}
      <q-space />
      <q-input
        v-model="search" dense outlined debounce="400"
        :placeholder="tdc('Pesquisar')" style="width: 260px"
        @update:model-value="onSearch"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-table
      flat bordered
      :rows="Stockitem.rows"
      :columns="columns"
      row-key="id"
      :loading="Stockitem.loading"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template #body-cell-quantidade="props">
        <q-td :props="props">
          <span :class="Number(props.value) <= 0 ? 'text-negative text-weight-bold' : ''">
            {{ props.value }}
          </span>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import { useStockitemStore } from './stockitemStore'

const Stockitem = useStockitemStore()
const search = ref('')

const columns = [
  { name: 'product', label: tdc('Produto'), field: row => row.product?.label, align: 'left' },
  { name: 'warehouse', label: tdc('Armazém'), field: row => row.warehouse?.label, align: 'left' },
  { name: 'quantidade', label: tdc('Quantidade'), field: 'quantidade', align: 'right' },
]

const pagination = reactive({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

async function fetch() {
  await Stockitem.loadData({
    page: pagination.page,
    page_size: pagination.rowsPerPage,
  })
  pagination.rowsNumber = Stockitem.pagination.rowsNumber
}

function onRequest(props) {
  pagination.page = props.pagination.page
  pagination.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

function onSearch(value) {
  Stockitem.setSearch(value)
  pagination.page = 1
  fetch()
}

onMounted(fetch)
</script>
