<template>
  <q-card flat bordered class="pedido-resumo q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col"><div class="text-caption text-grey-7">{{ tdc('Total') }}</div><div class="text-h6 text-weight-bold">{{ total }}</div></div>
      <div class="col"><div class="text-caption text-grey-7">{{ tdc('Urgent') }}</div><div class="text-h6 text-weight-bold text-negative">{{ urgentes }}</div></div>
    </div>
  </q-card>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { computed } from 'vue'
const props = defineProps({ items: { type: Array, default: () => [] } })
const total = computed(() => props.items.length)
const urgentes = computed(() => props.items.filter(i => i.prioridade === 'urgente').length)
</script>

<style scoped>
.pedido-resumo { border-radius: 12px; }
</style>
