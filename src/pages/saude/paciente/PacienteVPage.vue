<template>
  <q-page class="q-pa-sm paciente-view">
    <PacienteHeader />

    <div v-if="Paciente.loading" class="flex flex-center q-pa-xl">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <div v-else>

      <!-- ALERTA CLÍNICO -->
      <q-banner
        v-if="Paciente.row?.clinical_alert"
        rounded
        class="bg-negative text-white q-mb-md"
      >
        <template #avatar>
          <q-icon name="warning" />
        </template>
        <div class="text-weight-bold">{{ tdc('Clinical alert') }}</div>
        <div class="pre-line">{{ Paciente.row.clinical_alert }}</div>
      </q-banner>


      <!-- ============== TABS (same layout as view_employee) ============== -->
      <s-card class="q-mt-md">
        <q-tabs
          v-model="tab"
          dense
          align="left"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="personal" :label="tdc('Personal')" />
          <q-tab name="clinical" :label="tdc('Clinical summary')" />
          <q-tab name="consultations" :label="tdc('Consultations')" />
          <q-tab name="appointments" :label="tdc('Appointments')" />
          <q-tab name="timeline" :label="tdc('Timeline')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <!-- PERSONAL: patient data + shared person profile -->
          <q-tab-panel name="personal" class="q-pa-md">
            <s-person-profile v-if="Paciente.row?.person_data" :person="Paciente.row.person_data">
              <template #aside>
                <s-card flat bordered class="patient-data">
                  <q-card-section class="section-title">
                    <q-icon name="medical_information" size="20px" />
                    {{ tdc('Patient data') }}
                  </q-card-section>
                  <q-separator />

                  <q-list class="patient-data__list">
                    <q-item v-for="item in patientFacts" :key="item.label" dense class="patient-data__item">
                      <q-item-section avatar class="patient-data__icon">
                        <q-icon :name="item.icon" size="18px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption class="patient-data__label">{{ item.label }}</q-item-label>
                        <q-item-label>
                          <q-badge v-if="item.badge" :color="item.badge" class="q-pa-xs">{{ item.value }}</q-badge>
                          <span v-else :class="{ 'text-grey-6': !item.value }">{{ item.value || '—' }}</span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <template v-if="patientNotes.length">
                    <q-separator />
                    <q-card-section class="column q-gutter-y-md">
                      <div v-for="note in patientNotes" :key="note.label" class="patient-note" :class="note.tone">
                        <div class="patient-note__label">
                          <q-icon :name="note.icon" size="16px" /> {{ note.label }}
                        </div>
                        <div class="pre-line">{{ note.value }}</div>
                      </div>
                    </q-card-section>
                  </template>
                </s-card>
              </template>
            </s-person-profile>
          </q-tab-panel>

          <!-- CLINICAL SUMMARY -->
          <q-tab-panel name="clinical" class="q-pa-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6 q-gutter-md">
            <!-- ALERGIAS -->
            <s-card flat bordered :class="alergias.data.length ? 'border-negative' : ''">
              <q-card-section class="row items-center">
                <q-icon name="warning" color="negative" class="q-mr-xs" />
                <div class="text-subtitle2 text-weight-medium">{{ tdc('Allergies') }}</div>
                <q-space />
                <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_alergiacorrente' }" />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="alergias.loading" class="flex flex-center q-pa-sm">
                  <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
                </div>
                <div v-else-if="!alergias.data.length" class="text-caption text-grey-6">
                  {{ tdc('No allergy recorded') }}
                </div>
                <div v-else class="row q-gutter-xs">
                  <q-badge v-for="a in alergias.data" :key="a.id" color="negative" outline>
                    {{ a.nome }}
                  </q-badge>
                </div>
              </q-card-section>
            </s-card>

            <!-- ÚLTIMOS SINAIS VITAIS -->
            <s-card flat bordered>
              <q-card-section class="row items-center">
                <q-icon name="monitor_heart" color="primary" class="q-mr-xs" />
                <div class="text-subtitle2 text-weight-medium">{{ tdc('Latest Vital Signs') }}</div>
                <q-space />
                <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_dadovital' }" />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="vitais.loading" class="flex flex-center q-pa-sm">
                  <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
                </div>
                <div v-else-if="!vitais.data" class="text-caption text-grey-6">
                  {{ tdc('No records') }}
                </div>
                <div v-else class="row q-col-gutter-sm">
                  <div class="col-6" v-if="vitais.data.ta_sistolica">
                    <div class="text-caption text-grey-6">{{ tdc('Blood Pressure') }}</div>
                    <div class="text-weight-medium">{{ vitais.data.ta_sistolica }}/{{ vitais.data.ta_diastolica }}</div>
                  </div>
                  <div class="col-6" v-if="vitais.data.temperatura">
                    <div class="text-caption text-grey-6">{{ tdc('Temp.') }}</div>
                    <div class="text-weight-medium">{{ vitais.data.temperatura }}°C</div>
                  </div>
                  <div class="col-6" v-if="vitais.data.frequencia_cardiaca">
                    <div class="text-caption text-grey-6">{{ tdc('Heart Rate') }}</div>
                    <div class="text-weight-medium">{{ vitais.data.frequencia_cardiaca }} bpm</div>
                  </div>
                  <div class="col-6" v-if="vitais.data.saturacao_oxigenio">
                    <div class="text-caption text-grey-6">{{ tdc('SpO₂') }}</div>
                    <div class="text-weight-medium">{{ vitais.data.saturacao_oxigenio }}%</div>
                  </div>
                  <div class="col-6" v-if="vitais.data.peso">
                    <div class="text-caption text-grey-6">{{ tdc('Weight') }}</div>
                    <div class="text-weight-medium">{{ vitais.data.peso }} kg</div>
                  </div>
                  <div class="col-12 text-caption text-grey-6 q-mt-xs">
                    {{ vitais.data.data }}
                  </div>
                </div>
              </q-card-section>
            </s-card>


              </div>
              <div class="col-12 col-md-6 q-gutter-md">
            <!-- DOENÇAS CORRENTES -->
            <s-card flat bordered>
              <q-card-section class="row items-center">
                <q-icon name="coronavirus" color="warning" class="q-mr-xs" />
                <div class="text-subtitle2 text-weight-medium">{{ tdc('Current Conditions') }}</div>
                <q-space />
                <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_doencacorrente' }" />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="doencas.loading" class="flex flex-center q-pa-sm">
                  <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
                </div>
                <div v-else-if="!doencas.data.length" class="text-caption text-grey-6">
                  {{ tdc('No condition recorded') }}
                </div>
                <div v-else class="row q-gutter-xs">
                  <q-badge v-for="d in doencas.data" :key="d.id" color="warning" outline>
                    {{ d.nome }}
                  </q-badge>
                </div>
              </q-card-section>
            </s-card>

            <!-- MEDICAÇÃO CORRENTE -->
            <s-card flat bordered>
              <q-card-section class="row items-center">
                <q-icon name="medication_liquid" color="secondary" class="q-mr-xs" />
                <div class="text-subtitle2 text-weight-medium">{{ tdc('Current Medication') }}</div>
                <q-space />
                <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_medicacaocorrente' }" />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="medicacao.loading" class="flex flex-center q-pa-sm">
                  <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
                </div>
                <div v-else-if="!medicacao.data.length" class="text-caption text-grey-6">
                  {{ tdc('No medication recorded') }}
                </div>
                <div v-else class="row q-gutter-xs">
                  <q-badge v-for="m in medicacao.data" :key="m.id" color="secondary" outline>
                    {{ m.nome }}
                  </q-badge>
                </div>
              </q-card-section>
            </s-card>

              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="consultations" class="q-pa-md">
        <!-- CONSULTAS RECENTES -->
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="health_and_safety" class="q-mr-xs" />
              {{ tdc('Recent Consultations') }}
            </div>
            <q-space />
            <s-btn flat dense no-caps color="primary" :label="tdc('View All')" :to="{ name: 'list_consulta' }" />
          </q-card-section>

          <q-separator />

          <div v-if="consultas.loading" class="flex flex-center q-pa-md">
            <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
          </div>
          <div v-else-if="!consultas.data.length" class="text-caption text-grey-6 q-pa-md text-center">
            {{ tdc('No consultations recorded') }}
          </div>
          <q-list v-else separator>
            <q-item
              v-for="c in consultas.data" :key="c.id" clickable
              :to="{ name: 'view_consulta', params: { id: c.id } }"
            >
              <q-item-section avatar>
                <q-icon name="event_available" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ c.diagnostico || c.dc || tdc('No diagnosis recorded') }}</q-item-label>
                <q-item-label caption>{{ c.employee?.label || '—' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ c.data }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </s-card>


          </q-tab-panel>

          <q-tab-panel name="appointments" class="q-pa-md">
        <!-- PRÓXIMAS MARCAÇÕES -->
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="event" class="q-mr-xs" />
              {{ tdc('Upcoming Appointments') }}
            </div>
            <q-space />
            <s-btn
              flat dense no-caps color="primary" icon="add" :label="tdc('Schedule Consultation')"
              @click="openNovaMarcacao"
            />
          </q-card-section>

          <q-separator />

          <div v-if="agendas.loading" class="flex flex-center q-pa-md">
            <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
          </div>
          <div v-else-if="!agendas.data.length" class="text-caption text-grey-6 q-pa-md text-center">
            {{ tdc('No upcoming appointments') }}
          </div>
          <q-list v-else separator>
            <q-item v-for="a in agendas.data" :key="a.id">
              <q-item-section avatar>
                <q-badge :color="estadoAgendaColor(a.estado)" rounded />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ a.medico?.label || '—' }}</q-item-label>
                <q-item-label caption>{{ a.motivo || '—' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ a.data }} {{ a.hora_inicio?.slice(0, 5) }}</q-item-label>
              </q-item-section>
              <q-item-section side top class="q-gutter-x-xs">
                <div class="row no-wrap">
                  <q-btn
                    flat dense round size="sm" icon="edit" color="primary"
                    @click="openEditMarcacao(a)"
                  >
                    <q-tooltip>{{ tdc('Edit') }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat dense round size="sm" icon="event_busy" color="negative"
                    @click="confirmCancelMarcacao(a)"
                  >
                    <q-tooltip>{{ tdc('Cancel') }}</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </s-card>


          </q-tab-panel>

          <q-tab-panel name="timeline" class="q-pa-md">
        <!-- LINHA DO TEMPO (Fase 4 - cross-entity autorizado) -->
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="timeline" class="q-mr-xs" />
              {{ tdc('Clinical Timeline') }}
            </div>
          </q-card-section>

          <q-separator />

          <div v-if="timeline.loading" class="flex flex-center q-pa-md">
            <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
          </div>
          <div v-else-if="!timeline.data.length" class="text-caption text-grey-6 q-pa-md text-center">
            {{ tdc('No events') }}
          </div>
          <q-list v-else separator>
            <q-item v-for="(e, index) in timeline.data" :key="index">
              <q-item-section avatar>
                <q-icon :name="timelineIcon(e.type)" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ timelineSummary(e) }}</q-item-label>
                <q-item-label caption>
                  <q-badge
                    v-if="e.is_external"
                    color="warning"
                    outline
                    class="q-mr-xs"
                  >
                    {{ e.source_entity }} · {{ e.source_branch }}
                  </q-badge>
                  <span v-else class="text-grey-6">
                    {{ e.source_branch }}
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ e.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </s-card>


          </q-tab-panel>

        </q-tab-panels>
      </s-card>
    </div>

    <agenda-consulta-dialog
      v-model="showAgendaDialog"
      :paciente-id="Paciente.row?.id"
      :paciente-label="Paciente.row?.person?.label"
      :edit-id="editAgendaId"
      @saved="fetchAgendas"
    />
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { tdc, HTTPAuth, url, displayValue, rawValue, usePageTitle, sDialog } from 'quasar_resaas'

