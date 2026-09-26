<template>
  <s-card flat bordered class="latest-vitals q-mb-md" data-test="latest-vital-signs">
    <q-card-section class="row items-center q-pb-sm">
      <q-icon name="monitor_heart" size="22px" color="primary" class="q-mr-sm" />
      <div>
        <div class="text-subtitle1 text-weight-medium">{{ tdc('Latest vital signs') }}</div>
        <div v-if="record" class="text-caption text-grey-7" data-test="latest-vital-signs-meta">
          {{ whenText }}
          <span v-if="recordedBy"> · {{ tdc('Recorded by') }} {{ recordedBy }}</span>
          <span v-if="record.tipo"> · {{ tdc(displayValue(record.tipo)) }}</span>
        </div>
      </div>
      <q-space />
      <q-badge v-if="record && isOld" color="orange-8" class="q-mr-sm" data-test="latest-vital-signs-old">
        {{ tdc('More than 24 hours ago') }}
      </q-badge>
      <s-btn flat round size="md" icon="refresh" :loading="loading" @click="load">
        <s-tooltip>{{ tdc('Refresh') }}</s-tooltip>
      </s-btn>
    </q-card-section>

    <q-card-section v-if="loading && !record" class="flex flex-center q-py-lg">
      <q-spinner color="primary" size="32px" />
    </q-card-section>

    <q-card-section v-else-if="forbidden" class="text-grey-7 q-pt-none" data-test="latest-vital-signs-forbidden">
      <q-icon name="lock" size="16px" /> {{ tdc('You are not allowed to see vital signs.') }}
    </q-card-section>

    <q-card-section v-else-if="!record" class="text-grey-7 q-pt-none" data-test="latest-vital-signs-empty">
      {{ tdc('No vital signs recorded for this patient.') }}
    </q-card-section>

    <template v-else>
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm">
          <div v-for="item in measurements" :key="item.key" class="col-6 col-sm-4 col-md-3 col-lg-1">
            <div class="vital-chip" :class="`vital-chip--${item.status.level}`" :data-test="`latest-${item.key}`">
              <div class="row items-center no-wrap">
                <q-icon :name="item.icon" size="16px" class="q-mr-xs vital-chip__icon" />
                <span class="vital-chip__label ellipsis">
                  {{ tdc(item.label) }}
                  <!-- the title is cut in a size-1 card: the full name on hover -->
                  <s-tooltip>{{ tdc(item.label) }}</s-tooltip>
                </span>
              </div>
              <!-- the result and its status on one line, the status on the right -->
              <div class="row items-center no-wrap">
                <div class="vital-chip__value">
                  {{ item.value }} <span class="text-caption">{{ item.unit }}</span>
                </div>
                <q-space />
                <q-badge v-if="item.status.label" :color="LEVEL_COLORS[item.status.level] || 'grey'" class="q-ml-xs vital-chip__status">
                  {{ tdc(item.status.label) }}
                </q-badge>
              </div>
            </div>
          </div>

          <!-- after the size-1 cards: one size-10 card with the calculations,
               the alerts and the notes -->
          <div v-if="derived.length || alerts.length || record.observacao" class="col-12 col-lg-10">
            <div class="vital-chip vital-summary" data-test="latest-vital-signs-summary">
              <!-- calculations and alerts centred; the notes stay left-aligned -->
              <div class="row items-center justify-center q-gutter-sm">
                <q-chip
                  v-for="c in derived" :key="c.key" dense square outline
                  :color="c.status ? LEVEL_COLORS[c.status.level] : 'grey-7'"
                  :data-test="`latest-calc-${c.key}`"
                >
                  {{ tdc(c.label) }}: <b class="q-ml-xs">{{ c.value }}</b><span v-if="c.unit" class="q-ml-xs">{{ c.unit }}</span>
                  <span v-if="c.status?.label" class="q-ml-xs">({{ tdc(c.status.label) }})</span>
                </q-chip>
                <q-chip
                  v-for="a in alerts" :key="a.key" dense
                  :color="LEVEL_COLORS[a.level]" text-color="white" icon="warning"
                  data-test="latest-vital-signs-alert"
                >
                  {{ tdc(a.field) }}: {{ tdc(a.label) }}
                </q-chip>
              </div>
              <div v-if="record.observacao" class="text-caption text-grey-7 text-left q-mt-sm">
                {{ tdc('Notes') }}: {{ record.observacao }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </template>
  </s-card>
</template>

<script setup>
// The patient's last vital-signs record (DadoVital), for a professional who
// is about to see the patient (e.g. on top of add_consulta). Read only: same
// reference bands and calculations as the recording dialog (./vitalSigns.js).
// GET saude/dadovitals/?paciente=<id> - the backend scopes it to the tenant.
import { computed, ref, watch } from 'vue'
import { HTTPAuth, url, tdc, displayValue, rawValue } from 'quasar_resaas'
import {
  SECTIONS, UNITS, FIELD_LABELS, LEVEL_COLORS, CONSCIOUSNESS,
  num, vitalStatus, vitalCalculations, vitalAlerts
} from './vitalSigns'

const props = defineProps({
  pacienteId: { type: [String, Number], default: null }
})
const emit = defineEmits(['loaded'])

const loading = ref(false)
const record = ref(null)
// a 403 is not "no vital signs": say it, so nobody reads it as an empty record
const forbidden = ref(false)

const ICONS = Object.fromEntries(SECTIONS.flatMap(s => s.fields.map(f => [f.key, f.icon])))

async function load() {
  if (!props.pacienteId) {
    record.value = null
    return
  }
  loading.value = true
  forbidden.value = false
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/dadovitals',
      params: { paciente: props.pacienteId, page_size: 1, ordering: '-created_at' }
    }))
    record.value = (data?.results ?? data ?? [])[0] || null
    emit('loaded', record.value)
  } catch (error) {
    record.value = null
    forbidden.value = error?.response?.status === 403
  } finally {
    loading.value = false
  }
}

