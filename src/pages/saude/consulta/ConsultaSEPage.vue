<template>
  <q-page class="q-pa-sm">
    <s-pdf-render
      v-model="Consulta.showPdf"
      :src="Consulta.pdf"
      :title="tdc('Medical consultation')"
    />

    <PacienteHeader v-if="patientId" :patient-id="patientId" />

    <!-- no patient open: a consultation always belongs to one -->
    <s-card v-if="!patientId && !loading" flat bordered class="q-pa-lg text-center" data-test="consultation-no-patient">
      <q-icon name="person_search" size="42px" color="grey-6" />
      <div class="text-subtitle1 q-mt-sm">{{ tdc('Open a patient to start a consultation.') }}</div>
      <s-btn class="q-mt-md" color="primary" unelevated size="md" icon="groups" :label="tdc('Patients')"
             :to="{ name: 'list_paciente' }" />
    </s-card>

    <template v-else>
      <LatestVitalSigns :paciente-id="patientId" />

      <s-card flat bordered class="consultation-card" data-test="consultation-form">
        <q-card-section class="row items-center q-gutter-sm">
          <q-icon name="medical_services" size="24px" color="primary" />
          <div class="col">
            <div class="text-h6">{{ isEdit ? tdc('Edit consultation') : tdc('New consultation') }}</div>
            <div class="text-caption text-grey-7" data-test="consultation-professional">
              <q-icon name="badge" size="14px" />
              {{ tdc('Professional') }}: <b>{{ professionalName || '-' }}</b>
              <span v-if="professionalPosition"> · {{ professionalPosition }}</span>
              · {{ dateText }}
              <span v-if="intake?.appointment"> · {{ tdc('Appointment') }} {{ intake.appointment.time }}</span>
            </div>
          </div>
        </q-card-section>

        <q-banner v-if="isEdit && Consulta.row && !editable" dense class="bg-grey-3 text-dark q-mx-md q-mb-md"
                  data-test="consultation-read-only">
          <q-icon name="lock" size="16px" />
          {{ tdc('Only the person who created this consultation can edit it, within 24 hours of its creation.') }}
        </q-banner>

        <q-banner v-if="intakeError" dense class="bg-negative text-white q-mx-md q-mb-md" data-test="consultation-intake-error">
          {{ intakeError }}
        </q-banner>

        <q-separator />

        <q-form ref="formRef" class="q-pa-md" @submit.prevent="save">
          <div class="row q-col-gutter-md">
            <div v-for="section in SECTIONS" :key="section.field" :class="section.cols" class="consultation-section q-mb-lg">
              <div class="consultation-section__title">
                <q-icon :name="section.icon" size="18px" /> {{ tdc(section.label) }}
                <span v-if="section.required" class="text-negative">*</span>
              </div>
              <s-editor
                v-model="Consulta.form[section.field]"
                :placeholder="section.hint"
                :toolbar="TOOLBAR"
                :min-height="section.minHeight"
                :error="!!Consulta.errors?.[section.field]"
                :error-message="Consulta.errors?.[section.field]"
                :data-test="`consultation-${section.field}`"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm">
            <s-btn flat size="md" :label="tdc('Cancel')" @click="router.back()" />
            <s-btn
              color="primary" unelevated size="md" icon="save" type="submit"
              :label="tdc('Save consultation')"
              :loading="Consulta.loading || Consulta.saving"
              :disable="!!intakeError || (isEdit && !editable)"
              data-test="consultation-save"
            />
          </div>
        </q-form>
      </s-card>
    </template>
  </q-page>
</template>

<script setup>
// add_consulta / change_consulta - the professional consultation form.
// On top: the patient (PacienteHeader) and the last vital signs
// (LatestVitalSigns). The patient comes from the context (the patient open in
// the header, or the consultation being edited); the professional is the one
// signed in, resolved by the server (GET consultas/intake/) and set again by
// POST consultas/ - never chosen here. State lives in the Consulta store
// (BaseStore) form, as every manual form.
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HTTPAuth, url, tdc, rawValue, AlertSuccess, useUserStore } from 'quasar_resaas'
import { canEditDocument } from '../components/documentEditPolicy'
import { useConsultaStore } from './consultaStore'
import { usePacienteStore } from '../paciente/pacienteStore'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import LatestVitalSigns from '../components/LatestVitalSigns.vue'

const route = useRoute()
const router = useRouter()
const Consulta = useConsultaStore()
const Paciente = usePacienteStore()

