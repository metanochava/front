<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner size="48px" /></div>

    <div v-else-if="!available" class="text-center q-pa-xl text-grey-7" data-test="my-health-unavailable">
      {{ tdc('You have no patient portal access in this entity.') }}
    </div>

    <div v-else class="column q-gutter-md" data-test="my-health">
      <!-- HEADER: welcome + the Patient dashboard (saude_patient, rendered by
           the dashboard engine - its widgets carry their own permissions
           and the backend returns only this patient's data) -->
      <div class="text-h6" data-test="my-health-welcome">{{ tdc('Welcome') }}, {{ summary.patient }}</div>
      <s-dashboard-renderer name="saude_patient" />

      <!-- SECTIONS -->
      <s-card flat bordered>
        <q-tabs v-model="tab" dense align="left" outside-arrows mobile-arrows inline-label>
          <!-- a section is shown only with its permission (UX; the backend
               checks it too) - no request, no 403, for a hidden one -->
          <q-tab v-for="t in allowedTabs" :key="t.name" :name="t.name" :icon="t.icon" :label="tdc(t.label)" />
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
import { HTTPAuth, url, tdc, useUserStore, resolveWidgetComponent } from 'quasar_resaas'

// the dashboard engine's line chart, through the package's public API
// (only '.', './auto-imports' and './core/*' are exported)
const LineChartWidget = resolveWidgetComponent('line_chart')

const User = useUserStore()

const TABS = [
  { name: 'appointments', icon: 'event', label: 'My Appointments', permission: 'view_own_appointments' },
  { name: 'exams', icon: 'science', label: 'My Exams', permission: 'view_own_exams' },
  { name: 'results', icon: 'fact_check', label: 'My Results', permission: 'view_own_results' },
  { name: 'trends', icon: 'show_chart', label: 'My Health Trends', permission: 'view_own_trends' },
  { name: 'prescriptions', icon: 'medication', label: 'My Prescriptions', permission: 'view_own_prescriptions' },
  { name: 'vitals', icon: 'monitor_heart', label: 'My Vital Signs', permission: 'view_own_vitals' }
]
const allowedTabs = computed(() => TABS.filter((t) => User.can(t.permission)))

const loading = ref(true)
const available = ref(false)
const summary = ref({})
const sections = ref({})
const tab = ref(null)
const trendParameter = ref(null)
const trend = ref(null)


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
    tab.value = allowedTabs.value[0]?.name || null
    if (tab.value) await loadSection(tab.value)
  } finally {
    loading.value = false
  }
})

watch(tab, (name) => { if (name) loadSection(name) })
watch(trendParameter, async (code) => {
  if (!code) return
  const { data } = await HTTPAuth.get(me('trends', { parameter: code }))
  trend.value = data
})
</script>
