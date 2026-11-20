<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit warehouse' : 'New warehouse')"
    icon="warehouse" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="warehouse-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8"><s-input v-model="Warehouse.form.nome" :label="tdc('Name')" :error="!!Warehouse.errors.nome" :error-message="Warehouse.errors.nome" data-test="f-nome" /></div>
      <div class="col-12 col-md-4"><s-input v-model="Warehouse.form.codigo" :label="tdc('Code')" :error="!!Warehouse.errors.codigo" :error-message="Warehouse.errors.codigo" data-test="f-codigo" /></div>
      <div class="col-12"><s-input v-model="Warehouse.form.endereco" :label="tdc('Address')" :error="!!Warehouse.errors.endereco" :error-message="Warehouse.errors.endereco" data-test="f-endereco" /></div>
      <div class="col-12"><s-toggle v-model="Warehouse.form.ativo" :label="tdc('Active')" data-test="f-ativo" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useWarehouseStore } from './warehouseStore'

const Warehouse = useWarehouseStore()
const { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save } = useRecordForm(Warehouse, {
  model: 'Warehouse',
  defaults: () => ({ ativo: true })
})

onMounted(load)
</script>
