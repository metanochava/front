<template>
  <q-dialog :model-value="modelValue" @update:model-value="onToggle" persistent>
    <s-card style="width: 100%; max-width: 760px">
      <q-card-section class="row items-center q-pb-none">
        <q-icon name="event" class="q-mr-sm" color="primary" size="24px" />
        <div class="text-h6">{{ isEditMode ? tdc('Editar Consulta') : tdc('Marcar Consulta') }}</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="close" />
      </q-card-section>

      <q-card-section v-if="pacienteId" class="q-pt-none">
        <div class="text-caption text-grey-6">{{ tdc('Paciente') }}</div>
        <div class="text-subtitle1">{{ pacienteLabel || pacienteId }}</div>
      </q-card-section>

      <q-card-section v-if="loadingEdit" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="32px" />
      </q-card-section>

      <q-card-section v-else class="q-pt-none">
        <q-stepper
          v-model="step"
          flat
          color="primary"
          animated
          header-nav
          :contracted="$q.screen.lt.sm"
        >
          <!-- ============ STEP 1: TIPO DE CONSULTA ============ -->
          <q-step
            v-if="!isEditMode"
            :name="1"
            :title="tdc('Tipo de Consulta')"
            icon="category"
            :done="step > 1 && !!form.especialidade"
          >
            <div v-if="!pacienteId" class="q-mb-md">
              <s-select
                v-model="form.paciente"
                :api="pacienteSelectUrl"
                option-label="label" option-value="value"
                emit-value map-options
                :page-size="0"
                :label="tdc('Paciente')"
              />
            </div>

            <div class="text-caption text-grey-6 q-mb-sm">
              {{ tdc('Escolha o tipo de consulta para filtrar os médicos disponíveis.') }}
            </div>

            <s-select
              v-model="form.especialidade"
              :page-size="0"
              :api="especialidadeSelectUrl"
              option-label="label" option-value="value"
              emit-value map-options
              :label="tdc('Tipo de Consulta / Especialidade')"
              @update:model-value="onEspecialidadeChanged"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                color="primary" :label="tdc('Continuar')" icon-right="arrow_forward"
                :disable="!canLeaveStep1"
                @click="step = 2"
              />
            </div>
          </q-step>

          <!-- ============ STEP 2: MÉDICO ============ -->
          <q-step
            v-if="!isEditMode"
            :name="2"
            :title="tdc('Médico')"
            icon="medical_services"
            :done="step > 2 && !!form.medico"
          >
            <div v-if="loadingMedicos" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="28px" />
            </div>
            <div v-else-if="!medicoOptions.length" class="text-caption text-grey-6 q-pa-md text-center">
              {{ tdc('Nenhum médico ativo encontrado para esta especialidade.') }}
            </div>
            <q-list v-else bordered separator class="rounded-borders">
              <q-item
                v-for="m in medicoOptions" :key="m.employeeId" clickable
                :active="form.medico === m.employeeId"
                active-class="bg-blue-1 text-primary"
                @click="selectMedico(m)"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ m.label }}</q-item-label>
                  <q-item-label caption>{{ m.especialidadeLabels.join(', ') || '—' }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="form.medico === m.employeeId">
                  <q-icon name="check_circle" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>

            <div class="row justify-between q-mt-md">
              <q-btn flat :label="tdc('Voltar')" icon="arrow_back" @click="step = 1" />
              <q-btn
                color="primary" :label="tdc('Continuar')" icon-right="arrow_forward"
                :disable="!form.medico"
                @click="step = 3"
              />
            </div>
          </q-step>

          <!-- ============ STEP 3: DATA E HORA ============ -->
          <q-step
            :name="3"
            :title="tdc('Data e Hora')"
            icon="event_available"
            :done="step > 3 && !!form.hora_inicio"
          >
            <div v-if="isEditMode" class="q-mb-md">
              <div class="text-caption text-grey-6">{{ tdc('Médico') }}</div>
              <div class="text-subtitle1">{{ medicoSelecionadoLabel }}</div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 flex flex-center">
                <q-date
                  v-model="form.data"
                  :options="dateOptions"
                  flat bordered
                  :locale="ptLocale"
                  @update:model-value="onDataChanged"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-select
                  v-model="duracaoMin"
                  :options="duracaoOptions"
                  emit-value map-options
                  dense outlined
                  class="q-mb-md"
                  :label="tdc('Duração da Consulta')"
                  @update:model-value="buildSlots"
                />

                <div class="text-caption text-grey-6 q-mb-xs">
                  {{ tdc('Horários Disponíveis') }} — {{ form.data }}
                </div>

                <div v-if="loadingSlots" class="flex flex-center q-pa-md">
                  <q-spinner color="primary" size="24px" />
                </div>
                <div v-else-if="!horarioConfigurado" class="text-caption text-warning q-pa-sm bg-orange-1 rounded-borders">
                  <q-icon name="warning" class="q-mr-xs" />
                  {{ tdc('Médico sem horário configurado para este dia — a usar horário padrão (08:00–17:00).') }}
                  <br>
                </div>

                <div v-if="!loadingSlots && !slots.length" class="text-caption text-grey-6 q-pa-md text-center">
                  {{ tdc('Sem horários disponíveis neste dia.') }}
                </div>

                <div v-else class="row q-gutter-xs slot-grid">
                  <q-btn
                    v-for="s in slots" :key="s.inicio"
                    dense no-caps
                    :disable="s.busy || s.past"
                    :outline="form.hora_inicio !== s.inicio"
                    :color="form.hora_inicio === s.inicio ? 'primary' : (s.busy ? 'grey-5' : 'primary')"
                    :label="s.inicio"
                    class="slot-btn"
                    @click="selectSlot(s)"
                  />
                </div>
              </div>
            </div>

            <div class="row justify-between q-mt-md">
              <q-btn v-if="!isEditMode" flat :label="tdc('Voltar')" icon="arrow_back" @click="step = 2" />
              <div v-else />
              <q-btn
                color="primary" :label="tdc('Continuar')" icon-right="arrow_forward"
                :disable="!form.hora_inicio"
                @click="step = 4"
              />
            </div>
          </q-step>

          <!-- ============ STEP 4: CONFIRMAÇÃO ============ -->
          <q-step
            :name="4"
            :title="tdc('Confirmação')"
            icon="fact_check"
          >
            <s-card flat bordered class="q-pa-sm q-mb-md bg-grey-1">
              <div class="text-caption text-grey-7">{{ tdc('Resumo') }}</div>
              <div class="text-body2 q-mt-xs">
                <div><b>{{ tdc('Médico') }}:</b> {{ medicoSelecionadoLabel }}</div>
                <div><b>{{ tdc('Data') }}:</b> {{ form.data }}</div>
                <div><b>{{ tdc('Hora') }}:</b> {{ form.hora_inicio }} — {{ form.hora_fim }}</div>
              </div>
            </s-card>

            <s-select
              v-model="form.consultorio"
              :api="consultorioSelectUrl"
              option-label="label" option-value="value"
              emit-value map-options clearable
              :label="tdc('Consultório') + ' (' + tdc('opcional') + ')'"
              class="q-mb-md"
            />

            <q-select
              v-model="form.estado"
              :options="estadoOptions"
              emit-value map-options
              :label="tdc('Estado')"
              class="q-mb-md"
            />

            <q-input v-model="form.motivo" type="textarea" autogrow :label="tdc('Motivo')" class="q-mb-md" />
            <q-input
              v-model="form.observacao" type="textarea" autogrow
              :label="tdc('Observação') + ' (' + tdc('opcional') + ')'"
            />

            <div v-if="errorMsg" class="text-negative text-caption q-mt-sm">{{ errorMsg }}</div>

            <div class="row justify-between q-mt-md">
              <q-btn flat :label="tdc('Voltar')" icon="arrow_back" @click="step = 3" />
              <q-btn
                color="primary"
                :label="isEditMode ? tdc('Guardar Alterações') : tdc('Marcar Consulta')"
                icon-right="event_available"
                :loading="saving"
                @click="save"
              />
            </div>
          </q-step>
        </q-stepper>
      </q-card-section>
    </s-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import { useAgendaStore } from './../agenda/agendaStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pacienteId: { type: String, default: null },
  pacienteLabel: { type: String, default: null },
  editId: { type: String, default: null },
})

