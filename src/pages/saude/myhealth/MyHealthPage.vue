<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner size="48px" /></div>

    <div v-else-if="!available" class="text-center q-pa-xl text-grey-7" data-test="my-health-unavailable">
      {{ tdc('You have no patient portal access in this entity.') }}
    </div>

    <div v-else class="column q-gutter-md" data-test="my-health">
      <!-- HEADER -->
      <s-card flat bordered>
        <q-card-section>
          <div class="text-h6">{{ tdc('Welcome') }}, {{ summary.patient }}</div>
          <div v-if="summary.next_appointment" class="text-body2 q-mt-xs">
            {{ tdc('Next appointment') }}:
            <b>{{ formatDate(summary.next_appointment.date) }} • {{ summary.next_appointment.time }}</b>
            <span v-if="summary.next_appointment.doctor"> — {{ summary.next_appointment.doctor }}</span>
          </div>
          <div v-else class="text-body2 text-grey-7 q-mt-xs">{{ tdc('No upcoming appointments.') }}</div>
        </q-card-section>
      </s-card>

      <!-- KPIs -->
      <div class="row q-col-gutter-md">
        <div v-for="k in kpis" :key="k.label" class="col-6 col-md-3">
          <s-card flat bordered class="full-height">
            <q-card-section class="text-center">
              <q-icon :name="k.icon" size="28px" color="primary" />
              <div class="text-h5">{{ k.value }}</div>
              <div class="text-caption text-grey-7">{{ tdc(k.label) }}</div>
            </q-card-section>
          </s-card>
        </div>
      </div>

      <!-- SECTIONS -->
      <s-card flat bordered>
        <q-tabs v-model="tab" dense align="left" outside-arrows mobile-arrows inline-label>
          <q-tab name="appointments" icon="event" :label="tdc('My Appointments')" />
          <q-tab name="exams" icon="science" :label="tdc('My Exams')" />
          <q-tab name="results" icon="fact_check" :label="tdc('My Results')" />
          <q-tab name="trends" icon="show_chart" :label="tdc('My Health Trends')" />
          <q-tab name="prescriptions" icon="medication" :label="tdc('My Prescriptions')" />
          <q-tab name="vitals" icon="monitor_heart" :label="tdc('My Vital Signs')" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="appointments">
            <div v-for="group in ['upcoming', 'previous']" :key="group" class="q-mb-md">
              <div class="text-subtitle2 q-mb-xs">{{ tdc(group === 'upcoming' ? 'Upcoming Appointments' : 'Previous Appointments') }}</div>
              <q-list v-if="sections.appointments?.[group]?.length" bordered separator dense>
                <q-item v-for="a in sections.appointments[group]" :key="a.id">
                  <q-item-section>
                    <q-item-label>{{ formatDate(a.date) }} • {{ a.time }}</q-item-label>
                    <q-item-label caption>{{ a.doctor || '-' }}</q-item-label>
                  </q-item-section>
                  <q-item-section side><q-badge :label="tdc(a.status)" /></q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-grey-7">{{ tdc('No appointments.') }}</div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="exams">
            <q-list v-if="sections.exams?.length" bordered separator dense>
              <q-item v-for="e in sections.exams" :key="e.id">
                <q-item-section>
                  <q-item-label>{{ e.exam }}</q-item-label>
                  <q-item-label caption>{{ formatDate(e.requested) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge :color="e.result_available ? 'positive' : 'grey-7'" :label="tdc(e.status)" />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-grey-7">{{ tdc('No exams.') }}</div>
          </q-tab-panel>

          <q-tab-panel name="results">
            <div v-if="!sections.results?.length" class="text-grey-7">{{ tdc('No results available yet.') }}</div>
            <s-card v-for="r in sections.results" :key="r.id" flat bordered class="q-mb-sm">
              <q-card-section class="q-pb-xs">
                <div class="text-subtitle2">{{ r.exam }}</div>
                <div class="text-caption text-grey-7">{{ formatDate(r.released_at) }}</div>
              </q-card-section>
              <q-markup-table v-if="r.values.length" flat dense separator="horizontal">
                <tbody>
                  <tr v-for="v in r.values" :key="v.code">
                    <td>{{ tdc(v.name) }}</td>
                    <td class="text-right">{{ v.value }} {{ v.unit || '' }}</td>
                    <td class="text-right text-grey-7 gt-xs">{{ referenceText(v.reference) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-card-section v-if="r.report" class="text-body2 pre-line">{{ r.report }}</q-card-section>
            </s-card>
          </q-tab-panel>

          <q-tab-panel name="trends">
            <div v-if="!sections.trends?.length" class="text-grey-7">{{ tdc('Not enough results to show a trend yet.') }}</div>
            <template v-else>
              <s-select
                v-model="trendParameter"
                :label="tdc('Parameter')"
                :options="sections.trends.map((p) => ({ value: p.code, label: `${tdc(p.name)}${p.unit ? ` (${p.unit})` : ''}` }))"
                emit-value
                map-options
                class="q-mb-md"
                style="max-width: 420px"
              />
              <div v-if="trend && trend.points.length < 2" class="text-grey-7">{{ tdc('Not enough results to show a trend yet.') }}</div>
              <LineChartWidget v-else-if="trend" :data="trendChart" />
            </template>
          </q-tab-panel>

          <q-tab-panel name="prescriptions">
            <div v-if="!sections.prescriptions?.length" class="text-grey-7">{{ tdc('No prescriptions.') }}</div>
            <s-card v-for="p in sections.prescriptions" :key="p.id" flat bordered class="q-mb-sm">
              <q-card-section class="q-pb-xs">
                <div class="text-subtitle2">{{ formatDate(p.date) }}</div>
                <div class="text-caption text-grey-7">{{ p.doctor || '-' }}</div>
              </q-card-section>
              <q-list dense>
                <q-item v-for="(m, i) in p.medicines" :key="i">
                  <q-item-section>
                    <q-item-label>{{ m.medicine }}</q-item-label>
                    <q-item-label caption>{{ [m.dosage, m.quantity, m.instructions].filter(Boolean).join(' • ') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </s-card>
          </q-tab-panel>

          <q-tab-panel name="vitals">
            <div v-if="!sections.vitals?.latest" class="text-grey-7">{{ tdc('No vital signs recorded.') }}</div>
            <template v-else>
              <div class="text-caption text-grey-7 q-mb-sm">{{ formatDate(sections.vitals.latest.date) }}</div>
              <div class="row q-col-gutter-sm">
                <div v-for="v in sections.vitals.latest.values" :key="v.name" class="col-6 col-sm-4">
                  <s-card flat bordered>
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption text-grey-7">{{ tdc(v.name) }}</div>
                      <div class="text-subtitle1">{{ v.value }} {{ v.unit }}</div>
                    </q-card-section>
                  </s-card>
                </div>
              </div>
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </s-card>
    </div>
  </q-page>
</template>

<script setup>
// Patient portal page: the patient's OWN data in the Entity of the current
// context. Every request goes to /api/saude/me/... - the backend derives the
// patient from the authenticated user; this page never sends a patient id.
import { computed, onMounted, ref, watch } from 'vue'
import { HTTPAuth, url, tdc } from 'quasar_resaas'
import LineChartWidget from 'quasar_resaas/components/dashboard/LineChartWidget.vue'

const loading = ref(true)
const available = ref(false)
const summary = ref({})
const sections = ref({})
const tab = ref('appointments')
const trendParameter = ref(null)
const trend = ref(null)

const kpis = computed(() => [
  { label: 'Pending Exams', value: summary.value.pending_exams ?? 0, icon: 'science' },
  { label: 'New Results', value: summary.value.new_results ?? 0, icon: 'fact_check' },
  { label: 'Prescriptions', value: summary.value.prescriptions ?? 0, icon: 'medication' },
  { label: 'Next appointment', value: summary.value.next_appointment ? formatDate(summary.value.next_appointment.date) : '-', icon: 'event' }
])

const trendChart = computed(() => ({
  labels: trend.value.points.map((p) => formatDate(p.date)),
  series: [{ name: trend.value.parameter.name, data: trend.value.points.map((p) => Number(p.value)) }]
}))

function me (section, params = {}) {
  return url({ type: 'u', url: `saude/me/${section}/`, params })
}
function formatDate (iso) { return iso ? new Date(iso).toLocaleDateString() : '-' }
function referenceText (ref) {
  if (!ref || (ref.low == null && ref.high == null)) return ''
  return `${tdc('Reference')}: ${[ref.low, ref.high].filter((v) => v != null).join(' - ')}`
}

async function loadSection (name) {
  if (sections.value[name] !== undefined) return
  const { data } = await HTTPAuth.get(me(name))
  sections.value = { ...sections.value, [name]: data }
  if (name === 'trends' && data.length) trendParameter.value = data[0].code
}

onMounted(async () => {
  try {
    const { data: status } = await HTTPAuth.get(me('status'))
    available.value = status.portal
    if (!available.value) return
    const { data } = await HTTPAuth.get(me('summary'))
    summary.value = data
    await loadSection(tab.value)
  } finally {
    loading.value = false
  }
})

watch(tab, (name) => loadSection(name))
watch(trendParameter, async (code) => {
  if (!code) return
  const { data } = await HTTPAuth.get(me('trends', { parameter: code }))
  trend.value = data
})
</script>
