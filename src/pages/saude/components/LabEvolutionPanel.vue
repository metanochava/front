<template>
  <!-- Evolution of one structured lab parameter of a patient over time (chart +
       table), shared by the lab evolution dialog and the results page's Data
       view. The patient is the URL resource (pacientes/{id}/...), resolved and
       scoped by the backend; values are filtered by the database (parameter +
       date range); only validated results (lab_evolution_paciente). -->
  <div data-test="lab-evolution-panel">
    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-sm-6">
        <s-select
          v-model="parameter"
          dense
          :label="tdc('Parameter')"
          :options="parameterOptions"
          emit-value
          map-options
          :loading="loadingParameters"
          data-test="lab-evolution-parameter"
        />
      </div>
      <div class="col-6 col-sm-3"><s-input v-model="dateFrom" dense type="date" :label="tdc('From')" /></div>
      <div class="col-6 col-sm-3"><s-input v-model="dateTo" dense type="date" :label="tdc('To')" /></div>
    </div>

    <div v-if="!loadingParameters && !parameters.length" class="text-grey-7 q-pa-md" data-test="lab-evolution-empty">
      {{ tdc('No validated structured results for this patient yet.') }}
    </div>

    <div v-else-if="loading" class="flex flex-center q-pa-lg"><q-spinner size="40px" /></div>

    <div v-else-if="evolution">
      <div v-if="!evolution.points.length" class="text-grey-7 q-pa-md">{{ tdc('No results in this period.') }}</div>

      <template v-else>
        <div v-if="evolution.comparison?.current" class="row q-col-gutter-sm q-mb-md text-center">
          <div class="col-4">
            <div class="text-caption text-grey-7">{{ tdc('Previous') }}</div>
            <div class="text-h6">{{ evolution.comparison.previous?.value ?? '-' }}</div>
          </div>
          <div class="col-4">
            <div class="text-caption text-grey-7">{{ tdc('Current') }}</div>
            <div class="text-h6">{{ evolution.comparison.current.value }} <small>{{ evolution.parameter.unit }}</small></div>
          </div>
          <div class="col-4">
            <div class="text-caption text-grey-7">{{ tdc('Change') }}</div>
            <div class="text-h6">{{ evolution.comparison.change ?? '-' }}</div>
          </div>
        </div>

        <!-- a chart only for graphable (numeric) parameters with at least two points:
             never a chart built from text -->
        <template v-if="mode !== 'table'">
          <LineChartWidget v-if="canChart" :data="chart" :options="chartOptions" class="q-mb-md" data-test="lab-evolution-chart" />
          <div v-else-if="mode === 'chart'" class="text-grey-7 q-pa-md" data-test="lab-evolution-no-chart">
            {{ tdc('This parameter needs at least two numeric results for a chart.') }}
          </div>
        </template>

        <q-markup-table v-if="mode !== 'chart'" flat bordered dense separator="horizontal">
          <thead>
            <tr>
              <th class="text-left">{{ tdc('Date') }}</th>
              <th class="text-right">{{ tdc('Value') }}</th>
              <th class="text-left gt-xs">{{ tdc('Reference') }}</th>
              <th class="text-left">{{ tdc('Flag') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in evolution.points" :key="p.result">
              <td>{{ new Date(p.date).toLocaleDateString() }}</td>
              <td class="text-right">{{ p.value }} {{ p.unit || '' }}</td>
              <td class="gt-xs">{{ referenceText(p.reference) }}</td>
              <td>{{ p.flag ? tdc(flagLabel(p.flag)) : '-' }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { HTTPAuth, url, tdc, resolveWidgetComponent } from 'quasar_resaas'
import { labChartData, labChartOptions } from './labChart'

// the dashboard engine's line chart, through the package's public API
// (only '.', './auto-imports' and './core/*' are exported)
const LineChartWidget = resolveWidgetComponent('line_chart')

const props = defineProps({
  pacienteId: { type: [String, Number], default: null },
  // load when shown (the dialog passes its open state)
  active: { type: Boolean, default: true },
  // 'all' (chart + table, the dialog), 'table' or 'chart' (the Data view's tabs)
  mode: { type: String, default: 'all' }
})

const parameters = ref([])
const parameter = ref(null)
const dateFrom = ref(null)
const dateTo = ref(null)
const evolution = ref(null)
const loading = ref(false)
const loadingParameters = ref(false)

const FLAGS = { low: 'Low', high: 'High', normal: 'Normal', critical_low: 'Critical low', critical_high: 'Critical high' }
function flagLabel (flag) { return FLAGS[flag] || flag }

const parameterOptions = computed(() =>
  parameters.value.map((p) => ({ value: p.code, label: `${tdc(p.name)}${p.unit ? ` (${p.unit})` : ''}` }))
)

const canChart = computed(() => evolution.value?.parameter?.graphable && evolution.value.points.length > 1)
const chart = computed(() => labChartData(evolution.value, (d) => new Date(d).toLocaleDateString()))
const chartOptions = computed(() => labChartOptions(evolution.value))

function referenceText (ref) {
  if (!ref || (ref.low == null && ref.high == null)) return '-'
  return [ref.low, ref.high].filter((v) => v != null).join(' - ')
}

function endpoint (suffix, params = {}) {
  return url({ type: 'u', url: `saude/pacientes/${props.pacienteId}/${suffix}/`, params })
}

async function loadParameters () {
  if (!props.pacienteId) return
  loadingParameters.value = true
  try {
    const { data } = await HTTPAuth.get(endpoint('lab_parameters'))
    parameters.value = data || []
    parameter.value = parameters.value.find((p) => p.graphable)?.code || parameters.value[0]?.code || null
  } finally {
    loadingParameters.value = false
  }
}

async function loadEvolution () {
  if (!parameter.value) { evolution.value = null; return }
  loading.value = true
  try {
    const params = { parameter: parameter.value }
    if (dateFrom.value) params.from = dateFrom.value
    if (dateTo.value) params.to = dateTo.value
    const { data } = await HTTPAuth.get(endpoint('lab_evolution', params))
    evolution.value = data
  } finally {
    loading.value = false
  }
}

watch(() => [props.active, props.pacienteId], ([isActive]) => { if (isActive) loadParameters() }, { immediate: true })
watch([parameter, dateFrom, dateTo], loadEvolution)
</script>
