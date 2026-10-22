<template>
  <q-page class="q-pa-md" data-test="online-orders-page">
    <s-page-title :title="tdc('Online orders')" />

    <div class="row q-col-gutter-sm items-center q-mb-md">
      <div class="col-12 col-sm-5">
        <s-input v-model="filters.search" label="Reference, name or phone" dense clearable @update:model-value="reload" />
      </div>
      <div class="col-8 col-sm-4">
        <s-select v-model="filters.status" :options="statusOptions" label="Status" dense emit-value map-options clearable
          @update:model-value="reload" />
      </div>
      <div class="col-4 col-sm-3 text-right">
        <s-btn flat icon="refresh" :aria-label="tdc('Refresh')" @click="reload">
          <s-tooltip>{{ tdc('Refresh') }}</s-tooltip>
        </s-btn>
      </div>
    </div>

    <q-inner-loading :showing="loading" />
    <div v-if="loaded && !orders.length" class="text-grey q-pa-md">{{ tdc('No online orders.') }}</div>

    <q-list v-if="orders.length" bordered separator class="rounded-borders">
      <q-item v-for="order in orders" :key="order.id" data-test="online-order">
        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ order.reference }} · {{ order.contact_name }} · {{ order.contact_phone }}
            <q-badge :color="statusColor[order.effective_status]" class="q-ml-xs">
              {{ tdc(statusLabel[order.effective_status]) }}
            </q-badge>
            <q-badge v-if="order.prescription_required" color="warning" text-color="dark" class="q-ml-xs">
              {{ tdc('Prescription required') }}
            </q-badge>
          </q-item-label>
          <q-item-label caption>
            <span v-for="(item, index) in order.items" :key="item.id">{{ index ? ', ' : '' }}{{ Number(item.quantity) }} × {{ item.medicine_name }}</span>
          </q-item-label>
          <q-item-label caption>{{ tdc('Reserved until') }} {{ new Date(order.expires_at).toLocaleString() }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label class="text-weight-medium">{{ Number(order.total).toFixed(2) }} {{ order.currency }}</q-item-label>
          <div v-if="order.effective_status === 'reserved'" class="q-gutter-xs">
            <s-btn dense color="primary" icon="point_of_sale" label="Collect" data-test="order-collect" @click="openCollect(order)">
              <s-tooltip>{{ tdc('Collect') }}</s-tooltip>
            </s-btn>
            <s-btn dense flat color="negative" label="Cancel" @click="cancel(order)">
              <s-tooltip>{{ tdc('Cancel') }}</s-tooltip>
            </s-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="next" class="text-center q-mt-md">
      <s-btn flat label="Show more" :loading="loading" @click="load(page + 1)">
        <s-tooltip>{{ tdc('Show more') }}</s-tooltip>
      </s-btn>
    </div>

    <q-dialog v-model="collecting" persistent>
      <s-modal-card :title="tdc('Collect') + ' ' + (current?.reference || '')" icon="point_of_sale" form
        @close="collecting = false" @submit="collect">
        <div class="text-h6 q-mb-md">{{ tdc('Total') }}: {{ Number(current?.total || 0).toFixed(2) }} {{ current?.currency }}</div>
        <payment-fields v-model="payment" :prescription-required="Boolean(current?.prescription_required)" />
        <template #footer>
          <s-btn flat label="Cancel" @click="collecting = false">
            <s-tooltip>{{ tdc('Cancel') }}</s-tooltip>
          </s-btn>
          <s-btn color="primary" type="submit" label="Sell" :loading="saving">
            <s-tooltip>{{ tdc('Sell') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { AlertSuccess, sDialog, tdc } from 'quasar_resaas'
import PaymentFields from './PaymentFields.vue'
import { cancelOrder, collectOrder, onlineOrders } from './useCounter'
import { requestKey } from '../marketplace/useMarketplace'

const orders = ref([])
const page = ref(1)
const next = ref(null)
const loading = ref(false)
const loaded = ref(false)
const filters = reactive({ search: '', status: 'reserved' })

const statusLabel = { reserved: 'Reserved', collected: 'Collected', cancelled: 'Cancelled', expired: 'Expired' }
const statusColor = { reserved: 'primary', collected: 'positive', cancelled: 'grey', expired: 'grey' }
const statusOptions = computed(() => Object.entries(statusLabel).map(([value, label]) => ({ value, label: tdc(label) })))

async function load (pageNumber = 1) {
  loading.value = true
  try {
    // "expired" is computed on read (effective_status): filter it on the page
    const status = filters.status === 'expired' ? 'reserved' : filters.status
    const data = await onlineOrders({ page: pageNumber, search: filters.search || undefined, status: status || undefined })
    const rows = (data.results || []).filter((order) => !filters.status || order.effective_status === filters.status)
    orders.value = pageNumber === 1 ? rows : [...orders.value, ...rows]
    page.value = pageNumber
    next.value = data.next
  } finally {
    loading.value = false
    loaded.value = true
  }
}
const reload = () => load(1)

const collecting = ref(false)
const saving = ref(false)
const current = ref(null)
const payment = ref({})
let key = requestKey()

function openCollect (order) {
  current.value = order
  payment.value = { payment_method: 'numerario', payment_reference: '', prescription_verified: false, prescription_reference: '' }
  key = requestKey()
  collecting.value = true
}

async function collect () {
  saving.value = true
  try {
    await collectOrder(current.value.id, { ...payment.value, idempotency_key: key })
    AlertSuccess(tdc('Sale recorded and paid.'))
    collecting.value = false
    reload()
  } catch {
    // shown by the API client
  } finally {
    saving.value = false
  }
}

function cancel (order) {
  sDialog({
    title: tdc('Cancel the reservation?'),
    message: tdc('The medicines go back to the available stock.'),
    prompt: { model: '', type: 'text', label: tdc('Reason') },
    ok: { label: tdc('Cancel the reservation'), color: 'negative', flat: true },
    cancel: { label: tdc('Keep it'), flat: true },
  }).onOk(async (reason) => {
    try {
      await cancelOrder(order.id, reason || '')
    } finally {
      reload()
    }
  })
}

reload()
</script>
