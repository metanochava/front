<template>
  <!-- One entered result (lab_result_service._result_row): the exam, its
       status, the value, report and observation typed with it and the
       parameter values. Shared by the results page's Data view and the
       file preview. -->
  <s-card flat bordered :data-test="`result-values-${row.id}`">
    <q-card-section v-if="header" class="row items-center q-py-sm q-gutter-x-sm">
      <div class="text-subtitle2 text-weight-bold">{{ row.exam?.name }}</div>
      <div class="text-caption text-grey-7">{{ formatDate(row.date) }} · {{ tdc('Revision') }} {{ row.revision }}</div>
      <q-space />
      <q-badge outline :color="row.validated ? 'positive' : 'grey-7'" :label="tdc(row.validated ? 'Validated' : 'Not validated')" />
      <q-badge v-if="row.released" outline color="primary" :label="tdc('Released')" />
    </q-card-section>

    <q-separator v-if="header" />

    <!-- the date and revision when the header is the caller's (results modal) -->
    <q-card-section v-if="!header" class="q-py-xs text-caption text-grey-7">
      {{ formatDate(row.date) }} · {{ tdc('Revision') }} {{ row.revision }}
    </q-card-section>

    <q-card-section v-if="row.value || row.report || row.observation" class="q-py-sm q-gutter-y-xs">
      <div v-if="row.value"><span class="text-caption text-grey-7">{{ tdc('Result value') }}:</span> <b>{{ row.value }}</b></div>
      <!-- report and observation are the lab's rich text (s-editor), sanitized -->
      <div v-if="row.report">
        <div class="text-caption text-grey-7">{{ tdc('Findings') }}</div>
        <!-- eslint-disable-next-line vue/no-v-html -- sanitizeClinicalHtml -->
        <div class="result-values__text" v-html="sanitizeClinicalHtml(row.report)" />
      </div>
      <div v-if="row.observation">
        <div class="text-caption text-grey-7">{{ tdc('Observation') }}</div>
        <!-- eslint-disable-next-line vue/no-v-html -- sanitizeClinicalHtml -->
        <div class="result-values__text" v-html="sanitizeClinicalHtml(row.observation)" />
      </div>
    </q-card-section>

    <q-markup-table v-if="row.values?.length" flat dense separator="horizontal">
      <thead>
        <tr>
          <th class="text-left">{{ tdc('Parameter') }}</th>
          <th class="text-left">{{ tdc('Value') }}</th>
          <th class="text-left">{{ tdc('Unit') }}</th>
          <th class="text-left">{{ tdc('Reference') }}</th>
          <th class="text-right">{{ tdc('Flag') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in row.values" :key="value.code">
          <td>{{ value.name }}</td>
          <td class="text-weight-bold">{{ value.value ?? '-' }}</td>
          <td>{{ value.unit || '' }}</td>
          <td>{{ reference(value.reference) }}</td>
          <td class="text-right">
            <q-badge v-if="value.flag" outline :color="flagColor(value.flag)" :label="tdc(flagLabel(value.flag))" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </s-card>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { sanitizeClinicalHtml } from './clinicalHtml'

defineProps({
  row: { type: Object, required: true },
  // false: the caller shows the exam name and status (results modal)
  header: { type: Boolean, default: true }
})

const formatDate = (value) => ds(value)

function reference (ref) {
  if (!ref) return ''
  if (ref.low != null && ref.high != null) return `${ref.low} – ${ref.high}`
  if (ref.low != null) return `≥ ${ref.low}`
  if (ref.high != null) return `≤ ${ref.high}`
  return ref.label || ''
}

const flagLabel = (flag) => ({ normal: 'Normal', low: 'Low', high: 'High', critical_low: 'Critical low', critical_high: 'Critical high' }[flag] || flag)
const flagColor = (flag) => (String(flag).startsWith('critical') ? 'negative' : flag === 'normal' ? 'positive' : 'orange-8')
</script>

<style scoped>
.result-values__text { white-space: pre-line; }
</style>
