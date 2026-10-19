<template>
  <section v-if="cart.lines.length || placed.length" class="q-mb-lg" data-test="reservation-cart">
    <div class="text-h6 q-mb-sm">{{ tdc('My reservation') }}</div>

    <q-list v-if="cart.lines.length" bordered separator class="rounded-borders">
      <template v-for="group in groups" :key="group.pharmacy.id">
        <q-item-label header>
          <q-icon name="local_pharmacy" /> {{ group.pharmacy.name }}
        </q-item-label>
        <q-item v-for="line in group.lines" :key="line.row.offer_id" data-test="cart-line">
          <q-item-section>
            <q-item-label>{{ line.row.medicine.name }} {{ line.row.medicine.strength }}</q-item-label>
            <q-item-label caption>{{ line.row.medicine.presentation }} · {{ formatMoney(line.row.price, line.row.currency) }}</q-item-label>
            <q-item-label v-if="line.row.medicine.prescription_required" caption class="text-warning">
              {{ tdc('Bring the prescription when you collect.') }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
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
                @click="step(line.row.offer_id, -1)"
              />
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
                @click="step(line.row.offer_id, 1)"
              />
            </div>
          </q-item-section>
          <q-item-section side>
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
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section class="text-right text-weight-medium">
            {{ tdc('Total') }}: {{ formatMoney(group.total, group.currency) }}
          </q-item-section>
        </q-item>
      </template>
      <q-item>
        <q-item-section class="text-caption text-grey">
          {{ tdc('One reservation per pharmacy. Prices and stock are confirmed when you reserve; you pay when you collect.') }}
        </q-item-section>
        <q-item-section side>
          <s-btn color="primary" icon="lock" label="Reserve" data-test="cart-reserve" @click="open = true" />
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
          <s-input v-model="contact.name" label="Contact name" :rules="[required]" />
          <s-input v-model="contact.phone" label="Contact phone" :rules="[required]" />
        </div>
        <template #footer>
          <s-btn flat label="Cancel" @click="open = false" />
          <s-btn color="primary" type="submit" label="Reserve" :loading="saving" />
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
</style>
