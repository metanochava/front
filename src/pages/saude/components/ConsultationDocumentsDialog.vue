<template>
  <q-dialog :model-value="modelValue" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="tdc('Consultation documents')" icon="folder_open" width="640px" @close="close">
      <ConsultationDocumentsList :consulta-id="modelValue ? consultaId : null" />
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// The documents linked to a consultation, in a modal (Recent Consultations).
// The list itself (and its permissions) is ConsultationDocumentsList.
import { tdc } from 'quasar_resaas'

import ConsultationDocumentsList from './ConsultationDocumentsList.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  consultaId: { type: String, default: null },
})
const emit = defineEmits(['update:modelValue'])

const close = () => emit('update:modelValue', false)
</script>
