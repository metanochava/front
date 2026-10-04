<template>
  <!-- the same patient list as list_paciente, in a full-screen modal
       (reception queue: double click on "Patients") -->
  <q-dialog :model-value="modelValue" full-width full-height @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="tdc('Patients')" icon="groups" fullscreen @close="emit('update:modelValue', false)">
      <PacienteList v-if="modelValue" />
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// registered as the dashboard dialog "saude.patient_list" (dashboard/dashboard.js);
// the list keeps its own permissions (list_/add_/change_paciente, add_agenda)
import { tdc } from 'quasar_resaas'
import PacienteList from './PacienteList.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  context: { type: Object, default: null },
  action: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'saved'])
</script>