const SECTIONS = [
  {
    field: 'dc', icon: 'record_voice_over', required: true, minHeight: '160px', cols: 'col-12',
    label: 'Chief complaint and history of present illness',
    hint: 'What brings the patient, since when, how it evolved.'
  },
  {
    field: 'diagnostico', icon: 'fact_check', minHeight: '140px', cols: 'col-12 col-md-6',
    label: 'Diagnosis',
    hint: 'Working or final diagnosis.'
  },
  {
    field: 'conduta_a_estabelecer', icon: 'assignment', minHeight: '140px', cols: 'col-12 col-md-6',
    label: 'Plan',
    hint: 'Treatment, exams, referrals and follow-up.'
  }
]

// rich text (s-editor, like the other clinical documents); the PDF renders it
// as HTML (consultamedicabody.html). The section title is the label.
const TOOLBAR = [
  ['bold', 'italic', 'underline', 'strike'],
  ['unordered', 'ordered', 'outdent', 'indent'],
  ['undo', 'redo', 'fullscreen']
]

const textOf = (html) => String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim()

// s-editor is not a q-field, so q-form does not validate it: required
// sections are checked here, on their text without the HTML
function checkRequired() {
  const errors = { ...(Consulta.errors || {}) }
  let ok = true
  for (const section of SECTIONS) {
    delete errors[section.field]
    if (section.required && !textOf(Consulta.form[section.field])) {
      errors[section.field] = tdc('This field is required.')
      ok = false
    }
  }
  Consulta.errors = errors
  return ok
}

const formRef = ref(null)
const loading = ref(true)
const intake = ref(null)
const intakeError = ref(null)

const isEdit = computed(() => !!route.params.id)

// author only, within 24 h (UX; the backend answers 403 / 409 otherwise)
const User = useUserStore()
const editable = computed(() => !isEdit.value || canEditDocument(Consulta.row, User.data?.id))

// the consultation's own patient when editing; else the patient open in the header
const patientId = computed(() =>
  isEdit.value ? rawValue(Consulta.row?.paciente) || null : Paciente.row?.id || null
)

const professionalName = computed(() =>
  isEdit.value ? Consulta.row?.medico?.name : intake.value?.professional?.person?.full_name
)
const professionalPosition = computed(() => (isEdit.value ? null : intake.value?.professional?.position))
const dateText = computed(() => {
  const value = isEdit.value ? Consulta.row?.data : intake.value?.date
  return value ? new Date(value).toLocaleDateString() : new Date().toLocaleDateString()
})

async function loadIntake() {
  intake.value = null
  intakeError.value = null
  if (isEdit.value || !patientId.value) return
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'saude/consultas/intake/', params: { paciente: patientId.value } }))
    intake.value = data
  } catch (error) {
    // e.g. professional_required: this user has no employee record here
    intakeError.value = error?.response?.data?.error?.message || tdc('Could not load the consultation form.')
  }
}

async function init() {
  loading.value = true
  try {
    await Consulta.loadSchemaOnce()
    if (isEdit.value) {
      await Consulta.getById(route.params.id, { force: true })
    } else {
      Consulta.resetForm()
      await loadIntake()
    }
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!checkRequired() || !patientId.value) return

  if (!isEdit.value) Consulta.form = { ...Consulta.form, paciente: patientId.value }

  try {
    const saved = await Consulta.save()
    AlertSuccess(tdc('Consultation saved.'))
    if (!isEdit.value && saved?.id) {
      router.replace({ name: 'change_consulta', params: { id: saved.id } })
    }
    if (saved?.id) {
      await Consulta.getPdf(saved.id)
      Consulta.showPdf = true
    }
  } catch {
    // field errors land on their fields (Consulta.errors); the message goes
    // through the alert funnel
  }
}

// a required section stops complaining as soon as it has text
watch(
  () => SECTIONS.filter(s => s.required).map(s => textOf(Consulta.form[s.field])),
  (texts) => {
    SECTIONS.filter(s => s.required).forEach((s, i) => {
      if (texts[i] && Consulta.errors?.[s.field]) {
        const rest = { ...Consulta.errors }
        delete rest[s.field]
        Consulta.errors = rest
      }
    })
  }
)

watch(() => route.params.id, (id, old) => { if (id !== old) init() })
watch(patientId, (id, old) => { if (!isEdit.value && id !== old) loadIntake() })

onMounted(init)
</script>

<style scoped>
.consultation-card { border-radius: 14px; }
.consultation-section__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .8;
}
</style>
