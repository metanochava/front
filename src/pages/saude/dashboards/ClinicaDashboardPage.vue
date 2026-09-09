<script setup>
// Dashboard dinâmico do motor genérico (django_resaas.engine.core.
// dashboards) - ao contrário dos outros dashboards em pages/saude/
// dashboards/ (hand-built), este é inteiramente desenhado a partir
// da config que saude/dashboard.py devolve: novos widgets/filtros
// aparecem aqui sem tocar nesta página.
</script>

<template>
  <s-dashboard-renderer name="saude" />
</template>