const isEditMode = computed(() => !!props.editId)
const editMedicoLabel = ref('')

const emit = defineEmits(['update:modelValue', 'saved'])

const Agenda = useAgendaStore()

const step = ref(1)

const pacienteSelectUrl = url({ type: 'u', url: 'saude/pacientes', params: { select: 'true' } })
const especialidadeSelectUrl = url({ type: 'u', url: 'hr/specialties', params: { select: 'true' } })
const consultorioSelectUrl = url({ type: 'u', url: 'saude/consultorios', params: { select: 'true' } })

const estadoOptions = [
  { label: tdc('Marcada'), value: 'marcada' },
  { label: tdc('Confirmada'), value: 'confirmada' },
  { label: tdc('Em Espera'), value: 'em_espera' },
  { label: tdc('Em Atendimento'), value: 'em_atendimento' },
  { label: tdc('Concluída'), value: 'concluida' },
  { label: tdc('Cancelada'), value: 'cancelada' },
  { label: tdc('Faltou'), value: 'faltou' },
]

const duracaoOptions = [
  { label: '15 ' + tdc('min'), value: 15 },
  { label: '30 ' + tdc('min'), value: 30 },
  { label: '45 ' + tdc('min'), value: 45 },
  { label: '60 ' + tdc('min'), value: 60 },
]

