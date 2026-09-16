<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <!-- FORM -->
    <div v-if="Receitamedica.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <Form
      :store="Receitamedica"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    >
    </Form>
  </q-page>
</template>


<script setup>
// import { onMounted, watch } from 'vue'
// import { useRoute } from 'vue-router'

import { useReceitamedicaStore } from './receitamedicaStore'
// import { FormTwo } from 'quasar_resaas'
import { Form } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// const route = useRoute()

const Receitamedica = useReceitamedicaStore()

// watch(() => route.params,
//   async () => {

//   },
//   { immediate: false } // init já trata o primeiro carregamento
// )


// // ---------------- LIFECYCLE ----------------
// onMounted({

// })
</script>































