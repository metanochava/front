<template>
  <div class="pos-cart column no-wrap">

    <!-- header -->
    <div class="row items-center no-wrap q-mb-sm">
      <q-icon :name="mode === 'tab' ? 'table_bar' : 'bolt'" size="22px" color="primary" class="q-mr-sm" />
      <div class="col ellipsis">
        <div class="text-subtitle1 text-weight-bold ellipsis" data-test="pos-cart-title">{{ title }}</div>
        <div v-if="subtitle" class="text-caption text-grey-7 ellipsis">{{ subtitle }}</div>
      </div>
      <q-spinner v-if="busy" size="18px" color="primary" class="q-ml-sm" />
    </div>

    <slot name="settings" />

    <!-- lines -->
    <div class="col pos-cart__lines">
      <div v-if="!lines.length" class="pos-cart__empty text-grey-6">
        <q-icon name="shopping_basket" size="36px" /><br>
        {{ mode === 'tab' ? tdc('Nothing ordered yet - tap a product') : tdc('Empty cart - scan a barcode to start') }}
      </div>

      <div
        v-for="line in lines" :key="line.key"
        class="pos-line"
        data-test="cart-line"
      >
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="pos-line__name">{{ line.product_nome }}</div>
            <div class="text-caption" :class="line.priceError ? 'text-negative' : 'text-grey-7'">
              <q-spinner v-if="line.quoting" size="12px" />
              <span v-else-if="line.priceError">{{ tdc('Price unavailable') }}</span>
              <span v-else data-test="cart-line-price">{{ money(line.preco_unitario) }}</span>
              <span v-if="Number(line.desconto_valor) > 0" class="text-positive"> · −{{ money(line.desconto_valor) }}</span>
            </div>
          </div>
          <div class="pos-line__subtotal">{{ money(subtotalOf(line)) }}</div>
        </div>

        <div class="row items-center no-wrap q-mt-xs">
          <div class="pos-stepper row items-center no-wrap">
            <s-btn flat round dense size="sm" icon="remove" :disable="busy" data-test="cart-line-dec" @click="emit('dec', line)">
              <s-tooltip>{{ tdc('Decrease quantity') }}</s-tooltip>
            </s-btn>
            <span class="pos-stepper__qty" data-test="cart-line-qty">{{ qty(line.quantidade) }}</span>
            <s-btn flat round dense size="sm" icon="add" :disable="busy" data-test="cart-line-inc" @click="emit('inc', line)">
              <s-tooltip>{{ tdc('Increase quantity') }}</s-tooltip>
            </s-btn>
          </div>

          <!-- a discount only with discount_sale (the backend decides) -->
          <s-input
            v-if="canDiscount"
            :model-value="line.desconto_valor"
            type="number" dense outlined
            class="pos-line__discount q-ml-sm"
            :placeholder="tdc('Disc.')"
            step="0.01" min="0"
            debounce="600"
            :disable="busy"
            data-test="cart-line-discount"
            @update:model-value="v => emit('discount', line, v)"
          />

          <q-space />
          <s-btn flat round dense size="sm" icon="delete_outline" color="negative" :disable="busy" data-test="cart-line-remove" @click="emit('remove', line)">
            <s-tooltip>{{ tdc('Remove from the cart') }}</s-tooltip>
          </s-btn>
        </div>
      </div>
    </div>

    <!-- totals and actions -->
    <div class="pos-cart__footer">
      <div class="row justify-between text-caption text-grey-7">
        <span>{{ tdc('Subtotal') }}</span><span>{{ money(totals.subtotal) }}</span>
      </div>
      <div v-if="totals.desconto" class="row justify-between text-caption text-grey-7">
        <span>{{ tdc('Discount') }}</span><span>−{{ money(totals.desconto) }}</span>
      </div>
      <div v-if="totals.tax" class="row justify-between text-caption text-grey-7">
        <span>{{ tdc('Tax') }}</span><span>{{ money(totals.tax) }}</span>
      </div>
      <div class="row justify-between items-baseline q-mt-xs">
        <span class="text-subtitle1 text-weight-medium">{{ tdc('Total') }}</span>
        <span class="text-h5 text-weight-bold" data-test="pos-total">{{ money(totals.total) }}</span>
      </div>

      <div v-if="error" class="text-negative text-caption q-mt-xs" data-test="pos-error">{{ error }}</div>

      <s-btn
        unelevated rounded color="positive" size="lg" class="full-width q-mt-sm"
        icon="point_of_sale"
        :label="mode === 'tab' ? tdc('Close and pay') : tdc('Finish Sale')"
        :disable="!canFinish"
        :loading="finishing"
        data-test="pos-finish"
        @click="emit('finish')"
      >
        <s-tooltip>{{ tdc('Confirm the sale and take the payment') }}</s-tooltip>
      </s-btn>

      <div class="row q-col-gutter-sm q-mt-xs">
        <div v-if="mode === 'tab'" class="col-6">
          <s-btn flat rounded no-caps class="full-width" icon="call_split" :label="tdc('Split')"
                 :disable="busy || !lines.length" data-test="pos-split" @click="emit('split')">
            <s-tooltip>{{ tdc('Each pays what they had: move items to a new tab') }}</s-tooltip>
          </s-btn>
        </div>
        <div :class="mode === 'tab' ? 'col-6' : 'col-12'">
          <s-btn flat rounded no-caps color="negative" class="full-width" icon="cancel"
                 :label="mode === 'tab' ? tdc('Void tab') : tdc('Cancel Sale')"
                 :disable="busy || (mode === 'quick' && !lines.length)" data-test="pos-void" @click="emit('void')">
            <s-tooltip>{{ mode === 'tab' ? tdc('Void this tab') : tdc('Empty the cart') }}</s-tooltip>
          </s-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { tdc } from 'quasar_resaas'

