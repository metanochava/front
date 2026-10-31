<template>
  <q-dialog persistent v-model="open">
    <s-modal-card :title="tdc('Lab evolution')" icon="show_chart" width="860px" data-test="lab-evolution-dialog" @close="open = false">
      <!-- the same panel as the results page's Data view (LabEvolutionPanel) -->
      <LabEvolutionPanel :paciente-id="pacienteId" :active="open" />
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// Evolution of one structured lab parameter of a patient, in a dialog.
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'
import LabEvolutionPanel from './LabEvolutionPanel.vue'

const props = defineProps({
  modelValue: Boolean,
  pacienteId: { type: [String, Number], default: null }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
</script>
