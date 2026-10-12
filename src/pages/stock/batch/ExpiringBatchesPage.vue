<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="event_busy" />
      <span>{{ tdc('Expiring lots') }}</span>
      <q-space />
      <s-input v-model.number="days" type="number" min="0" style="width: 140px" :label="tdc('Days')" @update:model-value="load" />
      <s-btn flat icon="refresh" :loading="loading" @click="load" />
    </div>

    <q-table
      flat bordered :rows="rows" :columns="columns" row-key="batch"
      :loading="loading" :no-data-label="tdc('No lots expire in this period.')"
      :rows-per-page-options="[25, 50, 0]" data-test="expiring-table"
    >
      <template #body-cell-expiry_date="props">
        <q-td :props="props">
          <q-badge :color="props.row.expired ? 'negative' : props.row.days_left <= 7 ? 'warning' : 'info'">
            {{ props.row.expiry_date }}
          </q-badge>
          <span class="q-ml-sm text-caption">
            {{ props.row.expired ? tdc('Expired') : props.row.days_left + ' ' + tdc('days') }}
          </span>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'

const days = ref(30)
const rows = ref([])
const loading = ref(false)

const columns = [
  { name: 'product_name', label: tdc('Product'), field: 'product_name', align: 'left' },
  { name: 'lot_number', label: tdc('Lot'), field: 'lot_number', align: 'left' },
  { name: 'expiry_date', label: tdc('Expiry date'), field: 'expiry_date', align: 'left' },
  { name: 'warehouse_name', label: tdc('Warehouse'), field: 'warehouse_name', align: 'left' },
  { name: 'quantity', label: tdc('Quantity'), field: 'quantity', align: 'right' },
]

async function load() {
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'inventory/batches/expiring/', params: { days: days.value || 0 } }))
    rows.value = data
  } catch {
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
