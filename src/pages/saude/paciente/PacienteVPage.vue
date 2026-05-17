<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Paciente.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>

    <Form
      :store="Paciente"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    >
    </Form>
  </q-page>
</template>


<script setup>
// import { onMounted, watch } from 'vue'
// import { useRoute } from 'vue-router'

import { usePacienteStore } from './pacienteStore'
// import { FormTwo } from 'quasar_resaas'
import { Form } from 'quasar_resaas'
import PacienteHeader from './PacienteHeaderPage.vue'

// const route = useRoute()

const Paciente = usePacienteStore()

// watch(() => route.params,
//   async () => {

//   },
//   { immediate: false } // init já trata o primeiro carregamento
// )


// // ---------------- LIFECYCLE ----------------
// onMounted({

// })
</script>































