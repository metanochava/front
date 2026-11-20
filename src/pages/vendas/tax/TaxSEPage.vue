<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit tax' : 'New tax')"
    icon="percent" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="tax-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6"><s-input v-model="Tax.form.name" :label="tdc('Name')" :error="!!Tax.errors.name" :error-message="Tax.errors.name" data-test="f-name" /></div>
      <div class="col-12 col-sm-6 col-md-3"><s-input v-model="Tax.form.code" :label="tdc('Code')" :error="!!Tax.errors.code" :error-message="Tax.errors.code" data-test="f-code" /></div>
      <div class="col-12 col-sm-6 col-md-3"><s-input v-model="Tax.form.rate" :label="tdc('Rate (%)')" :error="!!Tax.errors.rate" :error-message="Tax.errors.rate" data-test="f-rate" type="number" min="0" max="100" step="0.01" /></div>
      <div class="col-12"><s-toggle v-model="Tax.form.active" :label="tdc('Active')" data-test="f-active" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useTaxStore } from './taxStore'

const Tax = useTaxStore()
const { ready, saving, generalError, isEdit, canSave, load, back, save } = useRecordForm(Tax, {
  model: 'Tax',
  defaults: () => ({ active: true })
})

onMounted(load)
</script>
