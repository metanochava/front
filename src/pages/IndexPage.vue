<template>
  <q-page>
    <s-dashboard-home />
  </q-page>
</template>

<script setup>
// Home automática: mostra o dashboard do motor genérico
// (django_resaas.engine.core.dashboards) já autorizado para a
// entity/utilizador actuais - "tipo de entidade" é resolvido no
// backend (EntityApp), nunca aqui. Sem nenhum dashboard.py activo
// para este tenant, cai automaticamente no mecanismo antigo
// (DashboardComponent) - ver components/dashboard/HomeDashboards.vue
// em quasar_resaas.

// import { getFirebase } from 'quasar_resaas'

// const { fireDataBase } = getFirebase()



// fireDataBase.ref('Clinica').once('value', snapshot => {
//   console.log(snapshot.val())
// })
</script>
