<template>
  <q-card flat bordered class="exame-card q-mb-sm">
    <q-card-section class="q-pa-sm">
      <div class="row items-start no-wrap">
        <div class="col">
          <div class="text-subtitle2 text-weight-bold">{{ item.exame_label || 'Exame' }}</div>
          <div class="text-caption text-grey-7">{{ item.tipo_label || '-' }} / {{ item.classe_label || '-' }}</div>
          <q-chip dense size="sm" class="q-mt-xs" :color="priorityColor" text-color="white">
            {{ item.prioridade_label || item.prioridade || 'Normal' }}
          </q-chip>
        </div>
        <div class="col-auto">
          <s-btn dense flat round color="negative" icon="delete" @click="$emit('remove')" />
        </div>
      </div>
      <div v-if="item.instrucoes" class="q-mt-sm text-caption"><b>Instruções:</b> <span v-html="item.instrucoes"></span></div>
      <div v-if="item.observacao" class="q-mt-xs text-caption"><b>Observação:</b> <span v-html="item.observacao"></span></div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ item: { type: Object, required: true } })
defineEmits(['remove'])
const priorityColor = computed(() => props.item.prioridade === 'muito_urgente' ? 'red-8' : props.item.prioridade === 'urgente' ? 'orange-8' : 'primary')
</script>

<style scoped>
.exame-card { border-radius: 12px; }
</style>
