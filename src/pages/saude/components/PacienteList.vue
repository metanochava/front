<template>
  <!-- the patient list (AutoCrud) with "Book appointment" - shared by the
       list_paciente page and the dashboard's patient list dialog -->
  <div data-test="paciente-list">
    <s-auto-crud
      app="saude" model="Paciente"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :extraActions="[
        {'action':'Marcar Consulta', 'permission':'add_agenda', 'icon':'event', 'method': 'get', 'position': 'l', 'tooltip':'Marcar Consulta', 'visible': true, details:true},
      ]"
      @runaction="onRunAction"
    />

    <agenda-consulta-dialog
      v-model="showAgendaDialog"
      :paciente-id="agendaPacienteId"
      :paciente-label="agendaPacienteLabel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AgendaConsultaDialog from './AgendaConsultaDialog.vue'

const showAgendaDialog = ref(false)
const agendaPacienteId = ref(null)
const agendaPacienteLabel = ref(null)

function onRunAction (obj, row) {
  if (obj.action === 'Marcar Consulta') {
    agendaPacienteId.value = row.id
    agendaPacienteLabel.value = row.label
    showAgendaDialog.value = true
  }
}
</script>
