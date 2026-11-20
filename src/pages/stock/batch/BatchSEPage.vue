<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit lot' : 'New lot')"
    icon="inventory_2" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="batch-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8"><s-select v-model="Batch.form.product" :api="productsUrl" option-label="label" option-value="value" emit-value map-options
          :label="tdc('Product')" :hint="tdc('Only the products that track lots')" :error="!!Batch.errors.product" :error-message="Batch.errors.product" data-test="f-product" /></div>
      <div class="col-12 col-md-4"><s-input v-model="Batch.form.lot_number" :label="tdc('Lot number')" :error="!!Batch.errors.lot_number" :error-message="Batch.errors.lot_number" data-test="f-lot_number" /></div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6"><s-date v-model="Batch.form.manufacture_date" :label="tdc('Manufactured on')" :error="!!Batch.errors.manufacture_date" :error-message="Batch.errors.manufacture_date" data-test="f-manufacture_date" /></div>
      <div class="col-12 col-sm-6"><s-date v-model="Batch.form.expiry_date" :label="tdc('Expires on')" :error="!!Batch.errors.expiry_date" :error-message="Batch.errors.expiry_date" data-test="f-expiry_date" /></div>
      <div class="col-12"><s-input v-model="Batch.form.notes" :label="tdc('Notes')" :error="!!Batch.errors.notes" :error-message="Batch.errors.notes" data-test="f-notes" type="textarea" autogrow /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc, url } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useBatchStore } from './batchStore'

const Batch = useBatchStore()
const { ready, saving, generalError, isEdit, canSave, load, back, save } = useRecordForm(Batch, {
  model: 'Batch',
  defaults: () => ({})
})

// a lot only for a product that tracks lots (inventory refuses the others)
const productsUrl = url({ type: 'u', url: 'catalog/products', params: { select: 'true', track_batches: 'true' } })

onMounted(load)
</script>
