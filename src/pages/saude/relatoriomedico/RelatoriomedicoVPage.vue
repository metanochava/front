<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Relatoriomedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>

    <Form
      :store="Relatoriomedico"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    >
    </Form>
  </q-page>
</template>


<script setup>
// import { onMounted, watch } from 'vue'
// import { useRoute } from 'vue-router'

import { useRelatoriomedicoStore } from './relatoriomedicoStore'
// import { FormTwo } from 'quasar_resaas'
import { Form } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// const route = useRoute()

const Relatoriomedico = useRelatoriomedicoStore()

// watch(() => route.params,
//   async () => {

//   },
//   { immediate: false } // init já trata o primeiro carregamento
// )


// // ---------------- LIFECYCLE ----------------
// onMounted({

// })
</script>