import { usePacienteStore } from './pacienteStore'
import PacienteHeader from './PacienteHeaderPage.vue'
import AgendaConsultaDialog from './../components/AgendaConsultaDialog.vue'

const route = useRoute()
const $q = useQuasar()
const Paciente = usePacienteStore()

const tab = ref('personal')

// tab title: "<patient name> - Patient" once the record is loaded
usePageTitle(() => {
  const name = Paciente.row?.person_data?.full_name || Paciente.row?.person?.label
  return name ? `${name} - ${tdc('Patient')}` : ''
})

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })
}

// Only administrative facts about the PATIENT record itself - identity
// (occupation, blood type, ...) already shows in the person profile beside it.
const patientFacts = computed(() => {
  const row = Paciente.row || {}

  return [
    { icon: 'verified_user', label: tdc('Status'), value: tdc(displayValue(row.status)), badge: statusColor.value },
    { icon: 'tag', label: tdc('Patient No.'), value: row.nid },
    { icon: 'church', label: tdc('Religion'), value: row.religion },
    { icon: 'apartment', label: tdc('Branch'), value: displayValue(row.branch) },
    { icon: 'event_available', label: tdc('Registered on'), value: formatDate(row.created_at) }
  ]
})

const patientNotes = computed(() => {
  const row = Paciente.row || {}

  return [
    { icon: 'accessible', label: tdc('Special needs'), value: row.special_needs, tone: 'patient-note--info' },
    { icon: 'favorite_border', label: tdc('Care preferences'), value: row.care_preferences, tone: 'patient-note--soft' }
  ].filter(note => note.value)
})

