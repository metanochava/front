<template>
  <q-page class="q-pa-md" data-test="counter-page">
    <s-page-title :title="tdc('Pharmacy counter')" />

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <s-input v-model="query" label="Medicine, active substance, brand or strength" clearable dense
          data-test="counter-query" @update:model-value="search" />
        <q-inner-loading :showing="loading" />
        <q-list v-if="offers.length" bordered separator class="rounded-borders q-mt-md">
          <q-item v-for="offer in offers" :key="offer.offer_id" data-test="counter-offer">
            <q-item-section>
              <q-item-label>
                {{ offer.medicine.name }} {{ offer.medicine.strength }}
                <q-badge v-if="offer.medicine.prescription_required" color="warning" text-color="dark">
                  {{ tdc('Prescription required') }}
                </q-badge>
              </q-item-label>
              <q-item-label caption>{{ offer.medicine.dosage_form }} · {{ offer.medicine.presentation }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-weight-medium">{{ money(offer.price) }}</q-item-label>
              <q-item-label caption>{{ tdc('Available') }}: {{ offer.available_quantity ?? '—' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <s-btn flat round icon="add" :disable="Number(offer.available_quantity) <= 0" :aria-label="tdc('Add')"
                @click="add(offer)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else-if="searched && !loading" class="text-grey q-pa-md">{{ tdc('No medicine found for this search.') }}</div>
      </div>

      <div class="col-12 col-md-5">
        <s-card class="q-pa-md">
          <div class="text-subtitle1 q-mb-sm">{{ tdc('Sale') }}</div>
          <div v-if="!lines.length" class="text-grey">{{ tdc('Add medicines to the sale.') }}</div>
          <q-list v-else dense separator>
            <q-item v-for="line in lines" :key="line.offer.offer_id">
              <q-item-section>{{ line.offer.medicine.name }} {{ line.offer.medicine.strength }}</q-item-section>
              <q-item-section side style="width: 90px">
                <s-input v-model.number="line.quantity" type="number" min="1" max="100" dense />
              </q-item-section>
              <q-item-section side>{{ money(line.offer.price * line.quantity) }}</q-item-section>
              <q-item-section side>
                <s-btn flat round dense icon="close" :aria-label="tdc('Remove')" @click="removeLine(line)" />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="text-h6 text-right q-my-md">{{ tdc('Total') }}: {{ money(total) }}</div>
          <payment-fields v-model="payment" :prescription-required="needsPrescription" />
          <div class="row justify-end q-mt-md">
            <s-btn color="primary" icon="point_of_sale" label="Sell" :disable="!lines.length" :loading="saving"
              data-test="counter-sell" @click="sell" />
          </div>
        </s-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { debounce } from 'quasar'
import { AlertSuccess, tdc } from 'quasar_resaas'
import PaymentFields from './PaymentFields.vue'
import { counterOffers, sellAtCounter } from './useCounter'
import { requestKey } from '../marketplace/useMarketplace'

const query = ref('')
const offers = ref([])
const loading = ref(false)
const searched = ref(false)
const lines = ref([])
const saving = ref(false)
const emptyPayment = () => ({ payment_method: 'numerario', payment_reference: '', prescription_verified: false, prescription_reference: '' })
const payment = ref(emptyPayment())
let key = requestKey()

const money = (value) => Number(value || 0).toFixed(2)
const total = computed(() => lines.value.reduce((sum, line) => sum + Number(line.offer.price) * Number(line.quantity || 0), 0))
const needsPrescription = computed(() => lines.value.some((line) => line.offer.medicine.prescription_required))

const search = debounce(async () => {
  loading.value = true
  try {
    offers.value = await counterOffers(query.value || '')
  } finally {
    loading.value = false
    searched.value = true
  }
}, 300)

function add (offer) {
  const line = lines.value.find((item) => item.offer.offer_id === offer.offer_id)
  if (line) line.quantity += 1
  else lines.value.push({ offer, quantity: 1 })
}

function removeLine (line) {
  lines.value = lines.value.filter((item) => item !== line)
}

async function sell () {
  saving.value = true
  try {
    await sellAtCounter({
      lines: lines.value.map((line) => ({ offer_id: line.offer.offer_id, quantity: line.quantity })),
      ...payment.value,
      idempotency_key: key,
    })
    AlertSuccess(tdc('Sale recorded and paid.'))
    key = requestKey()
    lines.value = []
    payment.value = emptyPayment()
    search()
  } catch {
    // shown by the API client; the sale stays on screen to correct and retry
  } finally {
    saving.value = false
  }
}

search()
</script>
