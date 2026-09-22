<template>
  <q-dialog v-model="model" persistent>
    <s-modal-card :title="tdc('New exam type')" width="460px">
      <s-input v-model="form.nome" :label="tdc('Name')" class="q-mb-sm" />
      <s-editor v-model="form.descricao" :label="tdc('Description')" min-height="100px" class="q-mb-sm" />
      <s-input v-model="form.ordem" :label="tdc('Order')" type="number" class="q-mb-sm" />
      <s-switch v-model="form.ativo" :label="tdc('Active')" />

      <template #footer>
        <s-btn flat color="grey" :label="tdc('Cancel')" @click="model = false" />
                <s-btn color="primary" icon="save" :label="tdc('Save')" :loading="loading" :disable="!form.nome" @click="$emit('save', { ...form })" />

      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
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
