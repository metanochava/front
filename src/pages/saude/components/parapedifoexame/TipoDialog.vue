<template>
  <q-dialog v-model="model" persistent>
    <s-card class="q-pa-md dialog-card">
      <div class="text-h6 q-mb-md">Novo Tipo de Exame</div>
      <s-input v-model="form.nome" label="Nome" class="q-mb-sm" />
      <s-editor v-model="form.descricao" label="Descrição" min-height="100px" class="q-mb-sm" />
      <s-input v-model="form.ordem" label="Ordem" type="number" class="q-mb-sm" />
      <s-switch v-model="form.ativo" label="Activo" />
      <div class="row justify-end q-gutter-sm q-mt-md">
        <s-btn flat color="grey" label="Cancelar" @click="model = false" />
        <s-btn color="primary" icon="save" label="Guardar" :loading="loading" :disable="!form.nome" @click="$emit('save', { ...form })" />
      </div>
    </s-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
const props = defineProps({ modelValue: Boolean, loading: Boolean })
const emit = defineEmits(['update:modelValue', 'save'])
const form = ref({ nome: '', descricao: '', ordem: 0, ativo: true })
const model = computed({ get: () => props.modelValue, set: v => emit('update:modelValue', v) })
watch(model, v => { if (v) form.value = { nome: '', descricao: '', ordem: 0, ativo: true } })
</script>

<style scoped>
.dialog-card { width: 520px; max-width: 95vw; }
</style>
