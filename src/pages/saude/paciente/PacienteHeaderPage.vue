<template>
  <s-card flat bordered class="paciente-header q-mb-sm">
    <div class="row items-center no-wrap q-px-md q-py-sm">

      <!-- IDENTIDADE: foto + nome, com o NID logo por baixo (mesma altura da foto).
           Foto, nome e NID abrem o view_paciente deste paciente. -->
      <component
        :is="pacienteId ? 'router-link' : 'div'"
        v-bind="pacienteId ? { to: viewRoute } : {}"
        class="row items-center no-wrap identity"
        :class="{ 'identity--link': pacienteId }"
      >
        <q-avatar size="44px" color="primary" text-color="white" class="q-mr-md">
          <img v-if="photoUrl" :src="photoUrl" :alt="name">
          <span v-else>{{ initials }}</span>
        </q-avatar>

        <div class="identity-text">
          <div class="name ellipsis">{{ name || '—' }}</div>
          <div class="meta ellipsis">
            <span class="nid">
              <q-icon name="tag" size="13px" />
              {{ row?.nid || '—' }}
            </span>
            <template v-if="metaLine">
              <span class="sep">·</span>{{ metaLine }}
            </template>
          </div>
        </div>

        <q-badge v-if="statusLabel" :color="statusColor" class="q-ml-md gt-xs status-badge">
          {{ statusLabel }}
        </q-badge>

        <q-icon v-if="row?.clinical_alert" name="warning" color="negative" size="22px" class="q-ml-sm">
          <s-tooltip>{{ row.clinical_alert }}</s-tooltip>
        </q-icon>

        <s-tooltip v-if="pacienteId">{{ tdc('View patient') }}</s-tooltip>
      </component>

      <q-space />

      <!-- ACÇÕES CLÍNICAS (só ícones, para nunca aumentar a altura) -->
      <div class="row items-center no-wrap gt-sm actions">
        <s-btn
          v-for="action in actions"
          :key="action.icon"
          flat round dense
          :icon="action.icon"
          :to="action.to"
          :disable="!pacienteId"
        >
          <s-tooltip>{{ action.label }}</s-tooltip>
        </s-btn>
      </div>

      <q-separator vertical inset class="q-mx-sm gt-sm" />

      <!-- Record vital signs of this patient (same dialog as the dashboards) -->
      <s-btn
        v-if="User.can('add_dadovital')"
        flat round dense
        icon="monitor_heart"
        :disable="!pacienteId"
        data-test="patient-header-vital-signs"
        @click="showVitalsDialog = true"
      >
        <s-tooltip>{{ tdc('Record vital signs') }}</s-tooltip>
      </s-btn>

      <s-btn flat round dense icon="event" :disable="!pacienteId" @click="showAgendaDialog = true">
        <s-tooltip>{{ tdc('Appointment Schedule') }}</s-tooltip>
      </s-btn>

      <s-btn flat round dense icon="more_vert" :disable="!pacienteId">
        <q-menu auto-close>
          <q-list style="min-width: 200px">
            <q-item clickable :to="{ name: 'change_paciente', params: { id: pacienteId } }">
              <q-item-section avatar><q-icon name="edit" /></q-item-section>
              <q-item-section>{{ tdc('Edit Data') }}</q-item-section>
            </q-item>

            <q-item clickable @click="Paciente.getPdf(pacienteId)">
              <q-item-section avatar><q-icon name="picture_as_pdf" /></q-item-section>
              <q-item-section>{{ tdc('Patient card (PDF)') }}</q-item-section>
            </q-item>

            <!-- Same clinical shortcuts as the toolbar, for narrow screens -->
            <q-separator class="lt-md" />
            <q-item
              v-for="action in actions"
              :key="action.icon"
              clickable
              class="lt-md"
              :to="action.to"
            >
              <q-item-section avatar><q-icon :name="action.icon" /></q-item-section>
              <q-item-section>{{ action.label }}</q-item-section>
            </q-item>

            <q-separator />
            <q-item clickable @click="router.back()">
              <q-item-section avatar><q-icon name="arrow_back" /></q-item-section>
              <q-item-section>{{ tdc('Back') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </s-btn>
    </div>

    <vital-signs-dialog
      v-if="pacienteId"
      v-model="showVitalsDialog"
      :patient-id="pacienteId"
      @saved="showVitalsDialog = false"
    />

    <agenda-consulta-dialog
      v-model="showAgendaDialog"
      :paciente-id="pacienteId"
      :paciente-label="name"
    />

    <!-- "Patient card (PDF)" above calls Paciente.getPdf(), which sets
         Paciente.showPdf - but this header is reused across 20+ pages, each
         with its own store's <s-pdf-render> (Consulta, Receita, ...), so
         nothing was ever listening to Paciente.showPdf. Owning the viewer
         here fixes it everywhere at once. -->
    <s-pdf-render
      v-model="Paciente.showPdf"
      :src="Paciente.pdf"
      :title="tdc('Patient card')"
    />
  </s-card>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacienteStore } from './pacienteStore'
import AgendaConsultaDialog from './../components/AgendaConsultaDialog.vue'
import VitalSignsDialog from './../components/VitalSignsDialog.vue'

import { tdc, displayValue, rawValue, useUserStore } from 'quasar_resaas'

const route = useRoute()
const router = useRouter()

// A page whose route :id is NOT the patient (e.g. change_consulta/:id is the
// consultation) passes the patient here; without it the header keeps using
// the route id or the current patient.
const props = defineProps({
  patientId: { type: [String, Number], default: null }
})

const Paciente = usePacienteStore()
const showAgendaDialog = ref(false)
const showVitalsDialog = ref(false)
const User = useUserStore()

const row = computed(() => Paciente.row)
const person = computed(() => row.value?.person_data)
const pacienteId = computed(() => row.value?.id || null)
const viewRoute = computed(() => ({ name: 'view_paciente', params: { id: pacienteId.value } }))

const name = computed(() => person.value?.full_name || row.value?.person?.label || '')
const photoUrl = computed(() => person.value?.photo?.url || null)
const initials = computed(() =>
  String(name.value).split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?'
)

// "36 years · Masculine" - only what is actually known.
const metaLine = computed(() => {
  const age = person.value?.age
  const gender = displayValue(person.value?.gender)

  return [
    age !== null && age !== undefined ? `${age} ${tdc('years')}` : '',
    gender ? tdc(gender) : ''
  ].filter(Boolean).join(' · ')
})

const statusLabel = computed(() => {
  const label = displayValue(row.value?.status)
  return label ? tdc(label) : ''
})
const statusColor = computed(() => ({
  Active: 'positive',
  Inactive: 'grey',
  Deceased: 'dark'
}[rawValue(row.value?.status)] || 'grey'))

// Shortcuts to the clinical documents of THIS patient (the id used to be
// read from the store root, where it does not exist - the row holds it).
const actions = computed(() => {
  const params = { id: pacienteId.value }

  return [
    { icon: 'health_and_safety', label: tdc('Consultation'), to: { name: 'add_consulta', params } },
    { icon: 'medication', label: tdc('Prescription'), to: { name: 'add_receitamedica', params } },
    { icon: 'assignment', label: tdc('Certificate'), to: { name: 'add_atestadomedico', params } },
    { icon: 'swap_horiz', label: tdc('Transfer Referral'), to: { name: 'add_guiatransferencia', params } },
    { icon: 'science', label: tdc('Exam Requests'), to: { name: 'add_pedidoexamemedico', params } },
    { icon: 'bar_chart', label: tdc('Results'), to: { name: 'list_resultadopedidoexamemedico', params } },
    { icon: 'description', label: tdc('Report'), to: { name: 'add_relatoriomedico', params } }
  ]
})

async function load(id) {
  if (!id) {
    Paciente.resetForm?.()
    return
  }

  // avoid duplicate requests when the row is already the one being viewed
  // (not when it is only a snapshot restored from storage after F5)
  if (String(Paciente.row?.id) === String(id) && !Paciente.persistRestored?.('row')) {
    Paciente.form = Paciente.row
    return
  }

  Paciente.row = await Paciente.getById(id)
}

async function init() {
  await Paciente.init()

  await load(props.patientId || route.params.id || Paciente?.row?.id)
}

watch(() => props.patientId, (id) => { if (id) load(id) })

watch(
  () => route.params,
  async (params) => {
    if (!params || props.patientId) return

    await load(params.id)
  },
  { immediate: false } // init already handles the first load
)

onMounted(init)
</script>

<style scoped>
.paciente-header .identity {
  min-width: 0;
  color: inherit;
  text-decoration: none;
}
.paciente-header .identity--link {
  cursor: pointer;
}
.paciente-header .identity--link:hover .name {
  color: var(--q-primary);
}
.identity-text {
  min-width: 0;
  line-height: 1.2;
}
.identity-text .name {
  font-size: 15px;
  font-weight: 700;
  max-width: 320px;
}
.identity-text .meta {
  font-size: 12px;
  opacity: .7;
  max-width: 320px;
}
.identity-text .nid {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-weight: 600;
  letter-spacing: .02em;
}
.identity-text .sep {
  margin: 0 6px;
}
.status-badge {
  padding: 3px 8px;
  font-weight: 600;
}
</style>
