<template>
  <!-- The results page's "Data" view: what was entered for the patient's exams,
       validated or not, by parameter (resultadoexamemedicos/data/,
       list_resultadoexamemedico), newest first. -->
  <div class="results-data q-pa-sm" data-test="results-data">
    <!-- Results: what was entered; Evolution: one parameter over time (chart +
         table, validated results - lab_evolution_paciente) -->
    <q-tabs v-if="canEvolution" v-model="tab" dense no-caps align="left" active-color="primary" indicator-color="primary" class="q-mb-sm">
      <q-tab name="results" icon="list_alt" :label="tdc('Results')" data-test="results-data-tab-results" />
      <q-tab name="evolution" icon="show_chart" :label="tdc('Evolution')" data-test="results-data-tab-evolution" />
    </q-tabs>

    <LabEvolutionPanel v-if="tab === 'evolution'" :paciente-id="paciente" />

    <template v-else>
    <div v-if="loading && !rows.length" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="40px" />
    </div>

    <div v-else-if="!rows.length" class="text-center text-grey-7 q-pa-xl">
      <q-icon name="table_chart" size="40px" />
      <div class="q-mt-sm">{{ tdc(search ? 'No results match the search.' : 'No results entered yet.') }}</div>
    </div>

    <s-card v-for="row in rows" :key="row.id" flat bordered class="q-mb-sm" :data-test="`results-data-${row.id}`">
      <q-card-section class="row items-center q-py-sm q-gutter-x-sm">
        <div class="text-subtitle2 text-weight-bold">{{ row.exam?.name }}</div>
        <div class="text-caption text-grey-7">{{ formatDate(row.date) }} · {{ tdc('Revision') }} {{ row.revision }}</div>
        <q-space />
        <q-badge outline :color="row.validated ? 'positive' : 'grey-7'" :label="tdc(row.validated ? 'Validated' : 'Not validated')" />
        <q-badge v-if="row.released" outline color="primary" :label="tdc('Released')" />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="row.value" class="q-py-sm">
        <span class="text-caption text-grey-7">{{ tdc('Result value') }}:</span> <b>{{ row.value }}</b>
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

    <div v-if="hasMore" class="text-center q-mt-sm">
      <s-btn flat no-caps color="primary" icon="expand_more" :label="tdc('Load more')" :loading="loading" @click="load(page + 1)">
        <s-tooltip>{{ tdc('Load more') }}</s-tooltip>
      </s-btn>
    </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { date } from 'quasar'
import { tdc, url, HTTPAuth, useUserStore } from 'quasar_resaas'
import LabEvolutionPanel from './LabEvolutionPanel.vue'

const props = defineProps({
  paciente: { type: String, default: null },
  // the toolbar's search: exam name, parameter name or free value
  search: { type: String, default: '' }
})

const PAGE_SIZE = 20

const User = useUserStore()
// the evolution reads validated results through pacientes/{id}/lab_evolution/
const canEvolution = computed(() => User.can('lab_evolution_paciente'))
const tab = ref('results')

const rows = ref([])
const page = ref(1)
const total = ref(0)
const loading = ref(false)

const hasMore = computed(() => rows.value.length < total.value)

const formatDate = (value) => (value ? date.formatDate(value, 'DD/MM/YYYY HH:mm') : '')

function reference (ref) {
  if (!ref) return ''
  if (ref.low != null && ref.high != null) return `${ref.low} – ${ref.high}`
  if (ref.low != null) return `≥ ${ref.low}`
  if (ref.high != null) return `≤ ${ref.high}`
  return ref.label || ''
}

const flagLabel = (flag) => ({ normal: 'Normal', low: 'Low', high: 'High', critical_low: 'Critical low', critical_high: 'Critical high' }[flag] || flag)
const flagColor = (flag) => (String(flag).startsWith('critical') ? 'negative' : flag === 'normal' ? 'positive' : 'orange-8')

async function load (next = 1) {
  if (!props.paciente) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/resultadoexamemedicos/data/',
      params: { paciente: props.paciente, search: props.search || undefined, page: next, page_size: PAGE_SIZE }
    }))
    rows.value = next === 1 ? (data.results || []) : [...rows.value, ...(data.results || [])]
    total.value = data.pagination?.total || 0
    page.value = next
  } finally {
    loading.value = false
  }
}

watch(() => props.paciente, () => load(1), { immediate: true })

// typing: wait a moment before asking the server
let searchTimer = null
watch(() => props.search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(1), 300)
})

defineExpose({ reload: () => load(1) })
</script>
