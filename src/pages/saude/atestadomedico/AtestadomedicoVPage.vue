<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Atestadomedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>

    <Form
      :store="Atestadomedico"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    >
    </Form>
  </q-page>
</template>


<script setup>
// import { onMounted, watch } from 'vue'
// import { useRoute } from 'vue-router'

import { useAtestadomedicoStore } from './atestadomedicoStore'
// import { FormTwo } from 'quasar_resaas'
import { Form } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// const route = useRoute()

const Atestadomedico = useAtestadomedicoStore()

// watch(() => route.params,
//   async () => {

//   },
//   { immediate: false } // init já trata o primeiro carregamento
// )


// // ---------------- LIFECYCLE ----------------
// onMounted({

// })
</script>