const statusColor = computed(() => ({
  Active: 'positive',
  Inactive: 'grey',
  Deceased: 'dark'
}[rawValue(Paciente.row?.status)] || 'grey'))

const showAgendaDialog = ref(false)
const editAgendaId = ref(null)

function openNovaMarcacao() {
  editAgendaId.value = null
  showAgendaDialog.value = true
}

function openEditMarcacao(a) {
  editAgendaId.value = a.id
  showAgendaDialog.value = true
}

function confirmCancelMarcacao(a) {
  sDialog({
    title: tdc('Cancel Consultation'),
    message: tdc('Are you sure you want to cancel this appointment?'),
    cancel: { flat: true, label: tdc('No') },
    ok: { color: 'negative', label: tdc('Yes, Cancel') },
    persistent: true,
  }).onOk(async () => {
    await HTTPAuth.patch(url({ type: 'u', url: `saude/agendas/${a.id}/` }), { estado: 'cancelada' })
    await fetchAgendas()
  })
}

function estadoAgendaColor(estado) {
  const value = estado?.value || estado
  return {
    marcada: 'grey', confirmada: 'info', em_espera: 'warning',
    em_atendimento: 'primary', concluida: 'positive',
    cancelada: 'negative', faltou: 'negative',
  }[value] || 'grey'
}

