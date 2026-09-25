<template>
  <q-page class="q-pa-sm paciente-se-page">
    <q-form ref="formRef" @submit.prevent="save">
      <div class="row q-col-gutter-md">

        <!-- =========================================
             HEADER
        ========================================== -->
        <div class="col-12">
          <s-card flat bordered>
            <q-card-section class="row items-center no-wrap">
              <q-avatar
                size="44px"
                color="primary"
                text-color="white"
                icon="personal_injury"
                class="q-mr-md"
              />
              <div class="col">
                <div class="text-h6 text-weight-bold">
                  {{ isEditMode ? tdc('Edit patient') : tdc('Add patient') }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ isEditMode
                    ? tdc('Patient No.') + ': ' + (Paciente.form.nid || '—')
                    : tdc('Search for an existing person happens automatically when you save.') }}
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <!-- =========================================
             PERSON (photo, personal data, contacts,
             address, documents, emergency contacts)
        ========================================== -->
        <div class="col-12">
          <s-person-intake :intake="intake" :relation-config="personRelationConfig" />
        </div>

        <!-- =========================================
             PATIENT DATA
        ========================================== -->
        <div class="col-12">
          <s-card flat bordered>
            <q-card-section class="row items-center">
              <q-icon name="medical_information" size="24px" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-bold">{{ tdc('Patient data') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-3">
                  <s-input
                    :model-value="Paciente.form.nid"
                    :label="tdc('Patient No.')"
                    :hint="isEditMode ? undefined : tdc('Generated automatically')"
                    readonly
                    dense
                    outlined
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <s-field
                    v-model="Paciente.form.status"
                    :field="intake.fieldOf(Paciente, 'status')"
                    :label="tdc('Status')"
                    :error="!!Paciente.errors.status"
                    :error-message="Paciente.errors.status"
                    :filled="false"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <s-field
                    v-model="Paciente.form.religion"
                    :field="intake.fieldOf(Paciente, 'religion')"
                    :label="tdc('Religion')"
                    :error="!!Paciente.errors.religion"
                    :error-message="Paciente.errors.religion"
                    :filled="false"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-md-3" />

                <div class="col-12 col-md-4">
                  <s-input
                    v-model="Paciente.form.clinical_alert"
                    type="textarea"
                    autogrow
                    :label="tdc('Clinical alert')"
                    :hint="tdc('Shown prominently to every professional who opens this patient')"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-md-4">
                  <s-input
                    v-model="Paciente.form.special_needs"
                    type="textarea"
                    autogrow
                    :label="tdc('Special needs')"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-md-4">
                  <s-input
                    v-model="Paciente.form.care_preferences"
                    type="textarea"
                    autogrow
                    :label="tdc('Care preferences')"
                    dense outlined
                  />
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <!-- =========================================
             ACTIONS
        ========================================== -->
        <div class="col-12">
          <s-card flat class="q-pa-sm">
            <div class="row justify-end q-gutter-sm">
              <s-btn flat color="grey-7" :label="tdc('Cancel')" :disable="saving" @click="cancel" />
              <s-btn
                type="submit"
                unelevated
                color="primary"
                icon="save"
                :loading="saving"
                :disable="saving"
                :label="isEditMode ? tdc('Save changes') : tdc('Save patient')"
              />
            </div>
          </s-card>
        </div>

      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import { usePersonIntake, buildWritePayload, updateWithPayload, usePageTitle, tdc, Alert, sDialog } from 'quasar_resaas'

import { usePacienteStore } from './pacienteStore'

// Health-side twin of EmployeeSEPage.vue (lib): the Person half of the form
// (photo, personal data, contacts, address, documents, emergency contacts,
// duplicate matching, edit load/diff-save) is the shared usePersonIntake()
// + <s-person-intake>; only what belongs to a PATIENT lives here - the
// Paciente fields, PacienteAPIView.register on create, and a plain PATCH
// on edit.
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const Paciente = usePacienteStore()
const intake = usePersonIntake()
const { Person } = intake

const formRef = ref(null)
const saving = ref(false)

// /change_paciente/:id and /add_paciente route to this same page
// (pacienteRoutes.js) - route.params.id tells them apart.
const patientId = computed(() => route.params.id || null)
const isEditMode = computed(() => !!patientId.value)

// editing: "Edit patient - <name>" (add keeps the route's own title)
usePageTitle(() => {
  const name = Person.form.full_name || [Person.form.name, Person.form.surname].filter(Boolean).join(' ')
  return isEditMode.value && name ? `${tdc('Edit patient')} - ${name}` : ''
})

