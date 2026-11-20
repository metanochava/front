<template>
  <q-dialog :model-value="modelValue" persistent :maximized="$q.screen.lt.sm" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="tdc('Payment')" icon="payments" width="420px" :closable="false">
      <div class="text-center q-py-sm">
        <div class="text-caption text-grey-7">{{ tdc('Amount Due') }}</div>
        <div class="text-h4 text-weight-bold" data-test="payment-due">{{ money(due) }}</div>
        <div class="text-caption text-grey-7">
          {{ tdc('Total') }} <span data-test="payment-total">{{ money(total) }}</span>
          <template v-if="paid > 0"> · {{ tdc('Already Paid') }} {{ money(paid) }}</template>
        </div>
      </div>

      <q-list v-if="done.length" dense class="q-mb-sm">
        <q-item v-for="(p, i) in done" :key="i" class="q-px-none">
          <q-item-section avatar><q-icon name="check_circle" color="positive" /></q-item-section>
          <q-item-section>{{ methodLabel(p.forma_pagamento) }}</q-item-section>
          <q-item-section side>{{ money(p.valor) }}</q-item-section>
        </q-item>
      </q-list>

      <!-- methods as big buttons (touch) -->
      <div class="pos-methods q-mb-md">
        <s-btn
          v-for="m in methods" :key="m.value"
          no-caps unelevated rounded
          :color="form.forma_pagamento === m.value ? 'primary' : undefined"
          :outline="form.forma_pagamento !== m.value"
          :label="m.label"
          data-test="payment-method"
          @click="form.forma_pagamento = m.value"
        >
          <s-tooltip>{{ tdc('Pay with') }} {{ m.label }}</s-tooltip>
        </s-btn>
      </div>

      <div class="q-gutter-sm">
        <s-input v-model.number="form.valor" type="number" step="0.01" :label="tdc('Amount to Register')" data-test="payment-amount" />
        <template v-if="isCash">
          <s-input v-model.number="form.recebido" type="number" step="0.01" :label="tdc('Amount Received from Customer')" data-test="payment-received" />
          <div class="row justify-between text-h6">
            <span>{{ tdc('Change') }}</span>
            <span :class="change < 0 ? 'text-negative' : 'text-positive'" data-test="payment-change">{{ money(change) }}</span>
          </div>
        </template>
        <s-input v-else v-model="form.referencia" :label="tdc('Reference') + ' (' + tdc('optional') + ')'" />
        <div v-if="error" class="text-negative text-caption">{{ error }}</div>
      </div>

      <template #footer>
        <s-btn flat :label="tdc('Cancel Sale')" :disable="paying" data-test="payment-cancel" @click="emit('void')">
          <s-tooltip>{{ tdc('Void this sale') }}</s-tooltip>
        </s-btn>
        <s-btn
          unelevated color="positive"
          :label="isLast ? tdc('Finish') : tdc('Register and Continue')"
          :loading="paying"
          :disable="!form.forma_pagamento || Number(form.valor) <= 0 || (isCash && change < 0)"
          data-test="payment-confirm"
          @click="confirm"
        >
          <s-tooltip>{{ tdc('Register this payment') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { tdc, errorMessage } from 'quasar_resaas'
import { useSaleStore } from '../saleStore'

// Pays a confirmed sale, split between methods (the backend's); only cash has
// change. Emits "paid" with the receipt once the sale is paid.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  saleId: { type: String, default: null },
  total: { type: Number, default: 0 },          // the server's total
  methods: { type: Array, default: () => [] },  // [{value, label}]
})
const emit = defineEmits(['update:modelValue', 'paid', 'void'])

const Sale = useSaleStore()
const done = ref([])
const paying = ref(false)
const error = ref('')
const form = reactive({ forma_pagamento: null, valor: 0, recebido: 0, referencia: '' })

const paid = computed(() => done.value.reduce((s, p) => s + Number(p.valor || 0), 0))
const due = computed(() => Math.max(props.total - paid.value, 0))
const isCash = computed(() => form.forma_pagamento === 'numerario')
const isLast = computed(() => Number(form.valor || 0) >= due.value - 0.001)
const change = computed(() => Number(form.recebido || 0) - Number(form.valor || 0))

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function methodLabel (value) {
  return props.methods.find(m => m.value === value)?.label || value
}

function resetForm () {
  form.forma_pagamento = props.methods.some(m => m.value === 'numerario') ? 'numerario' : props.methods[0]?.value || null
  form.valor = Number(due.value.toFixed(2))
  form.recebido = form.valor
  form.referencia = ''
}

watch(() => [props.modelValue, props.saleId], ([open]) => {
  if (!open) return
  done.value = []
  error.value = ''
  resetForm()
}, { immediate: true })

async function confirm () {
  error.value = ''
  paying.value = true
  const valor = Math.min(Number(form.valor || 0), due.value)
  try {
    const result = await Sale.pagar(props.saleId, {
      valor,
      forma_pagamento: form.forma_pagamento,
      referencia: form.referencia || null,
    })
    done.value.push({
      forma_pagamento: form.forma_pagamento,
      valor,
      recebido: isCash.value ? Number(form.recebido) : valor,
      troco: isCash.value ? change.value : 0,
    })
    const estado = result.sale?.estado?.value || result.sale?.estado
    if (estado === 'paga') {
      emit('paid', {
        saleId: props.saleId,
        total: Number(result.sale?.total ?? props.total),
        pagamentos: done.value,
        totalRecebido: done.value.reduce((s, p) => s + Number(p.recebido || 0), 0),
        totalTroco: done.value.reduce((s, p) => s + Number(p.troco || 0), 0),
      })
    } else {
      resetForm()
    }
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    paying.value = false
  }
}
</script>

<style scoped>
.pos-methods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}
</style>