// ---------------- SECÇÕES: cada uma carrega o seu próprio endpoint ----------------
function section(initial = []) {
  return reactive({ loading: true, data: initial })
}

const consultas = section([])
const agendas = section([])
const alergias = section([])
const doencas = section([])
const medicacao = section([])
const vitais = section(null)
const timeline = section([])

const TIMELINE_ICONS = {
  consultation: 'health_and_safety',
  prescription: 'medication',
  lab_request: 'science',
}

function timelineIcon(type) {
  return TIMELINE_ICONS[type] || 'event_note'
}

function timelineSummary(e) {
  if (e.summary) return e.summary
  return {
    consultation: tdc('Consultation'),
    prescription: tdc('Medical Prescription'),
    lab_request: tdc('Exam Request'),
  }[e.type] || e.type
}

async function fetchTimeline() {
  const personId = Paciente.row?.person?.id

  if (!personId) {
    timeline.data = []
    return
  }

  timeline.loading = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/pacientes/timeline',
      params: { person_id: personId },
    }))
    timeline.data = data.events ?? []
  } finally {
    timeline.loading = false
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

async function fetchList(section, endpoint, params = {}) {
  section.loading = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: endpoint,
      params: { paciente: route.params.id, page_size: 5, ordering: '-data', ...params },
    }))
    section.data = data.results ?? data
  } finally {
    section.loading = false
  }
}

function fetchConsultas() {
  return fetchList(consultas, 'saude/consultas')
}
async function fetchAgendas() {
  // O filtro automático da API só suporta correspondência exata (não
  // "__gte"), por isso filtramos "no futuro" aqui no cliente, sobre
  // uma janela razoável de registos.
  agendas.loading = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/agendas',
      params: { paciente: route.params.id, page_size: 30, ordering: '-data' },
    }))
    const rows = data.results ?? data
    const hoje = todayISO()

    agendas.data = rows
      .filter(a => a.data >= hoje && a.estado?.value !== 'cancelada' && a.estado?.value !== 'concluida')
      .sort((a, b) => (a.data + a.hora_inicio).localeCompare(b.data + b.hora_inicio))
      .slice(0, 5)
  } finally {
    agendas.loading = false
  }
}
function fetchAlergias() {
  return fetchList(alergias, 'saude/alergiacorrentes', { page_size: 20, ordering: 'nome' })
}
function fetchDoencas() {
  return fetchList(doencas, 'saude/doencacorrentes', { page_size: 20, ordering: 'nome' })
}
function fetchMedicacao() {
  return fetchList(medicacao, 'saude/medicacaocorrentes', { page_size: 20, ordering: 'nome' })
}

async function fetchVitais() {
  vitais.loading = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/dadovitals',
      params: { paciente: route.params.id, page_size: 1, ordering: '-data,-hora' },
    }))
    const rows = data.results ?? data
    vitais.data = rows[0] || null
  } finally {
    vitais.loading = false
  }
}

function loadAllSections() {
  fetchConsultas()
  fetchAgendas()
  fetchAlergias()
  fetchDoencas()
  fetchMedicacao()
  fetchVitais()
  fetchTimeline()
}

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return

    if (String(Paciente.row?.id) !== String(id)) {
      Paciente.row = await Paciente.getById(id)
    }

    loadAllSections()
  },
  { immediate: true }
)

onMounted(async () => {
  await Paciente.init()
})
</script>

<style scoped>
.pre-line { white-space: pre-line; }

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}
.section-title .q-icon { color: var(--q-primary); }

.patient-data__item { min-height: 44px; }
.patient-data__icon { min-width: 36px; color: var(--q-primary); }
.patient-data__label {
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .65;
}

.patient-note {
  padding: 10px 12px;
  border-radius: var(--s-radius, 8px);
  border-left: 4px solid var(--q-primary);
  background: color-mix(in srgb, var(--q-primary) 8%, transparent);
}
.patient-note--info {
  border-left-color: var(--q-warning);
  background: color-mix(in srgb, var(--q-warning) 12%, transparent);
}
.patient-note__label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .8;
}
.border-negative {
  border-color: var(--q-negative) !important;
}
</style>