const ptLocale = {
  days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function toDateStr(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, '/')
}

function dateOptions(dateStr) {
  // dateStr no formato YYYY/MM/DD (padrão do q-date) — bloqueia datas passadas
  return dateStr >= toDateStr(new Date())
}

function emptyForm() {
  return {
    paciente: props.pacienteId || null,
    especialidade: null,
    medico: null,
    consultorio: null,
    data: todayISO().replace(/-/g, '/'),
    hora_inicio: null,
    hora_fim: null,
    estado: 'marcada',
    motivo: '',
    observacao: '',
  }
}

const form = reactive(emptyForm())
const saving = ref(false)
const errorMsg = ref('')

const canLeaveStep1 = computed(() => !!form.especialidade && !!(props.pacienteId || form.paciente))

// ---------------- MÉDICOS (filtrados client-side por especialidade) ----------------
const medicos = ref([])
const loadingMedicos = ref(false)

async function loadMedicos() {
  loadingMedicos.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/medicos',
      params: { ativo: 'true', page_size: 0 },
    }))
    medicos.value = data.results ?? data
  } finally {
    loadingMedicos.value = false
  }
}

const medicoOptions = computed(() => {
  if (!form.especialidade) return []
  return medicos.value
    .filter(m => (m.especialidade || []).some(e => e.id === form.especialidade || e.value === form.especialidade))
    .map(m => ({
      employeeId: m.employee?.value || m.employee?.id,
      label: m.label || m.employee?.label,
      especialidadeLabels: (m.especialidade || []).map(e => e.label),
    }))
    .filter(m => !!m.employeeId)
})

const medicoSelecionadoLabel = computed(() => {
  const m = medicoOptions.value.find(x => x.employeeId === form.medico)
  return m?.label || editMedicoLabel.value || '—'
})

function onEspecialidadeChanged() {
  form.medico = null
  if (form.especialidade) loadMedicos()
}

function selectMedico(m) {
  form.medico = m.employeeId
}

