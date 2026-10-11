<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="balance" />
      <span>{{ tdc('Trial balance') }}</span>
    </div>

    <div class="row q-col-gutter-sm items-start q-mb-sm">
      <div class="col-6 col-sm-3"><s-date v-model="filters.date_from" :label="tdc('From')" clearable /></div>
      <div class="col-6 col-sm-3"><s-date v-model="filters.date_to" :label="tdc('To')" clearable /></div>
      <div class="col-12 col-sm-auto">
        <s-btn color="primary" icon="refresh" :label="tdc('Update')" :loading="loading" data-test="tb-load" @click="load" />
      </div>
    </div>

    <q-table
      flat bordered :rows="report.rows" :columns="columns" row-key="account"
      hide-pagination :rows-per-page-options="[0]" :loading="loading" :no-data-label="tdc('No data')"
      data-test="tb-table"
    >
      <template #bottom-row>
        <q-tr class="text-weight-bold">
          <q-td colspan="3">{{ tdc('Total') }}</q-td>
          <q-td class="text-right">{{ money(report.total_debit) }}</q-td>
          <q-td class="text-right">{{ money(report.total_credit) }}</q-td>
          <q-td />
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'

const filters = reactive({ date_from: null, date_to: null })
const report = ref({ rows: [], total_debit: 0, total_credit: 0 })
const loading = ref(false)

const money = (value) => Number(value || 0).toFixed(2)

const columns = [
  { name: 'code', label: tdc('Code'), field: 'code', align: 'left' },
  { name: 'name', label: tdc('Account'), field: 'name', align: 'left' },
  { name: 'account_type', label: tdc('Type'), field: 'account_type', align: 'left', format: (value) => tdc(value.charAt(0).toUpperCase() + value.slice(1)) },
  { name: 'debit', label: tdc('Debit'), field: 'debit', align: 'right', format: money },
  { name: 'credit', label: tdc('Credit'), field: 'credit', align: 'right', format: money },
  { name: 'balance', label: tdc('Balance'), field: 'balance', align: 'right', format: money },
]

async function load() {
  loading.value = true
  try {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'accounting/accounts/trial_balance/', params }))
    report.value = data
  } catch {
    // shown by the alert funnel
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
