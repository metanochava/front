<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit supplier' : 'New supplier')"
    icon="local_shipping" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="supplier-form"
    @save="save" @cancel="back"
  >
    <div class="text-subtitle2 text-grey-7 q-mb-xs">{{ tdc('Supplier type') }}</div>
    <q-btn-toggle :model-value="type" :options="typeOptions" no-caps unelevated toggle-color="primary" color="grey-3" text-color="grey-9"
                  data-test="f-supplier_type" @update:model-value="setType" />
    <div class="row q-col-gutter-md">
      <div v-if="type === 'individual'" class="col-12 col-md-8"><s-field v-model="Supplier.form.person" :field="fieldOf('person')" :label="tdc('Person')" :error="!!Supplier.errors.person" :error-message="Supplier.errors.person" data-test="f-person" :hint="tdc('Pick the person, or create them here')" /></div>
      <div v-if="type === 'company'" class="col-12 col-md-8"><s-input v-model="Supplier.form.company_name" :label="tdc('Company name')" :error="!!Supplier.errors.company_name" :error-message="Supplier.errors.company_name" data-test="f-company_name" /></div>
      <div class="col-12 col-md-4"><s-input v-model="Supplier.form.tax_id" :label="tdc('Tax ID (NUIT)')" :error="!!Supplier.errors.tax_id" :error-message="Supplier.errors.tax_id" data-test="f-tax_id" /></div>
    </div>
    <div class="text-subtitle2 text-grey-7 q-mt-md q-mb-xs">{{ tdc('Contacts') }}</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4"><s-input v-model="Supplier.form.email" :label="tdc('Email')" :error="!!Supplier.errors.email" :error-message="Supplier.errors.email" data-test="f-email" type="email" /></div>
      <div class="col-12 col-md-4"><s-input v-model="Supplier.form.phone" :label="tdc('Phone')" :error="!!Supplier.errors.phone" :error-message="Supplier.errors.phone" data-test="f-phone" /></div>
      <div class="col-12 col-md-4"><s-input v-model="Supplier.form.payment_terms" :label="tdc('Payment terms (days)')" :error="!!Supplier.errors.payment_terms" :error-message="Supplier.errors.payment_terms" data-test="f-payment_terms" type="number" min="0" /></div>
      <div class="col-12"><s-input v-model="Supplier.form.address" :label="tdc('Address')" :error="!!Supplier.errors.address" :error-message="Supplier.errors.address" data-test="f-address" /></div>
      <div class="col-12"><s-input v-model="Supplier.form.notes" :label="tdc('Notes')" :error="!!Supplier.errors.notes" :error-message="Supplier.errors.notes" data-test="f-notes" type="textarea" autogrow /></div>
      <div class="col-12"><s-toggle v-model="Supplier.form.active" :label="tdc('Active')" data-test="f-active" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useSupplierStore } from './supplierStore'

const Supplier = useSupplierStore()
const { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save } = useRecordForm(Supplier, {
  model: 'Supplier',
  defaults: () => ({ supplier_type: 'company', active: true })
})

const typeOptions = [
  { label: tdc('Individual'), value: 'individual', icon: 'person' },
  { label: tdc('Company'), value: 'company', icon: 'business' },
]
const type = computed(() => valueOf(Supplier.form?.supplier_type))
// the field the other type has no use for is cleared
function setType (value) {
  Supplier.form.supplier_type = value
  if (value === 'individual') Supplier.form.company_name = null
  if (value === 'company') Supplier.form.person = null
  Supplier.errors = {}
}

onMounted(load)
</script>
