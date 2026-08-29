<template>
  <q-dialog v-model="model" persistent>
    <s-card class="q-pa-md dialog-card">
      <div class="text-h6 q-mb-md">Novo Exame Médico</div>
      <s-select v-model="form.classe_exame_medico" label="Classe de Exame" :options="classeOptions" emit-value map-options class="q-mb-sm" />
      <div class="row q-col-gutter-sm">
        <div class="col-md-4 col-xs-12"><s-input v-model="form.codigo" label="Código" /></div>
        <div class="col-md-8 col-xs-12"><s-input v-model="form.nome" label="Nome" /></div>
      </div>
      <s-editor v-model="form.descricao" label="Descrição" min-height="90px" class="q-mt-sm" />
      <s-editor v-model="form.preparacao" label="Preparação" min-height="90px" class="q-mt-sm" />
      <div class="row q-col-gutter-sm q-mt-sm">
        <div class="col-md-4 col-xs-12"><s-input v-model="form.amostra" label="Amostra" /></div>
        <div class="col-md-4 col-xs-12"><s-input v-model="form.prazo_horas" label="Prazo em Horas" type="number" /></div>
        <div class="col-md-4 col-xs-12 flex items-center"><s-switch v-model="form.ativo" label="Activo" /></div>
      </div>
      <s-input v-model="form.valor_referencia" label="Valor de Referência" class="q-mt-sm" />
      <div class="row justify-end q-gutter-sm q-mt-md">
        <s-btn flat color="grey" label="Cancelar" @click="model = false" />
        <s-btn color="primary" icon="save" label="Guardar" :loading="loading" :disable="!form.nome || !form.classe_exame_medico" @click="$emit('save', { ...form })" />
      </div>
    </s-card>
  </q-dialog>
</template>

<script setup>
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
