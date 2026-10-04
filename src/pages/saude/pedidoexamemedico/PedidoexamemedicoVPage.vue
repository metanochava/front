<template>
  <q-page class="q-pa-sm">
    <!-- the request's patient (patient_id: its own or its consultation's) -
         the route :id is the request, not the patient -->
    <PacienteHeader v-if="patientId" :patient-id="patientId" />
    <!-- FORM -->
    <div v-if="Pedidoexamemedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <s-form
      :store="Pedidoexamemedico"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    >
    </s-form>
  </q-page>
</template>


<script setup>
import { computed } from 'vue'
// import { useRoute } from 'vue-router'

import { usePedidoexamemedicoStore } from './pedidoexamemedicoStore'
// import { FormTwo } from 'quasar_resaas'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

// const route = useRoute()

const Pedidoexamemedico = usePedidoexamemedicoStore()

const patientId = computed(() => Pedidoexamemedico.row?.patient_id || Pedidoexamemedico.form?.patient_id || null)

// watch(() => route.params,
//   async () => {

//   },
//   { immediate: false } // init já trata o primeiro carregamento
// )


// // ---------------- LIFECYCLE ----------------
// onMounted({

// })
</script>































