<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Stock settings' : 'Stock settings')"
    icon="tune" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="inventorysetting-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12"><s-toggle v-model="Inventorysetting.form.allow_negative_stock" :label="tdc('Allow negative stock')" data-test="f-allow_negative_stock" /></div>
      <div class="col-12 text-caption text-grey-7">{{ tdc('An exit may leave a product below zero (it is counted later)') }}</div>
      <div class="col-12"><div class="text-subtitle2 text-grey-7 q-mb-xs">{{ tdc('Which lot leaves first') }}</div>
        <q-option-group v-model="Inventorysetting.form.allocation_strategy" :options="strategies" type="radio" data-test="f-allocation_strategy" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useInventorysettingStore } from './inventorysettingStore'

const Inventorysetting = useInventorysettingStore()
const { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save } = useRecordForm(Inventorysetting, {
  model: 'InventorySetting',
  defaults: () => ({ allocation_strategy: 'fefo', allow_negative_stock: false })
})

const strategies = [
  { value: 'fefo', label: tdc('FEFO - the lot that expires first') },
  { value: 'fifo', label: tdc('FIFO - the lot that came in first') },
]

onMounted(load)
</script>
