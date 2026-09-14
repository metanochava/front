<template>
  <q-page>
    <s-dashboard-home />

    <s-dashboard-renderer name="notifications" />
    <s-dashboard-renderer name="django_resaas" />
    <s-dashboard-renderer name="hr" />
    <s-dashboard-renderer name="saude" />
  </q-page>
</template>

<script setup>
// Home automática: <s-dashboard-home/> mostra o dashboard do motor
// genérico (django_resaas.engine.core.dashboards) já autorizado para
// a EntityType actual, com fallback automático para o mecanismo
// antigo (DashboardComponent) quando não existe nenhum - ver
// components/dashboard/HomeDashboards.vue em quasar_resaas.
//
// As três <s-dashboard-renderer> seguintes mostram sempre, lado a
// lado, os dashboards de notifications/django_resaas/hr (agora com
// <app>/dashboard.py real no motor novo - ver django_resaas commit
// que introduziu notifications/dashboard.py, hr/dashboard.py e
// saas/dashboard.py). 'saude' fica como estava: sem esse módulo
// activo para este tenant, mostra "Module 'saude' is not active." -
// comportamento correcto (módulo mesmo não activado), não um erro a
// corrigir aqui.

// import { getFirebase } from 'quasar_resaas'

// const { fireDataBase } = getFirebase()



// fireDataBase.ref('Clinica').once('value', snapshot => {
//   console.log(snapshot.val())
// })
</script>
