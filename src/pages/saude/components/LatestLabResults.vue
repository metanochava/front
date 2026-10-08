<template>
  <s-card flat bordered class="q-mb-md" data-test="latest-lab-results">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="science" size="22px" color="primary" class="q-mr-sm" />
      <div class="text-subtitle1 text-weight-medium">{{ tdc('Laboratory') }}</div>
      <q-space />
      <s-btn flat round size="md" icon="show_chart" data-test="latest-lab-evolution" @click="evolutionOpen = true">
        <s-tooltip>{{ tdc('Lab evolution') }}</s-tooltip>
      </s-btn>
      <s-btn flat round size="md" icon="history" data-test="latest-lab-history" @click="historyOpen = true">
        <s-tooltip>{{ tdc('Lab history') }}</s-tooltip>
      </s-btn>
      <s-btn flat round size="md" icon="refresh" :loading="loading" @click="load">
        <s-tooltip>{{ tdc('Refresh') }}</s-tooltip>
      </s-btn>
    </q-card-section>

    <q-card-section v-if="loading && !summary" class="flex flex-center q-py-lg">
      <q-spinner color="primary" size="32px" />
    </q-card-section>

    <template v-else-if="summary">
      <!-- open exams of the patient (any requester) -->
      <q-card-section class="q-pt-none">
        <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">{{ tdc('Pending exams') }}</div>
        <div v-if="!summary.pending.length" class="text-grey-7" data-test="latest-lab-no-pending">{{ tdc('No pending exams.') }}</div>
        <div v-else class="row q-gutter-xs">
          <q-chip
            v-for="p in summary.pending" :key="p.id"
            dense square outline
            :color="p.priority === 'normal' ? 'grey-7' : 'orange-8'"
            :data-test="`latest-lab-pending-${p.id}`"
          >
            {{ tdc(p.exam) }} · {{ tdc(p.state_label) }}
          </q-chip>
        </div>
      </q-card-section>

      <!-- latest RELEASED results: each value with the previous one (data only) -->
      <q-card-section class="q-pt-none">
        <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">{{ tdc('Recent results') }}</div>
        <div v-if="!summary.recent.length" class="text-grey-7" data-test="latest-lab-no-results">{{ tdc('No released results.') }}</div>
        <div v-for="r in summary.recent" :key="r.id" class="q-mb-sm" :data-test="`latest-lab-result-${r.id}`">
          <div class="row items-center q-mb-xs">
            <span class="text-weight-medium">{{ tdc(r.exam) }}</span>
            <span class="text-caption text-grey-7 q-ml-sm">{{ formatDate(r.released_at) }}</span>
            <q-badge v-if="r.new" color="primary" class="q-ml-sm" :label="tdc('New')" />
          </div>
          <q-markup-table v-if="r.values.length" flat dense bordered>
            <thead>
              <tr>
                <th class="text-left">{{ tdc('Parameter') }}</th>
                <th class="text-right">{{ tdc('Current') }}</th>
                <th class="text-right">{{ tdc('Previous') }}</th>
                <th class="text-right">{{ tdc('Change') }}</th>
                <th class="text-right">{{ tdc('Reference') }}</th>
                <th class="text-right">{{ tdc('Flag') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in r.values" :key="v.code">
                <td>{{ tdc(v.name) }}</td>
                <td class="text-right">{{ v.value }} <small>{{ v.unit }}</small></td>
                <td class="text-right">{{ v.previous ?? '-' }}</td>
                <td class="text-right">{{ v.change ?? '-' }}</td>
                <td class="text-right">{{ referenceText(v.reference) }}</td>
                <td class="text-right">
                  <q-badge v-if="v.flag && v.flag !== 'normal'" :color="flagColor(v.flag)" :label="tdc(flagLabel(v.flag))" />
                  <span v-else>{{ v.flag ? tdc('Normal') : '-' }}</span>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <div v-else class="text-grey-7">{{ r.value || tdc('Free-form result (report or attachment).') }}</div>
        </div>
      </q-card-section>
    </template>

    <LabEvolutionDialog v-model="evolutionOpen" :paciente-id="pacienteId" />
    <LabHistoryDialog v-model="historyOpen" :paciente-id="pacienteId" />
  </s-card>
</template>

<script setup>
// Laboratory panel of the consultation (lab phase 13): GET
// pacientes/{id}/lab_summary/ (lab_evolution_paciente - the backend checks
// it; the panel is only mounted for users who have it). Shows data, never an
// interpretation: the flag is the laboratory's configured reference.
import { ref, watch } from 'vue'
import { HTTPAuth, url, tdc } from 'quasar_resaas'
import LabEvolutionDialog from './LabEvolutionDialog.vue'
import LabHistoryDialog from './LabHistoryDialog.vue'

const props = defineProps({
  pacienteId: { type: [String, Number], default: null }
})

const summary = ref(null)
const loading = ref(false)
const evolutionOpen = ref(false)
const historyOpen = ref(false)

const FLAGS = { low: 'Low', high: 'High', normal: 'Normal', critical_low: 'Critical low', critical_high: 'Critical high' }
function flagLabel (flag) { return FLAGS[flag] || flag }
function flagColor (flag) { return String(flag).startsWith('critical') ? 'negative' : 'warning' }

function referenceText (ref) {
  if (!ref || (ref.low == null && ref.high == null)) return '-'
  return [ref.low, ref.high].filter((v) => v != null).join(' - ')
}

function formatDate (value) {
  return value ? new Date(value).toLocaleDateString() : '-'
}

async function load () {
  if (!props.pacienteId) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `saude/pacientes/${props.pacienteId}/lab_summary/` }))
    summary.value = data
  } finally {
    loading.value = false
  }
}

watch(() => props.pacienteId, () => { summary.value = null; load() }, { immediate: true })
</script>
