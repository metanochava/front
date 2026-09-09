<template>
  <s-dashboard-home />
  <!-- <s-dashboard-renderer name="saude" /> -->
</template>

<script setup>
// Home automática: mostra os dashboards do motor genérico
// (django_resaas.engine.core.dashboards) já autorizados para a
// entity/utilizador actuais - "tipo de entidade" é resolvido no
// backend (EntityApp), nunca aqui. Sem nenhum dashboard.py activo
// para este tenant, cai automaticamente no mecanismo antigo
// (<s-dashboard/>) - ver components/dashboard/HomeDashboards.vue em
// quasar_resaas.
</script>
