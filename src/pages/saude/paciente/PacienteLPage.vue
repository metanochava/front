
<template>
  <q-page class="q-pa-sm">
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
      @saved="onAgendaSaved"
    />

    <!-- <s-auto-crud
      app="saude" model="Paciente"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :extraActions="[
        {'action':'Marcar Consulta', 'permission':'add_agenda', 'icon':'event', 'method': 'get', 'position': 'l', 'tooltip':'Marcar Consulta', 'visible': true, details:true},
      ]"
      @runaction="onRunAction"
    /> -->

  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AgendaConsultaDialog from './../components/AgendaConsultaDialog.vue'

const showAgendaDialog = ref(false)
const agendaPacienteId = ref(null)
const agendaPacienteLabel = ref(null)

function onRunAction(obj, row) {
  if (obj.action === 'Marcar Consulta') {
    agendaPacienteId.value = row.id
    agendaPacienteLabel.value = row.label
    showAgendaDialog.value = true
  }
}

function onAgendaSaved() {
  // o próprio HTTPAuth já mostra o alerta de sucesso da resposta —
  // aqui só ficaria lógica extra se algum dia for preciso (ex.:
  // refrescar uma lista de agendamentos visível nesta página).
}

onMounted(async () => {

})
</script>