watch(() => props.pacienteId, load, { immediate: true })

// the record as plain values (choices come in the {id, value, label} read shape)
const values = computed(() => {
  const r = record.value || {}
  return {
    ...Object.fromEntries(Object.keys(FIELD_LABELS).map(key => [key, num(rawValue(r[key]))])),
    glicemia_momento: rawValue(r.glicemia_momento)
  }
})

const measurements = computed(() => {
  const list = Object.keys(FIELD_LABELS)
    .filter(key => values.value[key] !== null)
    .map(key => ({
      key,
      label: FIELD_LABELS[key],
      icon: ICONS[key] || 'sentiment_dissatisfied',
      value: values.value[key],
      unit: key === 'dor' ? '/10' : (UNITS[key] || ''),
      status: vitalStatus(key, values.value)
    }))
  const consciousness = rawValue(record.value?.estado_consciencia)
  if (consciousness) {
    const option = CONSCIOUSNESS.find(o => o.value === consciousness)
    list.push({
      key: 'estado_consciencia', label: 'Level of consciousness', icon: 'visibility',
      value: tdc(option?.label || consciousness), unit: '',
      status: { level: consciousness === 'alerta' ? 'normal' : 'warning', label: '' }
    })
  }
  return list
})

const calculations = computed(() => vitalCalculations(values.value))
const derived = computed(() => calculations.value.filter(c => c.value !== null && c.key !== 'ideal_weight'))
const alerts = computed(() => vitalAlerts(values.value, calculations.value))

const takenAt = computed(() => (record.value?.created_at ? new Date(record.value.created_at) : null))
const isOld = computed(() => !!takenAt.value && Date.now() - takenAt.value.getTime() > 24 * 60 * 60 * 1000)
const whenText = computed(() => (takenAt.value ? takenAt.value.toLocaleString() : ''))
const recordedBy = computed(() => displayValue(record.value?.employee) || null)

defineExpose({ reload: load })
</script>

<style scoped>
.vital-chip {
  height: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 4px solid rgba(0, 0, 0, 0.14);
  background: rgba(0, 0, 0, 0.015);
}
.vital-chip--normal { border-left-color: var(--q-positive); }
.vital-chip--attention { border-left-color: #f9a825; background: rgba(249, 168, 37, 0.06); }
.vital-chip--warning { border-left-color: #ef6c00; background: rgba(239, 108, 0, 0.07); }
.vital-chip--critical { border-left-color: var(--q-negative); background: rgba(193, 0, 21, 0.07); }
.vital-chip__icon { opacity: .7; }
.vital-summary { display: flex; flex-direction: column; justify-content: center; }
.vital-chip__label { font-size: 11px; opacity: .8; }
.vital-chip__value { font-size: 18px; font-weight: 600; line-height: 1.3; }
/* 12 per row on large screens (col-lg-1): long status labels wrap inside the tile */
.vital-chip .q-badge { white-space: normal; line-height: 1.2; }
.vital-chip__value { white-space: nowrap; }
.vital-chip__status { text-align: right; }
.body--dark .vital-chip { border-color: rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.03); }
</style>
