<template>
  <section v-if="cart.lines.length || placed.length" class="q-mb-lg" data-test="reservation-cart">
    <div class="text-h6 q-mb-sm">{{ tdc('My reservation') }}</div>

    <q-list v-if="cart.lines.length" bordered separator class="rounded-borders">
      <template v-for="group in groups" :key="group.pharmacy.id">
        <q-item-label header>
          <q-icon name="local_pharmacy" /> {{ group.pharmacy.name }}
        </q-item-label>
        <q-item v-for="line in group.lines" :key="line.row.offer_id" class="cart-line" data-test="cart-line">
          <q-item-section>
            <q-item-label>{{ line.row.medicine.name }} {{ line.row.medicine.strength }}</q-item-label>
            <q-item-label caption>{{ line.row.medicine.presentation }} · {{ formatMoney(line.row.price, line.row.currency) }}</q-item-label>
            <q-item-label v-if="line.row.medicine.prescription_required" caption class="text-warning">
              {{ tdc('Bring the prescription when you collect.') }}
            </q-item-label>
          </q-item-section>
          <q-item-section side class="cart-line__controls">
            <div class="row items-center no-wrap q-gutter-x-sm">
            <div class="cart-stepper row items-center no-wrap" data-test="cart-stepper">
              <s-btn
                round
                dense
                unelevated
                size="sm"
                color="primary"
                icon="remove"
                :disable="line.quantity <= 1"
                :aria-label="tdc('Decrease quantity')"
                data-test="cart-decrease"
                @click="step(line.row.offer_id, -1)">
                <s-tooltip>{{ tdc('Decrease quantity') }}</s-tooltip>
              </s-btn>
              <span class="cart-stepper__value text-weight-medium" data-test="cart-quantity">{{ line.quantity }}</span>
              <s-btn
                round
                dense
                unelevated
                size="sm"
                color="primary"
                icon="add"
                :disable="line.quantity >= maxQuantity(line)"
                :aria-label="tdc('Increase quantity')"
                data-test="cart-increase"
                @click="step(line.row.offer_id, 1)">
                <s-tooltip>{{ tdc('Increase quantity') }}</s-tooltip>
              </s-btn>
            </div>
            <s-btn
              round
              dense
              unelevated
              size="sm"
              color="negative"
              icon="delete"
              :aria-label="tdc('Remove')"
              data-test="cart-remove"
              @click="remove(line.row.offer_id)"
            >
              <q-tooltip>{{ tdc('Remove') }}</q-tooltip>
            </s-btn>
            </div>
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section class="text-right text-weight-medium">
            {{ tdc('Total') }}: {{ formatMoney(group.total, group.currency) }}
          </q-item-section>
        </q-item>
      </template>
      <q-item class="cart-footer">
        <q-item-section class="text-caption text-grey">
          {{ tdc('One reservation per pharmacy. Prices and stock are confirmed when you reserve; you pay when you collect.') }}
        </q-item-section>
        <q-item-section side class="cart-footer__action">
          <s-btn unelevated color="primary" icon="lock" label="Reserve" class="cart-footer__reserve" data-test="cart-reserve" @click="open = true">
            <s-tooltip>{{ tdc('Reserve') }}</s-tooltip>
          </s-btn>
        </q-item-section>
      </q-item>
    </q-list>

    <q-banner v-if="placed.length" class="bg-positive text-white q-mt-md rounded-borders" data-test="cart-placed">
      {{ tdc('Reserved. Show the reference at the pharmacy:') }}
      <span v-for="order in placed" :key="order.id" class="q-ml-sm text-weight-bold">
        {{ order.reference }} ({{ order.pharmacy.name }})
      </span>
    </q-banner>

    <q-dialog v-model="open" persistent>
      <s-modal-card :title="tdc('Reserve')" icon="lock" form @close="open = false" @submit="submit">
        <div class="q-gutter-md">
          <s-input dense v-model="contact.name" label="Contact name" autocomplete="name" :rules="[required]" />
          <s-input dense v-model="contact.phone" type="tel" inputmode="tel" label="Contact phone" autocomplete="tel" :rules="[required]" />
        </div>
        <template #footer>
          <s-btn flat label="Cancel" @click="open = false">
            <s-tooltip>{{ tdc('Cancel') }}</s-tooltip>
          </s-btn>
          <s-btn color="primary" type="submit" label="Reserve" :loading="saving">
            <s-tooltip>{{ tdc('Reserve') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { tdc } from 'quasar_resaas'
import { formatMoney, placeOrders, requestKey, useCart } from './useMarketplace'

const emit = defineEmits(['placed'])

const { cart, remove, clear, step, maxQuantity } = useCart()
const open = ref(false)
const saving = ref(false)
const placed = ref([])
const contact = reactive({ name: '', phone: '' })
// kept until the request succeeds: a retry after a network error is the same request
let key = requestKey()

const required = (value) => Boolean((value || '').trim()) || tdc('This field is required.')

const groups = computed(() => {
  const byPharmacy = {}
  for (const line of cart.lines) {
    const pharmacy = line.row.pharmacy
    const group = byPharmacy[pharmacy.id] ||= { pharmacy, currency: line.row.currency, lines: [], total: 0 }
    group.lines.push(line)
    group.total += Number(line.row.price) * Number(line.quantity || 0)
  }
  return Object.values(byPharmacy)
})

async function submit () {
  saving.value = true
  try {
    placed.value = await placeOrders({ contact_name: contact.name, contact_phone: contact.phone, idempotency_key: key })
    key = requestKey()
    clear()
    open.value = false
    emit('placed', placed.value)
  } catch {
    // the API client shows the message (e.g. insufficient_stock): the cart stays as it was
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* − quantity + in one rounded pill */
.cart-stepper {
  gap: 4px;
  padding: 2px;
  border: 1px solid color-mix(in srgb, var(--q-primary) 35%, transparent);
  border-radius: 999px;
}
.cart-stepper__value {
  min-width: 32px;
  text-align: center;
}

/* the note wraps (it inherits nowrap and overflowed narrow columns) */
.cart-footer > .q-item__section--main {
  white-space: normal;
}

/* phones: the quantity and remove under the medicine, "Reserve" across the width */
@media (max-width: 599px) {
  .cart-line,
  .cart-footer {
    flex-wrap: wrap;
  }
  /* the medicine (or the note) on its own line, the controls below it */
  .cart-line > .q-item__section--main,
  .cart-footer > .q-item__section--main {
    flex: 1 1 100%;
  }
  .cart-line__controls,
  .cart-footer__action {
    width: 100%;
    padding-left: 0;
    padding-top: 8px;
    align-items: flex-end;
  }
  .cart-footer__reserve {
    width: 100%;
    min-height: 36px; /* medium, not large */
  }
}
</style>
