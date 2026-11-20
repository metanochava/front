<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit customer contact' : 'New customer contact')"
    icon="contact_phone" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="customercontact-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6"><s-field v-model="Customercontact.form.customer" :field="fieldOf('customer')" :label="tdc('Customer')" :error="!!Customercontact.errors.customer" :error-message="Customercontact.errors.customer" data-test="f-customer" /></div>
      <div class="col-12 col-md-6"><s-field v-model="Customercontact.form.person" :field="fieldOf('person')" :label="tdc('Person')" :error="!!Customercontact.errors.person" :error-message="Customercontact.errors.person" data-test="f-person" :hint="tdc('Pick the person, or create them here')" /></div>
      <div class="col-12 col-md-6"><s-field v-model="Customercontact.form.role" :field="fieldOf('role')" :label="tdc('Role')" :error="!!Customercontact.errors.role" :error-message="Customercontact.errors.role" data-test="f-role" /></div>
      <div class="col-12 col-md-6"><s-toggle v-model="Customercontact.form.is_primary" :label="tdc('Main contact')" data-test="f-is_primary" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useCustomercontactStore } from './customercontactStore'

const Customercontact = useCustomercontactStore()
const { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save } = useRecordForm(Customercontact, {
  model: 'CustomerContact',
  defaults: () => ({})
})

onMounted(load)
</script>
