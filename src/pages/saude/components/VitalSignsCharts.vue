<template>
  <div data-test="vital-signs-charts">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="42px" />
    </div>

    <div v-else-if="errorMsg" class="text-negative text-caption q-pa-md text-center">{{ errorMsg }}</div>

    <div v-else-if="!charts.length" class="text-caption text-grey-6 q-pa-xl text-center" data-test="vital-signs-charts-empty">
      {{ tdc('No vital signs recorded yet for this patient.') }}
    </div>

    <template v-else>
      <div class="text-caption text-grey-6 q-mb-sm">
        {{ tdc('Records') }}: {{ points.length }}<span v-if="points.length >= limit"> · {{ tdc('Showing the latest') }}</span>
      </div>
      <div class="row q-col-gutter-md">
        <div
          v-for="chart in charts" :key="chart.key" :data-test="`vital-chart-${chart.key}`"
          :class="mode === 'all' ? 'col-12' : 'col-12 col-md-6'"
        >
          <s-card flat bordered>
            <q-card-section class="q-pb-none">
              <div class="text-subtitle2">
                {{ tdc(chart.title) }}<span v-if="chart.unit" class="text-grey-7"> ({{ chart.unit }})</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <s-chart type="line" :labels="labels" :series="chart.series" :height="mode === 'all' ? 380 : 220" />
            </q-card-section>
          </s-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// The patient's recorded vital signs over time (GET dadovitals/history/
// ?paciente=, view_dadovital): grouped by similar magnitude, or all in one
// chart (prop `mode`). Measures with no value are left out.
import { ref, computed, watch } from 'vue'
import { tdc, url, HTTPAuth, errorMessage } from 'quasar_resaas'

const props = defineProps({
  pacienteId: { type: String, default: null },
  // 'grouped' (one chart per group of similar magnitude) or 'all' (one chart)
  mode: { type: String, default: 'grouped' },
})

const ALL_FIELDS = [
  ['ta_sistolica', 'Systolic pressure'], ['ta_diastolica', 'Diastolic pressure'],
  ['frequencia_cardiaca', 'Heart rate'], ['pulso', 'Pulse'], ['saturacao_oxigenio', 'Oxygen saturation'],
  ['temperatura', 'Temperature'], ['frequencia_respiratoria', 'Respiratory rate'],
  ['glicemia', 'Blood glucose'], ['dor', 'Pain (0-10)'], ['peso', 'Weight'],
]

const LAYOUTS = {
  // measures of similar magnitude grouped on one shared axis; a chart whose
  // series share a unit shows it in the title, otherwise each series carries
  // its own unit in the legend
  grouped: [
    { key: 'pressure', title: 'Blood Pressure', fields: [['ta_sistolica', 'Systolic pressure'], ['ta_diastolica', 'Diastolic pressure']] },
    { key: 'cardio', title: 'Heart rate, pulse and SpO₂', fields: [['frequencia_cardiaca', 'Heart rate'], ['pulso', 'Pulse'], ['saturacao_oxigenio', 'Oxygen saturation']] },
    { key: 'temperature_respiratory', title: 'Temperature and respiratory rate', fields: [['temperatura', 'Temperature'], ['frequencia_respiratoria', 'Respiratory rate']] },
    { key: 'glucose_pain', title: 'Blood glucose and pain', fields: [['glicemia', 'Blood glucose'], ['dor', 'Pain (0-10)']] },
    { key: 'weight', title: 'Weight', fields: [['peso', 'Weight']] },
  ],
  // every measure in ONE chart: clicking a measure in the legend hides / shows
  // it and the axis rescales to the visible ones
  all: [{ key: 'all', title: 'Vital signs', fields: ALL_FIELDS }],
}

const points = ref([])
const units = ref({})
const limit = ref(100)
const loading = ref(false)
const errorMsg = ref('')

const labels = computed(() => points.value.map(p => `${(p.date || '').slice(8, 10)}/${(p.date || '').slice(5, 7)} ${p.time || ''}`))

const hasValues = field => points.value.some(p => p[field] !== null && p[field] !== undefined)

const charts = computed(() => (LAYOUTS[props.mode] || LAYOUTS.grouped)
  .map(chart => ({ ...chart, fields: chart.fields.filter(([field]) => hasValues(field)) }))
  .filter(chart => chart.fields.length)
  .map(chart => {
    const chartUnits = [...new Set(chart.fields.map(([field]) => units.value[field] || ''))]
    const shared = chartUnits.length === 1
    return {
      key: chart.key,
      title: chart.title,
      unit: shared ? chartUnits[0] : '',
      series: chart.fields.map(([field, name]) => {
        const unit = units.value[field]
        return {
          // translated here: with its unit appended the name is no translation key
          name: !shared && unit ? `${tdc(name)} (${unit})` : tdc(name),
          data: points.value.map(p => p[field]),
        }
      }),
    }
  }))

async function load () {
  points.value = []
  errorMsg.value = ''
  if (!props.pacienteId) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'saude/dadovitals/history/', params: { paciente: props.pacienteId } }))
    points.value = data.points || []
    units.value = data.units || {}
    limit.value = data.limit || 100
  } catch (e) {
    errorMsg.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(() => props.pacienteId, load, { immediate: true })

defineExpose({ reload: load })
</script>
