<template>
  <q-dialog :model-value="modelValue" :maximized="$q.screen.lt.sm" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="`${tdc('Orders')} — ${table?.name || ''}`" icon="receipt" width="440px">
      <div v-if="!orders.length" class="text-center text-grey-6 q-pa-md">{{ tdc('No orders waiting') }}</div>
      <div v-for="o in orders" :key="o.id" class="order q-mb-md" data-test="table-order">
        <div class="row items-center text-caption text-grey-7 q-mb-xs">
          <q-icon name="schedule" size="14px" class="q-mr-xs" /> {{ time(o.created_at) }}
        </div>
        <div v-for="(l, i) in o.lines" :key="i" class="row no-wrap q-py-xs">
          <span class="text-weight-bold q-mr-sm">{{ l.quantidade }}×</span>
          <span class="col">{{ l.product_nome }}</span>
        </div>
        <div v-if="o.note" class="order__note"><q-icon name="sticky_note_2" size="14px" /> {{ o.note }}</div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-6">
            <s-btn flat rounded no-caps color="negative" class="full-width" icon="close" :label="tdc('Reject')"
                   :loading="busy === `r${o.id}`" :disable="!!busy" data-test="order-reject" @click="emit('reject', o)">
              <s-tooltip>{{ tdc('Refuse the order: nothing is charged') }}</s-tooltip>
            </s-btn>
          </div>
          <div class="col-6">
            <s-btn unelevated rounded no-caps color="positive" class="full-width" icon="done" :label="tdc('Accept')"
                   :loading="busy === `a${o.id}`" :disable="!!busy" data-test="order-accept" @click="emit('accept', o)">
              <s-tooltip>{{ tdc('Put the order on the table\'s tab') }}</s-tooltip>
            </s-btn>
          </div>
        </div>
      </div>
      <div v-if="error" class="text-negative text-caption">{{ error }}</div>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'

// A table's orders from the QR code, waiting for staff: accept puts them on
// the table's tab (at the catalog's price), reject charges nothing.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  table: { type: Object, default: null },
  busy: { type: String, default: null },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'accept', 'reject'])

const orders = computed(() => props.table?.orders || [])

function time (value) {
  return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.order { border: 1px solid rgba(128, 128, 128, 0.2); border-radius: 14px; padding: 10px 12px; }
.order__note { margin-top: 4px; font-size: 0.85rem; font-style: italic; opacity: 0.8; }
</style>
