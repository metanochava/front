<template>
  <q-page class="q-pa-sm medico-se-page">
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
                icon="medical_services"
                class="q-mr-md"
              />
              <div class="col">
                <div class="text-h6 text-weight-bold">
                  {{ isEditMode ? tdc('Edit doctor') : tdc('Add doctor') }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ tdc('Pick the employee who is this doctor.') }}
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <!-- =========================================
             EMPLOYEE (search in a modal, then a summary)
        ========================================== -->
        <div class="col-12">
          <s-card flat bordered>
            <q-card-section class="row items-center q-col-gutter-sm">
              <div class="col row items-center no-wrap">
                <q-icon name="engineering" size="24px" class="q-mr-sm" />
                <div class="text-subtitle1 text-weight-bold">{{ tdc('Employee') }}</div>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <s-relation-picker
                  v-if="employeeConfig"
                  v-model="Medico.form.employee"
                  mode="modal"
                  :relation-config="employeeConfig"
                  :label="tdc('Employee')"
                  :placeholder="tdc('Search an existing employee')"
                  :creatable="false"
                  :editable="false"
                  :readonly="isEditMode"
                  :error="!!employeeError"
                  :error-message="employeeError"
                />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div v-if="employeeSummary" class="row items-center no-wrap q-gutter-md" data-test="employee-summary">
                <q-avatar size="56px" class="employee-avatar">
                  <img v-if="employeeSummary.avatar?.url" :src="employeeSummary.avatar.url" :alt="employeeSummary.title">
                  <span v-else>{{ initials(employeeSummary.title) }}</span>
                </q-avatar>

                <div class="col">
                  <div class="text-subtitle1 text-weight-bold">{{ employeeSummary.title }}</div>
                  <div class="text-caption">{{ employeeSummary.subtitle.join(' · ') }}</div>
                  <div v-if="employeeSummary.meta.length" class="text-caption text-grey-7">
                    <span v-for="item in employeeSummary.meta" :key="item.field" class="q-mr-md">
                      {{ tdc(item.label) }}: {{ item.value }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-else class="text-caption text-grey-7">
                {{ isEditMode
                  ? tdc('The employee of an existing doctor cannot be changed.')
                  : tdc('Pick the employee who is this doctor.') }}
              </div>
            </q-card-section>
          </s-card>
        </div>

        <!-- =========================================
             DOCTOR DATA
        ========================================== -->
        <div class="col-12">
          <s-card flat bordered>
            <q-card-section class="row items-center">
              <q-icon name="medical_information" size="24px" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-bold">{{ tdc('Doctor data') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-4">
                  <s-field
                    v-model="Medico.form.numero_ordem"
                    :field="fieldOf('numero_ordem')"
                    :error="!!Medico.errors.numero_ordem"
                    :error-message="Medico.errors.numero_ordem"
                    :filled="false"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <s-field
                    v-model="Medico.form.categoria"
                    :field="fieldOf('categoria')"
                    :error="!!Medico.errors.categoria"
                    :error-message="Medico.errors.categoria"
                    :filled="false"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <s-multiselect
                    v-model="Medico.form.especialidade"
                    :api="specialtiesApi"
                    :label="tdc('Specialties')"
                    :error="!!Medico.errors.especialidade"
                    :error-message="Medico.errors.especialidade"
                    :filled="false"
                    dense outlined
                  />
                </div>

                <div class="col-12 col-md-9">
                  <s-field
                    v-model="Medico.form.observacao"
                    :field="fieldOf('observacao')"
                    :filled="false"
                    dense outlined
                  />
                </div>
                <div class="col-12 col-md-3 flex items-center">
                  <s-field
                    v-model="Medico.form.ativo"
                    :field="fieldOf('ativo')"
                    :label="tdc('Active')"
                    dense
                  />
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <!-- =========================================
             SIGNATURE AND STAMP
        ========================================== -->
        <div class="col-12">
          <s-card flat bordered>
            <q-card-section class="row items-center">
              <q-icon name="draw" size="24px" class="q-mr-sm" />
              <div class="text-subtitle1 text-weight-bold">{{ tdc('Signature and stamp') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <s-field v-model="Medico.form.assinatura" :field="fieldOf('assinatura')" />
                </div>
                <div class="col-12 col-sm-6">
                  <s-field v-model="Medico.form.carimbo" :field="fieldOf('carimbo')" />
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
                :label="isEditMode ? tdc('Save changes') : tdc('Save doctor')"
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

import { buildWritePayload, updateWithPayload, usePageTitle, useRelationSearch, tdc, url, Alert } from 'quasar_resaas'

import { useMedicoStore } from './medicoStore'

// Manual form (same approach as PacienteSEPage): the layout is composed with
// s-* components while the state stays in the real BaseStore (Medico.form,
// Medico.errors, schema fields). The Employee is picked through the generic
// relation picker - its search, preview and permissions all come from the
// schema's relation_config, nothing here knows the Employee model.
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const Medico = useMedicoStore()

const formRef = ref(null)
const saving = ref(false)
const employeeMissing = ref(false)

// /change_medico/:id and /add_medico route to this same page
// (medicoRoutes.js) - route.params.id tells them apart.
const medicoId = computed(() => route.params.id || null)
const isEditMode = computed(() => !!medicoId.value)

usePageTitle(() => {
  const name = Medico.form.employee?.label
  return isEditMode.value && name ? `${tdc('Edit doctor')} - ${name}` : ''
})

function fieldOf(name) {
  return (Medico.fields || []).find(f => f.name === name) || { name, type: 'CharField', label: name }
}

const employeeConfig = computed(() => fieldOf('employee').relation_config || null)
const specialtiesApi = url({ type: 'u', url: 'hr/specialtys/' })

const employeeError = computed(() =>
  Medico.errors.employee || (employeeMissing.value ? tdc('Select an employee') : '')
)

// ---------------- employee summary ----------------
// The preview the picker showed when the employee was picked, or - for a
// doctor loaded to edit - looked up once through the same endpoint.
const search = useRelationSearch(() => employeeConfig.value)
const employeeSummary = ref(null)

watch(
  () => Medico.form.employee,
  async (employee) => {
    employeeMissing.value = false

    const id = employee?.value ?? employee
    if (id === null || id === undefined || id === '') {
      employeeSummary.value = null
      return
    }

    if (employee?.preview) {
      employeeSummary.value = employee.preview
      return
    }

    const row = await search.fetchOne(id)

    if ((Medico.form.employee?.value ?? Medico.form.employee) === id) {
      employeeSummary.value = row?.preview || null
    }
  },
  { deep: false }
)

function initials(text) {
  return String(text || '')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map(word => word[0].toUpperCase()).join('') || '?'
}

// ---------------- save ----------------
const ids = (options) => (options || []).map(option => option?.value ?? option?.id ?? option)

function buildPayload() {
  const payload = buildWritePayload(Medico.form, Medico.fields, {
    // the doctor's employee never changes once created
    exclude: isEditMode.value ? ['employee'] : []
  })

  // not a model field: MedicoSerializer.especialidade (write-only, many)
  payload.especialidade = ids(Medico.form.especialidade)

  return payload
}

async function createDoctor(payload) {
  const original = Medico.form

  Medico.form = payload

  try {
    return await Medico.create()
  } catch (error) {
    Medico.form = original
    throw error
  }
}

async function save() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  if (!isEditMode.value && !Medico.form.employee) {
    employeeMissing.value = true
    return
  }

  saving.value = true

  try {
    const payload = buildPayload()

    const saved = isEditMode.value
      ? await updateWithPayload(Medico, payload)
      : await createDoctor(payload)

    router.push({ name: 'view_medico', params: { id: saved?.id || medicoId.value } })
  } catch (error) {
    Alert(error?.response)
  } finally {
    saving.value = false
  }
}

function hasUnsavedData() {
  const form = Medico.form || {}
  return !!(form.employee || form.numero_ordem || form.categoria || form.observacao || form.especialidade?.length)
}

function cancel() {
  if (isEditMode.value || !hasUnsavedData()) {
    router.back()
    return
  }

  $q.dialog({
    title: tdc('Discard changes?'),
    message: tdc('The doctor form has unsaved information. Are you sure you want to leave?'),
    persistent: true,
    ok: { label: tdc('Discard'), color: 'negative', flat: true },
    cancel: { label: tdc('Keep editing'), flat: true }
  }).onOk(() => router.back())
}

// ---------------- load ----------------
async function loadForEdit() {
  await Medico.getById(medicoId.value, { force: true })
}

function startNew() {
  Medico.resetForm?.()

  if (Medico.form.ativo === undefined || Medico.form.ativo === null) Medico.form.ativo = true

  employeeSummary.value = null
}

onMounted(async () => {
  await Medico.loadSchemaOnce()

  if (isEditMode.value) await loadForEdit()
  else startNew()
})

// The same component instance is reused for change_medico/A -> /B.
watch(() => route.params.id, async (id) => {
  if (id) await loadForEdit()
  else startNew()
})
</script>

<style scoped>
.employee-avatar {
  background: color-mix(in srgb, var(--q-primary) 14%, transparent);
  color: var(--q-primary);
  font-weight: 700;
}
</style>
