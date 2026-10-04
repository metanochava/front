<template>
  <s-card flat bordered class="q-mb-sm" :data-test="`consultation-card-${consulta.id}`">
    <q-card-section class="row items-center no-wrap q-py-sm">
      <q-icon name="event_available" color="primary" size="22px" class="q-mr-sm" />
      <div class="col">
        <div class="text-subtitle2">{{ showPatient ? (consulta.paciente?.label || tdc('Patient')) : consulta.data }}</div>
        <div class="text-caption text-grey-7">
          <template v-if="showPatient">{{ consulta.data }} · </template>{{ consulta.employee?.label || '—' }}
        </div>
      </div>
      <ConsultationActions :consulta="consulta" :hide-documents="standalone" />
      <s-btn
        v-if="!standalone"
        flat round dense color="primary" icon="open_in_new" data-test="consultation-open"
        @click="router.push({ name: 'view_consulta', params: { id: consulta.id } })"
      >
        <s-tooltip>{{ tdc('Open consultation') }}</s-tooltip>
      </s-btn>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-sm">
      <div v-if="!sections.length" class="text-caption text-grey-6">
        {{ tdc('No content recorded') }}
      </div>
      <!-- the same layout as the form and the PDF: the complaint across the
           whole width, diagnosis and plan side by side (from md up) -->
      <div v-else class="row q-col-gutter-md">
        <div v-for="section in sections" :key="section.field" :class="section.cols" class="q-mb-sm">
          <div class="text-caption text-weight-medium text-grey-8">
            <q-icon :name="section.icon" size="16px" class="q-mr-xs" />{{ tdc(section.label) }}
          </div>
          <!-- clinical rich text, sanitized (allowlist, no attributes): clinicalHtml.js -->
          <div class="consultation-text" v-html="section.html" />
        </div>
      </div>
    </q-card-section>
  </s-card>
</template>

<script setup>
// One consultation with all its content (complaint/history, diagnosis, plan),
// for reading a patient's consultations without opening each one.
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'

import ConsultationActions from './ConsultationActions.vue'
import { sanitizeClinicalHtml, hasClinicalText } from './clinicalHtml'

const props = defineProps({
  consulta: { type: Object, required: true },
  // lists of several patients (the saude dashboard) show whose it is
  showPatient: { type: Boolean, default: false },
  // the consultation's own page: no "open", and its documents are listed beside it
  standalone: { type: Boolean, default: false },
})

const router = useRouter()

// the same sections (and labels) as the consultation form, ConsultaSEPage
const SECTIONS = [
  { field: 'dc', icon: 'record_voice_over', label: 'Chief complaint and history of present illness', pair: false },
  { field: 'diagnostico', icon: 'fact_check', label: 'Diagnosis', pair: true },
  { field: 'conduta_a_estabelecer', icon: 'assignment', label: 'Plan', pair: true },
]

// diagnosis and plan share a row when both are filled; one alone takes the row
const sections = computed(() => {
  const shown = SECTIONS.filter(section => hasClinicalText(props.consulta[section.field]))
  const paired = shown.filter(section => section.pair).length === 2
  return shown.map(section => ({
    ...section,
    cols: section.pair && paired ? 'col-12 col-md-6' : 'col-12',
    html: sanitizeClinicalHtml(props.consulta[section.field]),
  }))
})
</script>

<style scoped>
.consultation-text {
  white-space: normal;
  word-break: break-word;
}
.consultation-text :deep(p) {
  margin: 0 0 4px;
}
</style>
