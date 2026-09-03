<template>
  <q-page class="q-pa-sm paciente-view">
    <PacienteHeader />

    <div v-if="Paciente.loading" class="flex flex-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <div v-else class="row q-col-gutter-md">

      <!-- ============== ESQUERDA: IDENTIDADE + CLÍNICO ============== -->
      <div class="col-12 col-md-8 q-gutter-md">

        <!-- IDENTIDADE -->
        <s-card flat bordered>
          <q-card-section class="row items-center q-col-gutter-md">
            <q-avatar size="72px" color="primary" text-color="white" icon="person" />

            <div class="col">
              <div class="text-h6 text-weight-bold">{{ Paciente.row?.person?.label || '—' }}</div>
              <div class="text-caption text-grey-7">
                {{ tdc('Nº Paciente') }}: {{ Paciente.row?.nid || '—' }}
              </div>
            </div>

            <q-btn
              flat round icon="edit" color="primary"
              :to="{ name: 'change_paciente', params: { id: Paciente.row?.id } }"
            >
              <q-tooltip>{{ tdc('Editar Dados') }}</q-tooltip>
            </q-btn>
          </q-card-section>

          <q-separator />

          <q-card-section class="row q-col-gutter-md">
            <div class="col-6 col-sm-4">
              <div class="text-caption text-grey-6">{{ tdc('Profissão') }}</div>
              <div>{{ Paciente.row?.profissao || '—' }}</div>
            </div>
            <div class="col-6 col-sm-4">
              <div class="text-caption text-grey-6">{{ tdc('Religião') }}</div>
              <div>{{ Paciente.row?.religiao || '—' }}</div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-grey-6">{{ tdc('Contacto de Emergência') }}</div>
              <div>{{ Paciente.row?.person_a_contactar || '—' }} {{ Paciente.row?.numero_a_contactar ? `(${Paciente.row.numero_a_contactar})` : '' }}</div>
            </div>
          </q-card-section>
        </s-card>

        <!-- CONSULTAS RECENTES -->
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="health_and_safety" class="q-mr-xs" />
              {{ tdc('Consultas Recentes') }}
            </div>
            <q-space />
            <s-btn flat dense no-caps color="primary" :label="tdc('Ver todas')" :to="{ name: 'list_consulta' }" />
          </q-card-section>

          <q-separator />

          <div v-if="consultas.loading" class="flex flex-center q-pa-md">
            <q-spinner color="primary" size="24px" />
          </div>
          <div v-else-if="!consultas.data.length" class="text-caption text-grey-6 q-pa-md text-center">
            {{ tdc('Sem consultas registadas') }}
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
                <q-item-label>{{ c.diagnostico || c.dc || tdc('Sem diagnóstico registado') }}</q-item-label>
                <q-item-label caption>{{ c.employee?.label || '—' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ c.data }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </s-card>

        <!-- PRÓXIMAS MARCAÇÕES -->
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="event" class="q-mr-xs" />
              {{ tdc('Próximas Marcações') }}
            </div>
            <q-space />
            <s-btn
              flat dense no-caps color="primary" icon="add" :label="tdc('Marcar Consulta')"
              @click="openNovaMarcacao"
            />
          </q-card-section>

          <q-separator />

          <div v-if="agendas.loading" class="flex flex-center q-pa-md">
            <q-spinner color="primary" size="24px" />
          </div>
          <div v-else-if="!agendas.data.length" class="text-caption text-grey-6 q-pa-md text-center">
            {{ tdc('Sem marcações futuras') }}
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
                    <q-tooltip>{{ tdc('Editar') }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat dense round size="sm" icon="event_busy" color="negative"
                    @click="confirmCancelMarcacao(a)"
                  >
                    <q-tooltip>{{ tdc('Cancelar') }}</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </s-card>

      </div>

      <!-- ============== DIREITA: RESUMO CLÍNICO ============== -->
      <div class="col-12 col-md-4 q-gutter-md">

        <!-- ALERGIAS -->
        <s-card flat bordered :class="alergias.data.length ? 'border-negative' : ''">
          <q-card-section class="row items-center">
            <q-icon name="warning" color="negative" class="q-mr-xs" />
            <div class="text-subtitle2 text-weight-medium">{{ tdc('Alergias') }}</div>
            <q-space />
            <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_alergiacorrente' }" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="alergias.loading" class="flex flex-center q-pa-sm">
              <q-spinner color="primary" size="20px" />
            </div>
            <div v-else-if="!alergias.data.length" class="text-caption text-grey-6">
              {{ tdc('Nenhuma alergia registada') }}
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
            <div class="text-subtitle2 text-weight-medium">{{ tdc('Últimos Sinais Vitais') }}</div>
            <q-space />
            <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_dadovital' }" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="vitais.loading" class="flex flex-center q-pa-sm">
              <q-spinner color="primary" size="20px" />
            </div>
            <div v-else-if="!vitais.data" class="text-caption text-grey-6">
              {{ tdc('Sem registos') }}
            </div>
            <div v-else class="row q-col-gutter-sm">
              <div class="col-6" v-if="vitais.data.ta_sistolica">
                <div class="text-caption text-grey-6">{{ tdc('TA') }}</div>
                <div class="text-weight-medium">{{ vitais.data.ta_sistolica }}/{{ vitais.data.ta_diastolica }}</div>
              </div>
              <div class="col-6" v-if="vitais.data.temperatura">
                <div class="text-caption text-grey-6">{{ tdc('Temp.') }}</div>
                <div class="text-weight-medium">{{ vitais.data.temperatura }}°C</div>
              </div>
              <div class="col-6" v-if="vitais.data.frequencia_cardiaca">
                <div class="text-caption text-grey-6">{{ tdc('FC') }}</div>
                <div class="text-weight-medium">{{ vitais.data.frequencia_cardiaca }} bpm</div>
              </div>
              <div class="col-6" v-if="vitais.data.saturacao_oxigenio">
                <div class="text-caption text-grey-6">{{ tdc('SpO₂') }}</div>
                <div class="text-weight-medium">{{ vitais.data.saturacao_oxigenio }}%</div>
              </div>
              <div class="col-6" v-if="vitais.data.peso">
                <div class="text-caption text-grey-6">{{ tdc('Peso') }}</div>
                <div class="text-weight-medium">{{ vitais.data.peso }} kg</div>
              </div>
              <div class="col-12 text-caption text-grey-6 q-mt-xs">
                {{ vitais.data.data }}
              </div>
            </div>
          </q-card-section>
        </s-card>

        <!-- DOENÇAS CORRENTES -->
        <s-card flat bordered>
          <q-card-section class="row items-center">
            <q-icon name="coronavirus" color="warning" class="q-mr-xs" />
            <div class="text-subtitle2 text-weight-medium">{{ tdc('Doenças Correntes') }}</div>
            <q-space />
            <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_doencacorrente' }" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="doencas.loading" class="flex flex-center q-pa-sm">
              <q-spinner color="primary" size="20px" />
            </div>
            <div v-else-if="!doencas.data.length" class="text-caption text-grey-6">
              {{ tdc('Nenhuma doença registada') }}
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
            <div class="text-subtitle2 text-weight-medium">{{ tdc('Medicação Corrente') }}</div>
            <q-space />
            <s-btn flat dense round size="sm" icon="open_in_new" :to="{ name: 'list_medicacaocorrente' }" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="medicacao.loading" class="flex flex-center q-pa-sm">
              <q-spinner color="primary" size="20px" />
            </div>
            <div v-else-if="!medicacao.data.length" class="text-caption text-grey-6">
              {{ tdc('Nenhuma medicação registada') }}
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
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { tdc, HTTPAuth, url } from 'quasar_resaas'

import { usePacienteStore } from './pacienteStore'
import PacienteHeader from './PacienteHeaderPage.vue'
import AgendaConsultaDialog from './../components/AgendaConsultaDialog.vue'

const route = useRoute()
const $q = useQuasar()
const Paciente = usePacienteStore()

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
  $q.dialog({
    title: tdc('Cancelar Consulta'),
    message: tdc('Tem a certeza que deseja cancelar esta marcação?'),
    cancel: { flat: true, label: tdc('Não') },
    ok: { color: 'negative', label: tdc('Sim, Cancelar') },
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
.border-negative {
  border-color: var(--q-negative) !important;
}
</style>
