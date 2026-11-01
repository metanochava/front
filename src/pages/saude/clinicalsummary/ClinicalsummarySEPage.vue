<template>
  <q-page class="q-pa-sm">

    <s-pdf-render
      v-model="Clinicalsummary.showPdf"
      :src="Clinicalsummary.pdf"
      :title="tdc('Clinical summary')"
    />

    <PacienteHeader />

    <div class="summary-banner row items-center no-wrap q-mb-md">
      <q-icon name="summarize" size="48px" color="primary" class="q-mr-md" />
      <div class="col text-center">
        <div class="banner-title">{{ tdc('Clinical summary').toUpperCase() }}</div>
        <div class="banner-subtitle">{{ tdc('Structured account of the case, issued by the attending physician') }}</div>
      </div>
      <div style="width: 64px" />
    </div>

    <div v-if="Clinicalsummary.loading" class="flex flex-center q-pa-xl">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <s-card v-else flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md items-start">
          <div class="col-12 col-md">
            <s-input
              v-model="Clinicalsummary.form.purpose"
              dense
              :label="tdc('Purpose')"
              :placeholder="tdc('e.g. Referral, insurer, at the patient\'s request')"
              maxlength="200"
              data-test="clinical-summary-purpose"
            />
          </div>
          <div class="col-12 col-md-auto">
            <!-- what the record already says, as a suggestion to review -->
            <s-btn
              outline
              no-caps
              color="primary"
              icon="auto_fix_high"
              :label="tdc('Fill from the record')"
              :loading="filling"
              data-test="clinical-summary-fill"
              @click="askFill"
            >
              <s-tooltip>{{ tdc('Fill the sections with what the record already says (to review before issuing)') }}</s-tooltip>
            </s-btn>
          </div>
        </div>

        <!-- the sections, in the order of the document -->
        <div class="row q-col-gutter-md q-mt-xs">
          <div v-for="section in SECTIONS" :key="section.key" :class="section.wide ? 'col-12' : 'col-12 col-md-6'">
            <s-editor
              v-model="Clinicalsummary.form[section.key]"
              :label="tdc(section.label)"
              min-height="140px"
              :data-test="`clinical-summary-${section.key}`"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <s-btn flat color="grey" icon="arrow_back" :label="tdc('Cancel')" @click="router.back()">
          <s-tooltip>{{ tdc('Cancel') }}</s-tooltip>
        </s-btn>
        <s-btn
          color="primary"
          icon="save"
          :label="tdc('Issue summary')"
          :loading="Clinicalsummary.saving"
          data-test="clinical-summary-save"
          @click="save"
        >
          <s-tooltip>{{ tdc('Issue summary') }}</s-tooltip>
        </s-btn>
      </q-card-actions>
    </s-card>

  </q-page>
</template>

<script setup>
// Clinical summary (resumo clínico): the doctor writes - or fills from the
// record and reviews - each section, then issues it (POST clinicalsummaries/,
// at the patient's consultation of today) and the PDF opens.
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tdc, url, HTTPAuth, sDialog } from 'quasar_resaas'

import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import { useClinicalsummaryStore } from './clinicalsummaryStore'
import { usePacienteStore } from './../paciente/pacienteStore'

const SECTIONS = [
  { key: 'history', label: 'Clinical history' },
  { key: 'findings', label: 'Physical examination' },
  { key: 'diagnoses', label: 'Diagnoses' },
  { key: 'investigations', label: 'Relevant investigations' },
  { key: 'treatment', label: 'Treatment' },
  { key: 'clinical_course', label: 'Clinical course' },
  { key: 'recommendations', label: 'Recommendations and follow-up', wide: true },
]

const route = useRoute()
const router = useRouter()
const Paciente = usePacienteStore()
const Clinicalsummary = useClinicalsummaryStore()

// ---------------------------------------------------------------- fill from the record
const filling = ref(false)

const isBlank = (html) => !String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

function askFill () {
  // never overwrite what the doctor wrote without asking
  const written = SECTIONS.some((section) => !isBlank(Clinicalsummary.form[section.key]))
  if (!written) return fill()
  sDialog({
    title: tdc('Fill from the record'),
    message: tdc('The sections already written will be replaced. Continue?'),
    icon: 'auto_fix_high',
    cancel: true,
  }).onOk(fill)
}

async function fill () {
  if (!Paciente.row?.id) return
  filling.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u', url: 'saude/clinicalsummaries/draft/', params: { paciente: Paciente.row.id },
    }))
    for (const section of SECTIONS) Clinicalsummary.form[section.key] = data[section.key] || ''
  } finally {
    filling.value = false
  }
}

// ---------------------------------------------------------------- issue
async function save () {
  Clinicalsummary.form.paciente = Paciente.row?.id
  Clinicalsummary.form.state = 'Active'

  const data = await Clinicalsummary.save()
  const item = data?.data
  if (!item?.id) return

  await Clinicalsummary.getPdf(item.id)
  Clinicalsummary.showPdf = true
  await Clinicalsummary.loadData()
}

// ---------------------------------------------------------------- load
async function load (id) {
  if (!id) {
    Clinicalsummary.resetForm()
    return
  }
  if (String(Clinicalsummary.row?.id) === String(id)) {
    Clinicalsummary.form = { ...Clinicalsummary.row }
    return
  }
  await Clinicalsummary.getById(id)
}

onMounted(async () => {
  await Clinicalsummary.init()
  await load(route.params.id)
})

watch(() => route.params.id, load)
</script>

<style scoped>
/* day / night: the theme's primary colour, a light tint of it as background */
.summary-banner {
  background: color-mix(in srgb, var(--q-primary) 6%, transparent);
  border: 2px solid var(--q-primary);
  border-radius: 8px;
  padding: 12px;
}

.body--dark .summary-banner {
  background: color-mix(in srgb, var(--q-primary) 14%, transparent);
}

.banner-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--q-primary);
  letter-spacing: 2px;
}

.banner-subtitle {
  font-size: 12px;
  opacity: .7;
  margin-top: 4px;
}
</style>
