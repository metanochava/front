<template>
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit product category' : 'New product category')"
    icon="category" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="productcategory-form"
    @save="save" @cancel="back"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12"><s-input v-model="Productcategory.form.nome" :label="tdc('Name')" :error="!!Productcategory.errors.nome" :error-message="Productcategory.errors.nome" data-test="f-nome" /></div>
      <div class="col-12"><s-input v-model="Productcategory.form.descricao" :label="tdc('Description')" :error="!!Productcategory.errors.descricao" :error-message="Productcategory.errors.descricao" data-test="f-descricao" type="textarea" autogrow /></div>
      <div class="col-12"><s-toggle v-model="Productcategory.form.ativo" :label="tdc('Active')" data-test="f-ativo" /></div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useProductcategoryStore } from './productcategoryStore'

const Productcategory = useProductcategoryStore()
const { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save } = useRecordForm(Productcategory, {
  model: 'ProductCategory',
  defaults: () => ({ ativo: true })
})

onMounted(load)
</script>
