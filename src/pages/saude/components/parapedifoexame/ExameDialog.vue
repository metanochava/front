<template>
  <q-dialog v-model="model" persistent>
    <s-modal-card :title="tdc('New medical exam')" width="460px">
      <s-select v-model="form.classe_exame_medico" :label="tdc('Exam class')" :options="classeOptions" emit-value map-options class="q-mb-sm" />
      <div class="row q-col-gutter-sm">
        <div class="col-md-4 col-xs-12"><s-input v-model="form.codigo" :label="tdc('Code')" /></div>
        <div class="col-md-8 col-xs-12"><s-input v-model="form.nome" :label="tdc('Name')" /></div>
      </div>
      <s-editor v-model="form.descricao" :label="tdc('Description')" min-height="90px" class="q-mt-sm" />
      <s-editor v-model="form.preparacao" :label="tdc('Preparation')" min-height="90px" class="q-mt-sm" />
      <div class="row q-col-gutter-sm q-mt-sm">
        <div class="col-md-4 col-xs-12"><s-input v-model="form.amostra" :label="tdc('Sample')" /></div>
        <div class="col-md-4 col-xs-12"><s-input v-model="form.prazo_horas" :label="tdc('Deadline (hours)')" type="number" /></div>
        <div class="col-md-4 col-xs-12 flex items-center"><s-switch v-model="form.ativo" :label="tdc('Active')" /></div>
      </div>
      <s-input v-model="form.valor_referencia" :label="tdc('Reference value')" class="q-mt-sm" />

      <template #footer>
        <s-btn flat color="grey" :label="tdc('Cancel')" @click="model = false" />
                <s-btn color="primary" icon="save" :label="tdc('Save')" :loading="loading" :disable="!form.nome || !form.classe_exame_medico" @click="$emit('save', { ...form })" />

      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { computed, watch, ref } from 'vue'
const props = defineProps({ modelValue: Boolean, loading: Boolean, classeId: [String, Number], classeOptions: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue', 'save'])
const form = ref({ classe_exame_medico: null, codigo: '', nome: '', descricao: '', preparacao: '', amostra: '', prazo_horas: null, valor_referencia: '', ativo: true })
const model = computed({ get: () => props.modelValue, set: v => emit('update:modelValue', v) })
watch(model, v => { if (v) form.value = { classe_exame_medico: props.classeId || null, codigo: '', nome: '', descricao: '', preparacao: '', amostra: '', prazo_horas: null, valor_referencia: '', ativo: true } })
</script>

<style scoped>
.dialog-card { width: 760px; max-width: 95vw; }
</style>
