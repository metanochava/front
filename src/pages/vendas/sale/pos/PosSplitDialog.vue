<template>
  <q-dialog :model-value="modelValue" :maximized="$q.screen.lt.sm" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="tdc('Split the tab')" icon="call_split" width="460px">
      <div class="text-caption text-grey-7 q-mb-sm">
        {{ tdc('Choose what goes to the new tab - it is paid apart.') }}
      </div>

      <div v-for="line in lines" :key="line.id" class="row items-center no-wrap q-py-sm split-line" data-test="split-line">
        <div class="col">
          <div class="text-weight-medium">{{ line.product_nome }}</div>
          <div class="text-caption text-grey-7">{{ qty(line.quantidade) }} × {{ money(line.preco_unitario) }}</div>
        </div>
        <div class="pos-stepper row items-center no-wrap">
          <s-btn flat round dense size="sm" icon="remove" :disable="!picked[line.id]" @click="step(line, -1)">
            <s-tooltip>{{ tdc('Decrease quantity') }}</s-tooltip>
          </s-btn>
          <span class="pos-stepper__qty" data-test="split-qty">{{ qty(picked[line.id] || 0) }}</span>
          <s-btn flat round dense size="sm" icon="add" :disable="(picked[line.id] || 0) >= Number(line.quantidade)" data-test="split-inc" @click="step(line, 1)">
            <s-tooltip>{{ tdc('Increase quantity') }}</s-tooltip>
          </s-btn>
        </div>
      </div>

      <s-input v-model="label" class="q-mt-md" maxlength="60" :label="tdc('New tab name') + ' (' + tdc('optional') + ')'" />

      <div class="row justify-between text-subtitle1 text-weight-bold q-mt-md">
        <span>{{ tdc('New tab') }}</span>
        <span data-test="split-total">{{ money(total) }}</span>
      </div>
      <div v-if="error" class="text-negative text-caption">{{ error }}</div>

      <template #footer>
        <s-btn flat :label="tdc('Cancel')" @click="emit('update:modelValue', false)">
          <s-tooltip>{{ tdc('Close without splitting') }}</s-tooltip>
        </s-btn>
        <s-btn unelevated color="primary" icon="call_split" :label="tdc('Split')" :loading="saving"
               :disable="!chosen.length" data-test="split-submit" @click="submit">
          <s-tooltip>{{ tdc('Move these items to a new tab') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { tdc } from 'quasar_resaas'

// "Each pays what they had": picks units of the tab's lines to move to a new
// tab (Sale.splitTab), which is then paid on its own.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  lines: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const picked = reactive({})
const label = ref('')

watch(() => props.modelValue, (open) => {
  if (!open) return
  Object.keys(picked).forEach(k => delete picked[k])
  label.value = ''
})

const chosen = computed(() => props.lines
  .filter(l => (picked[l.id] || 0) > 0)
  .map(l => ({ item: l.id, quantidade: picked[l.id] })))

const total = computed(() => props.lines.reduce((s, l) => s + (picked[l.id] || 0) * Number(l.preco_unitario || 0), 0))

function step (line, delta) {
  const next = Math.min(Math.max((picked[line.id] || 0) + delta, 0), Number(line.quantidade))
  picked[line.id] = next
}

function qty (v) {
  const n = Number(v) || 0
  return Number.isInteger(n) ? n : n.toFixed(3).replace(/0+$/, '')
}

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function submit () {
  emit('submit', { items: chosen.value, tab_label: label.value.trim() || null })
}
</script>

<style scoped>
.split-line { border-bottom: 1px solid rgba(128, 128, 128, 0.15); }
.pos-stepper { border: 1px solid rgba(128, 128, 128, 0.25); border-radius: 999px; padding: 0 2px; }
.pos-stepper__qty { min-width: 32px; text-align: center; font-weight: 700; }
</style>
