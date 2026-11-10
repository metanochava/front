<template>
  <!-- a new hr.Specialty from the employee's Employment tab: once saved it is
       given to the employee at once (EmployeeProfilePage @saved) -->
  <s-modal-card :title="tdc('New specialty')" icon="medical_services" width="min(560px, 92vw)" @close="emit('cancel')">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-8">
        <s-input
          v-model="Specialty.form.title"
          :label="tdc('Title')"
          :error="!!Specialty.errors?.title"
          :error-message="Specialty.errors?.title"
          autofocus
          data-test="specialty-title"
        />
      </div>
      <div class="col-12 col-sm-4">
        <s-input
          v-model="Specialty.form.code"
          :label="tdc('Code')"
          :error="!!Specialty.errors?.code"
          :error-message="Specialty.errors?.code"
        />
      </div>
      <div class="col-12">
        <s-input
          v-model="Specialty.form.signature"
          :label="tdc('Signature')"
          :hint="tdc('Printed under the signer\'s name on the documents they sign, e.g. Senior Accountant')"
          :error="!!Specialty.errors?.signature"
          :error-message="Specialty.errors?.signature"
        />
      </div>
      <div class="col-12">
        <s-input
          v-model="Specialty.form.description"
          type="textarea"
          autogrow
          :label="tdc('Description')"
        />
      </div>
    </div>

    <template #footer>
      <s-btn flat :label="tdc('Cancel')" @click="emit('cancel')">
        <s-tooltip>{{ tdc('Close without saving') }}</s-tooltip>
      </s-btn>
      <s-btn
        color="primary" icon="save" :label="tdc('Save')"
        :loading="saving"
        :disable="!String(Specialty.form.title || '').trim()"
        data-test="specialty-save"
        @click="save"
      >
        <s-tooltip>{{ tdc('Save the specialty and give it to this employee') }}</s-tooltip>
      </s-btn>
    </template>
  </s-modal-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import { useSpecialtyStore } from '../stores/SpecialtyStore.js'

const emit = defineEmits(['saved', 'cancel'])

const Specialty = useSpecialtyStore()
const saving = ref(false)

onMounted(async () => {
  await Specialty.loadSchemaOnce()
  Specialty.resetForm()
})

async function save() {
  saving.value = true
  try {
    Specialty.form.state = 'Active'
    const data = await Specialty.save()
    // the create answer is the row, or {data: row}
    const row = data?.data ?? data
    if (row?.id) emit('saved', row)
  } catch {
    // field errors are shown on the inputs (Specialty.errors); the rest
    // goes through the alert funnel
  } finally {
    saving.value = false
  }
}
</script>