// ---------------- DISPONIBILIDADE (HorarioMedico + Agenda) ----------------
const slots = ref([])
const loadingSlots = ref(false)
const horarioConfigurado = ref(true)
const duracaoMin = ref(30)

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
function toHHMM(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0')
  const m = String(mins % 60).padStart(2, '0')
  return `${h}:${m}`
}
// dia_semana no backend segue date.weekday() do Python: Segunda=0 ... Domingo=6
function weekdayIndexPy(dateStrSlash) {
  const iso = dateStrSlash.replace(/\//g, '-')
  const jsDay = new Date(iso + 'T00:00:00').getDay() // 0=Dom..6=Sáb
  return (jsDay + 6) % 7 // 0=Seg..6=Dom
}

async function buildSlots() {
  if (!form.medico || !form.data) {
    slots.value = []
    return
  }
  loadingSlots.value = true
  form.hora_inicio = null
  form.hora_fim = null
  try {
    const iso = form.data.replace(/\//g, '-')
    const dow = weekdayIndexPy(form.data)

    const [horariosRes, agendasRes] = await Promise.all([
      HTTPAuth.get(url({ type: 'u', url: 'saude/horariomedicos', params: { employee: form.medico, dia_semana: dow, page_size: 50 } })),
      HTTPAuth.get(url({ type: 'u', url: 'saude/agendas', params: { medico: form.medico, data: iso, page_size: 100 } })),
    ])

    let horarios = horariosRes.data.results ?? horariosRes.data
    horarioConfigurado.value = horarios.length > 0
    if (!horarios.length) {
      horarios = [{ hora_inicio: '08:00:00', hora_fim: '17:00:00' }]
    }

    const agendas = (agendasRes.data.results ?? agendasRes.data)
      .filter(a => a.estado?.value !== 'cancelada' && a.id !== props.editId)
      .map(a => ({
        inicio: toMinutes(a.hora_inicio.slice(0, 5)),
        fim: a.hora_fim ? toMinutes(a.hora_fim.slice(0, 5)) : toMinutes(a.hora_inicio.slice(0, 5)) + 30,
      }))

    const nowMin = iso === todayISO() ? (new Date().getHours() * 60 + new Date().getMinutes()) : -1

    const generated = []
    for (const h of horarios) {
      const inicio = toMinutes(h.hora_inicio.slice(0, 5))
      const fim = toMinutes(h.hora_fim.slice(0, 5))
      for (let t = inicio; t + duracaoMin.value <= fim; t += duracaoMin.value) {
        const slotFim = t + duracaoMin.value
        const busy = agendas.some(a => t < a.fim && slotFim > a.inicio)
        generated.push({
          inicio: toHHMM(t),
          fim: toHHMM(slotFim),
          busy,
          past: nowMin >= 0 && t <= nowMin,
        })
      }
    }
    slots.value = generated
  } finally {
    loadingSlots.value = false
  }
}

function onDataChanged() {
  buildSlots()
}

function selectSlot(s) {
  if (s.busy || s.past) return
  form.hora_inicio = s.inicio
  form.hora_fim = s.fim
}

watch(() => form.medico, (val) => {
  if (val) buildSlots()
})

// ---------------- MODO EDIÇÃO ----------------
const loadingEdit = ref(false)
const originalHoraInicio = ref(null)
const originalHoraFim = ref(null)

function closestDuracao(mins) {
  return duracaoOptions.reduce((best, opt) =>
    Math.abs(opt.value - mins) < Math.abs(best - mins) ? opt.value : best, 30)
}

async function loadForEdit(id) {
  loadingEdit.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `saude/agendas/${id}/` }))

    form.paciente = data.paciente?.value || data.paciente?.id
    form.medico = data.medico?.value || data.medico?.id
    form.consultorio = data.consultorio?.value || data.consultorio?.id || null
    form.data = data.data.replace(/-/g, '/')
    form.estado = data.estado?.value || data.estado
    form.motivo = data.motivo || ''
    form.observacao = data.observacao || ''

    editMedicoLabel.value = data.medico?.label || ''

    const hi = data.hora_inicio.slice(0, 5)
    const hf = data.hora_fim ? data.hora_fim.slice(0, 5) : null
    originalHoraInicio.value = hi
    originalHoraFim.value = hf

    duracaoMin.value = hf ? closestDuracao(toMinutes(hf) - toMinutes(hi)) : 30

    step.value = 3

    await buildSlots()

    // buildSlots() limpa hora_inicio/hora_fim ao recalcular a grelha —
    // repõe o horário original da marcação (a própria marcação é
    // excluída do cálculo de ocupação, por isso o botão correspondente
    // fica disponível e é realçado normalmente).
    form.hora_inicio = hi
    form.hora_fim = hf
  } finally {
    loadingEdit.value = false
  }
}

// ---------------- DIÁLOGO ----------------
function resetForm() {
  Object.assign(form, emptyForm())
  errorMsg.value = ''
  step.value = 1
  slots.value = []
  medicos.value = []
  editMedicoLabel.value = ''
}

function onToggle(val) {
  emit('update:modelValue', val)
}

function close() {
  emit('update:modelValue', false)
}

function extractError(e) {
  const d = e?.response?.data?.detail
  if (Array.isArray(d)) return d[0]
  if (d) return d
  const data = e?.response?.data
  if (data && typeof data === 'object') {
    const first = Object.values(data)[0]
    return Array.isArray(first) ? first[0] : first
  }
  return tdc('Erro ao marcar consulta.')
}

async function save() {
  errorMsg.value = ''

  if (!form.paciente || !form.medico || !form.data || !form.hora_inicio) {
    errorMsg.value = tdc('Paciente, médico, data e hora de início são obrigatórios.')
    return
  }

  saving.value = true
  try {
    const payload = {
      paciente: form.paciente,
      medico: form.medico,
      consultorio: form.consultorio,
      data: form.data.replace(/\//g, '-'),
      hora_inicio: form.hora_inicio,
      hora_fim: form.hora_fim,
      estado: form.estado,
      motivo: form.motivo,
      observacao: form.observacao,
    }

    let result
    if (isEditMode.value) {
      const { data } = await HTTPAuth.patch(url({ type: 'u', url: `saude/agendas/${props.editId}/` }), payload)
      result = data
    } else {
      Agenda.form = payload
      result = await Agenda.create()
    }

    emit('saved', result)
    close()
  } catch (e) {
    errorMsg.value = extractError(e)
  } finally {
    saving.value = false
  }
}

// sempre que o diálogo abre, recomeça do zero (ou carrega a marcação, em modo edição)
watch(() => props.modelValue, (open) => {
  if (!open) return

  resetForm()
  if (isEditMode.value) loadForEdit(props.editId)
})
</script>

<style scoped>
.slot-grid {
  max-height: 260px;
  overflow-y: auto;
}
.slot-btn {
  min-width: 68px;
}
</style>
