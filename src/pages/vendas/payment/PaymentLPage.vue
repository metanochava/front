<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="payments" class="q-mr-sm" />
      {{ tdc('Pagamentos') }}
    </div>

    <q-table
      flat bordered
      :rows="Payment.rows"
      :columns="columns"
      row-key="id"
      :loading="Payment.loading"
      v-model:pagination="pagination"
      @request="onRequest"
    />
  </q-page>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import { usePaymentStore } from './paymentStore'

const Payment = usePaymentStore()

const columns = [
  { name: 'sale', label: tdc('Venda'), field: row => row.sale?.label, align: 'left' },
  { name: 'valor', label: tdc('Valor'), field: 'valor', align: 'right' },
  { name: 'forma_pagamento', label: tdc('Forma de Pagamento'), field: row => row.forma_pagamento?.label || row.forma_pagamento, align: 'left' },
  { name: 'referencia', label: tdc('Referência'), field: 'referencia', align: 'left' },
  { name: 'data', label: tdc('Data'), field: 'data', align: 'left' },
]

const pagination = reactive({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

async function fetch() {
  await Payment.loadData({
    page: pagination.page,
    page_size: pagination.rowsPerPage,
  })
  pagination.rowsNumber = Payment.pagination.rowsNumber
}

function onRequest(props) {
  pagination.page = props.pagination.page
  pagination.rowsPerPage = props.pagination.rowsPerPage
  fetch()
}

onMounted(fetch)
</script>
