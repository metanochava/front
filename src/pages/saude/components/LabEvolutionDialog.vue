<template>
  <q-dialog v-model="open">
    <s-modal-card :title="tdc('Lab evolution')" icon="show_chart" width="860px" data-test="lab-evolution-dialog" @close="open = false">
      <template #subheader>
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 col-sm-6">
            <s-select
              v-model="parameter"
              :label="tdc('Parameter')"
              :options="parameterOptions"
              emit-value
              map-options
              :loading="loadingParameters"
              data-test="lab-evolution-parameter"
            />
          </div>
          <div class="col-6 col-sm-3"><s-input v-model="dateFrom" type="date" :label="tdc('From')" /></div>
          <div class="col-6 col-sm-3"><s-input v-model="dateTo" type="date" :label="tdc('To')" /></div>
        </div>
      </template>

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

          <!-- a chart only for numeric parameters with at least two points:
               never a chart built from text -->
          <LineChartWidget v-if="evolution.parameter.numeric && evolution.points.length > 1" :data="chart" class="q-mb-md" />

          <q-markup-table flat bordered dense separator="horizontal">
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
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// Evolution of one structured lab parameter of a patient. The patient is the
// URL resource (pacientes/{id}/...), resolved and scoped by the backend;
// values are filtered by the database (parameter + date range).
import { computed, ref, watch } from 'vue'
import { HTTPAuth, url, tdc } from 'quasar_resaas'
import LineChartWidget from 'quasar_resaas/components/dashboard/LineChartWidget.vue'

const props = defineProps({
  modelValue: Boolean,
  pacienteId: { type: [String, Number], default: null }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })

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

const chart = computed(() => ({
  labels: evolution.value.points.map((p) => new Date(p.date).toLocaleDateString()),
  series: [{ name: evolution.value.parameter.name, data: evolution.value.points.map((p) => Number(p.value)) }]
}))

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

watch(() => [props.modelValue, props.pacienteId], ([isOpen]) => { if (isOpen) loadParameters() }, { immediate: true })
watch([parameter, dateFrom, dateTo], loadEvolution)
</script>
