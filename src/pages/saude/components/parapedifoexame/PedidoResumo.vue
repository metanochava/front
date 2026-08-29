<template>
  <q-card flat bordered class="pedido-resumo q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col"><div class="text-caption text-grey-7">Total</div><div class="text-h6 text-weight-bold">{{ total }}</div></div>
      <div class="col"><div class="text-caption text-grey-7">Urgentes</div><div class="text-h6 text-weight-bold text-orange-8">{{ urgentes }}</div></div>
      <div class="col"><div class="text-caption text-grey-7">Muito urgentes</div><div class="text-h6 text-weight-bold text-red-8">{{ muitoUrgentes }}</div></div>
    </div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ items: { type: Array, default: () => [] } })
const total = computed(() => props.items.length)
const urgentes = computed(() => props.items.filter(i => i.prioridade === 'urgente').length)
const muitoUrgentes = computed(() => props.items.filter(i => i.prioridade === 'muito_urgente').length)
</script>

<style scoped>
.pedido-resumo { border-radius: 12px; }
</style>
