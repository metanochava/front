<template>
  <q-item clickable dense class="exame-item" :class="{ selected }" @click="$emit('select', exame)">
    <q-item-section avatar>
      <q-icon :name="selected ? 'radio_button_checked' : 'radio_button_unchecked'" :color="selected ? 'primary' : 'grey'" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-medium">{{ label }}</q-item-label>
      <q-item-label v-if="exame.codigo || exame.amostra || exame.prazo_horas" caption>
        <span v-if="exame.codigo">Código: {{ exame.codigo }}</span>
        <span v-if="exame.amostra"> · Amostra: {{ exame.amostra }}</span>
        <span v-if="exame.prazo_horas"> · Prazo: {{ exame.prazo_horas }}h</span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <s-btn dense flat round size="sm" icon="add" color="primary" @click.stop="$emit('add', exame)" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ exame: { type: Object, required: true }, selected: Boolean })
defineEmits(['select', 'add'])
const label = computed(() => props.exame.codigo ? `${props.exame.codigo} - ${props.exame.nome}` : (props.exame.nome || props.exame.label || 'Exame'))
</script>

<style scoped>
.exame-item { border-radius: 8px; margin: 2px 0; }
.exame-item.selected { background: rgba(25, 118, 210, .10); }
</style>