// The cart of the quick sale or of an open tab: big steppers for touch,
// optional discount, the totals and the actions. Pure presentation - the
// page decides what each action does.
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  mode: { type: String, default: 'quick' },        // 'quick' | 'tab'
  lines: { type: Array, default: () => [] },
  totals: { type: Object, default: () => ({ subtotal: 0, desconto: 0, tax: 0, total: 0 }) },
  canDiscount: { type: Boolean, default: false },
  canFinish: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  finishing: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['inc', 'dec', 'remove', 'discount', 'finish', 'split', 'void'])

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function qty (v) {
  const n = Number(v) || 0
  return Number.isInteger(n) ? n : n.toFixed(3).replace(/0+$/, '')
}

function subtotalOf (line) {
  return Number(line.quantidade || 0) * Number(line.preco_unitario || 0) - Number(line.desconto_valor || 0)
}
</script>

<style scoped>
.pos-cart { height: 100%; min-height: 0; }
.pos-cart__lines { overflow-y: auto; min-height: 0; margin: 4px -4px; padding: 0 4px; }
.pos-cart__empty { text-align: center; padding: 32px 8px; }
.pos-line { padding: 10px 0; border-bottom: 1px solid rgba(128, 128, 128, 0.15); }
.pos-line:last-child { border-bottom: none; }
.pos-line__name { font-weight: 600; line-height: 1.2; }
.pos-line__subtotal { font-weight: 700; padding-left: 8px; white-space: nowrap; }
.pos-line__discount { width: 92px; }
/* the discount as tall as the quantity stepper (30px), so a line stays short */
.pos-line__discount :deep(.q-field__control),
.pos-line__discount :deep(.q-field__marginal),
.pos-line__discount :deep(.q-field__native) { height: 30px; min-height: 30px; }
.pos-line__discount :deep(.q-field__control) { border-radius: 999px; padding: 0 10px; }
.pos-line__discount :deep(.q-field__control:before) { border-radius: 999px; }
.pos-line__discount :deep(.q-field__native) { padding: 0; }
.pos-line__discount :deep(.q-field__bottom) { display: none; }
/* no room kept for a message under the field: it sat higher than the stepper */
.pos-line__discount,
.pos-line__discount :deep(.q-field) { padding-bottom: 0 !important; flex: 0 0 auto; }
/* fixed width: the discount and delete columns line up on every line,
   whatever the quantity (1, 12, 1.5) */
.pos-stepper { flex: 0 0 auto; width: 104px; justify-content: space-between; box-sizing: border-box;
  border: 1px solid rgba(128, 128, 128, 0.25); border-radius: 999px; padding: 0 2px; }
.pos-stepper__qty { flex: 1 1 auto; min-width: 0; text-align: center; font-weight: 700; overflow: hidden; text-overflow: ellipsis; }
.pos-cart__footer { padding-top: 8px; border-top: 1px solid rgba(128, 128, 128, 0.2); }
</style>
