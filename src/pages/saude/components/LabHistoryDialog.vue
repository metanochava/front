<template>
  <q-dialog v-model="open">
    <s-modal-card :title="tdc('Lab history')" icon="history" width="860px" data-test="lab-history-dialog" @close="open = false">
      <template #subheader>
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 col-sm-6">
            <s-select
              v-model="parameter"
              :label="tdc('Parameter')"
              :options="parameterOptions"
              emit-value
              map-options
              clearable
              data-test="lab-history-parameter"
            />
          </div>
          <div class="col-6 col-sm-3"><s-input v-model="dateFrom" type="date" :label="tdc('From')" /></div>
          <div class="col-6 col-sm-3"><s-input v-model="dateTo" type="date" :label="tdc('To')" /></div>
        </div>
      </template>

      <div v-if="loading && !results.length" class="flex flex-center q-pa-lg"><q-spinner size="40px" /></div>

      <div v-else-if="!results.length" class="text-grey-7 q-pa-md" data-test="lab-history-empty">
        {{ tdc('No validated exam results for this patient yet.') }}
      </div>

      <q-list v-else separator>
        <q-expansion-item
          v-for="r in results" :key="r.id"
          dense-toggle
          :data-test="`lab-history-${r.id}`"
        >
          <template #header>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ tdc(r.exam.name) }}</q-item-label>
              <q-item-label caption>
                {{ formatDate(r.date) }} · {{ tdc('Revision') }} {{ r.revision }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="r.released ? 'info' : 'grey'" :label="tdc(r.released ? 'Released' : 'Not released')" />
            </q-item-section>
          </template>

          <!-- the values as recorded (snapshot), never today's configuration -->
          <q-markup-table flat dense class="q-mb-sm">
            <thead>
              <tr>
                <th class="text-left">{{ tdc('Parameter') }}</th>
                <th class="text-right">{{ tdc('Value') }}</th>
                <th class="text-right">{{ tdc('Reference') }}</th>
                <th class="text-right">{{ tdc('Flag') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in r.values" :key="v.code">
                <td>{{ tdc(v.name) }}</td>
                <td class="text-right">{{ v.value }} <small>{{ v.unit }}</small></td>
                <td class="text-right">{{ referenceText(v.reference) }}</td>
                <td class="text-right">{{ v.flag ? tdc(flagLabel(v.flag)) : '-' }}</td>
              </tr>
              <tr v-if="!r.values.length">
                <td colspan="4">{{ r.value || tdc('Free-form result (report or attachment).') }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-expansion-item>
      </q-list>

      <div v-if="results.length < total" class="text-center q-pa-sm">
        <s-btn flat no-caps :loading="loading" :label="tdc('Load more')" data-test="lab-history-more" @click="load(page + 1)" />
      </div>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// The patient's validated exam results (GET pacientes/{id}/lab_history/,
// lab_evolution_paciente): filtered and paginated by the backend, each with
// the values as they were recorded.
import { computed, ref, watch } from 'vue'
import { HTTPAuth, url, tdc } from 'quasar_resaas'

const props = defineProps({
  modelValue: Boolean,
  pacienteId: { type: [String, Number], default: null }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const parameters = ref([])
const parameter = ref(null)
const dateFrom = ref('')
const dateTo = ref('')
const results = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)

const FLAGS = { low: 'Low', high: 'High', normal: 'Normal', critical_low: 'Critical low', critical_high: 'Critical high' }
function flagLabel (flag) { return FLAGS[flag] || flag }

const parameterOptions = computed(() =>
  parameters.value.map((p) => ({ value: p.code, label: `${tdc(p.name)}${p.unit ? ` (${p.unit})` : ''}` }))
)

function referenceText (ref) {
  if (!ref || (ref.low == null && ref.high == null)) return '-'
  return [ref.low, ref.high].filter((v) => v != null).join(' - ')
}

function formatDate (value) {
  return value ? new Date(value).toLocaleString() : '-'
}

function endpoint (suffix, params = {}) {
  return url({ type: 'u', url: `saude/pacientes/${props.pacienteId}/${suffix}/`, params })
}

async function loadParameters () {
  const { data } = await HTTPAuth.get(endpoint('lab_parameters'))
  parameters.value = data || []
}

async function load (nextPage = 1) {
  if (!props.pacienteId) return
  loading.value = true
  try {
    const params = { page: nextPage }
    if (parameter.value) params.parameter = parameter.value
    if (dateFrom.value) params.from = dateFrom.value
    if (dateTo.value) params.to = dateTo.value
    const { data } = await HTTPAuth.get(endpoint('lab_history', params))
    results.value = nextPage === 1 ? data.results : [...results.value, ...data.results]
    total.value = data.pagination.total
    page.value = nextPage
  } finally {
    loading.value = false
  }
}

watch(() => [props.modelValue, props.pacienteId], ([isOpen]) => {
  if (!isOpen) return
  loadParameters()
  load(1)
}, { immediate: true })
watch([parameter, dateFrom, dateTo], () => load(1))
</script>
