<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />
    <div v-if="Clinicalsummary.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <s-form
      :store="Clinicalsummary"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
import { useClinicalsummaryStore } from './clinicalsummaryStore'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'

const Clinicalsummary = useClinicalsummaryStore()
</script>