// The Person relation's own schema config (endpoint, permissions, preview) -
// the same "existing person" picker add_employee uses. Not offered when
// editing: the Person is fixed there.
const personRelationConfig = computed(() =>
  isEditMode.value ? null : intake.fieldOf(Paciente, 'person').relation_config || null
)

// nid/state are generated/forced by the backend - never part of what the
// user edits. The person's occupation and emergency contacts live on the
// Person (s-person-intake), not here.
const PATIENT_FIELDS = ['status', 'religion', 'clinical_alert', 'special_needs', 'care_preferences']

function buildPatientData() {
  return Object.fromEntries(
    PATIENT_FIELDS
      .filter(key => Paciente.form[key] !== undefined)
      .map(key => [key, Paciente.form[key]])
  )
}

async function saveNew() {
  const outcome = await intake.resolveMatch()
  if (outcome === 'cancel') return

  saving.value = true

  const paciente = await Paciente.register({
    ...intake.registrationPayload(),
    patientData: buildPatientData()
  })

  // the draft is done: it must not come back on the next "add patient"
  Paciente.resetForm?.()
  Paciente.personDraft = null

  router.push({ name: 'view_paciente', params: { id: paciente.id } })
}

async function saveEdit() {
  saving.value = true

  await intake.saveExisting()

  // Write payload, not the loaded read shape ({id,value,label} choices/
  // relations would be rejected). nid/state are generated by the backend
  // and person never changes on edit.
  await updateWithPayload(
    Paciente,
    buildWritePayload(Paciente.form, Paciente.fields, { exclude: ['nid', 'state', 'person'] })
  )

  router.push({ name: 'view_paciente', params: { id: patientId.value } })
}

async function save() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    if (isEditMode.value) await saveEdit()
    else await saveNew()
  } catch (error) {
    const existingId = error?.response?.data?.existing_paciente_id

    if (error?.response?.status === 409 && existingId) {
      $q.notify({
        type: 'warning',
        timeout: 10000,
        message: tdc('This person is already a patient in this branch.'),
        actions: [
          {
            label: tdc('View patient'),
            color: 'white',
            handler: () => router.push({ name: 'view_paciente', params: { id: existingId } })
          },
          { icon: 'close', color: 'white' }
        ]
      })
    } else {
      Alert(error?.response)
    }
  } finally {
    saving.value = false
  }
}

function cancel() {
  if (!intake.hasUnsavedData()) {
    router.back()
    return
  }

  sDialog({
    title: tdc('Discard changes?'),
    message: tdc('The patient form has unsaved information. Are you sure you want to leave?'),
    persistent: true,
    ok: { label: tdc('Discard'), color: 'negative', flat: true },
    cancel: { label: tdc('Keep editing'), flat: true }
  }).onOk(() => {
    if (!isEditMode.value) { // discard the saved draft too
      Paciente.resetForm?.()
      Paciente.personDraft = null
    }
    router.back()
  })
}

// change_paciente - the real row (with its nested Person) instead of a
// blank form, so save() PATCHes instead of registering a duplicate.
async function loadForEdit() {
  const paciente = await Paciente.getById(patientId.value, { force: true })
  await intake.loadExisting(paciente.person_data || {})
}

onMounted(async () => {
  // add_paciente: a draft restored after F5 (a form WITHOUT id - a form with
  // an id is an existing patient's data and never prefills a new one)
  const draft = !isEditMode.value && Paciente.persistRestored?.('form') && !Paciente.form?.id
    ? { ...Paciente.form }
    : null
  const personDraft = !isEditMode.value ? Paciente.personDraft : null

  Paciente.resetForm?.()
  intake.reset({ withBlankContact: !isEditMode.value })

  await Promise.all([
    intake.init(),
    Paciente.loadSchemaOnce()
  ])

  if (isEditMode.value) {
    await loadForEdit()
    return
  }

  Paciente.resetForm?.()
  Person.resetForm?.()
  if (draft) Paciente.form = { ...Paciente.form, ...draft }
  if (personDraft) intake.restoreDraft(personDraft)
  draftReady.value = true
})

// add_paciente only, once the page (and any restored draft) is in place:
// every change of the Person half becomes the persisted draft. Registered
// here in setup so it stops with the page; never while editing (that is an
// existing person, not a draft).
const draftReady = ref(false)
watch(() => intake.draftState(), (state) => {
  if (!draftReady.value || isEditMode.value) return
  Paciente.personDraft = intake.hasUnsavedData() ? state : null
}, { deep: true })

// Same component instance is reused for change_paciente/A -> /B.
watch(() => route.params.id, async (id) => {
  if (id) draftReady.value = false
  if (id) await loadForEdit()
})
</script>
