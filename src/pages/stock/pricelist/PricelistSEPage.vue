<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit price list' : 'New price list')"
    icon="request_quote" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="pricelist-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8"><s-input v-model="Pricelist.form.name" :label="tdc('Name')" :error="!!Pricelist.errors.name" :error-message="Pricelist.errors.name" data-test="f-name" /></div>
      <div class="col-12 col-md-4"><s-input v-model="Pricelist.form.code" :label="tdc('Code')" :error="!!Pricelist.errors.code" :error-message="Pricelist.errors.code" data-test="f-code" /></div>
    </div>
    <div class="text-subtitle2 text-grey-7 q-mt-md q-mb-xs">{{ tdc('Validity') }}</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6"><s-date v-model="Pricelist.form.valid_from" :label="tdc('From')" :error="!!Pricelist.errors.valid_from" :error-message="Pricelist.errors.valid_from" data-test="f-valid_from" /></div>
      <div class="col-12 col-sm-6"><s-date v-model="Pricelist.form.valid_to" :label="tdc('Until')" :error="!!Pricelist.errors.valid_to" :error-message="Pricelist.errors.valid_to" data-test="f-valid_to" /></div>
      <div class="col-12 text-caption text-grey-7">{{ tdc('Leave both empty for a list that is always valid') }}</div>
      <div class="col-12"><s-toggle v-model="Pricelist.form.active" :label="tdc('Active')" data-test="f-active" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { usePricelistStore } from './pricelistStore'

const Pricelist = usePricelistStore()
const { ready, saving, generalError, isEdit, canSave, load, back, save } = useRecordForm(Pricelist, {
  model: 'PriceList',
  defaults: () => ({ active: true })
})

onMounted(load)
</script>
