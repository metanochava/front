<template>
  <q-page class="q-pa-sm">
    <div class="row items-center q-mb-sm">
      <div class="text-h6">{{ tdc('Tables') }}</div>
      <q-space />
      <s-btn
        v-if="User.can('qr_cards_diningtable')"
        unelevated rounded color="primary" icon="qr_code_2" no-caps
        :label="tdc('Print QR codes')"
        :loading="loading"
        data-test="tables-print-qr"
        @click="printAll"
      >
        <s-tooltip>{{ tdc('One card per active table, to put on the tables') }}</s-tooltip>
      </s-btn>
    </div>

    <s-auto-crud
      app="hospitality" model="DiningTable"
      :ignoreFields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'qr_token', 'current_sale_id']"
      :ignoreFieldsFilter="['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'qr_token', 'current_sale_id']"
    />

    <s-pdf-render v-model="showPdf" :src="pdfUrl" :title="tdc('Table QR codes')" :top="false" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { tdc, useUserStore, errorMessage } from 'quasar_resaas'
import { useQuasar } from 'quasar'
import { useTableStore } from './tableStore'

// The branch's tables (schema-driven list) and their QR cards (PDF): a new QR
// code for one table is the "New QR code" action of its row.
const Table = useTableStore()
const User = useUserStore()
const $q = useQuasar()
const loading = ref(false)
const showPdf = ref(false)
const pdfUrl = ref(null)

async function printAll () {
  loading.value = true
  try {
    pdfUrl.value = await Table.qrCards()
    showPdf.value = true
  } catch (e) {
    $q.notify?.({ type: 'negative', message: errorMessage(e) || tdc('An error occurred. Please try again.') })
  } finally {
    loading.value = false
  }
}
</script>
