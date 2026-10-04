<template>
  <q-page class="q-pa-sm">
    <PacienteList />
  </q-page>
</template>

<script setup>
// list_paciente: the patient list (components/PacienteList.vue, also shown in
// a dialog from the reception queue - PatientListDialog.vue)
import PacienteList from './../components/PacienteList.vue'
</script>
