<template>
  <section data-test="my-orders">
    <div class="row items-center q-mb-sm">
      <div class="text-h6 col">{{ tdc('My reservations') }}</div>
      <s-btn flat dense icon="refresh" :aria-label="tdc('Refresh')" @click="reload">
        <s-tooltip>{{ tdc('Refresh') }}</s-tooltip>
      </s-btn>
    </div>

    <q-inner-loading :showing="state.loading && !state.rows.length" />
    <div v-if="state.loaded && !state.rows.length" class="text-grey q-pa-md">{{ tdc('You have no reservations yet.') }}</div>

    <q-list v-if="state.rows.length" bordered separator class="rounded-borders">
      <q-item v-for="order in state.rows" :key="order.id" data-test="my-order">
        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ order.reference }} · {{ order.pharmacy?.name }}
            <q-badge :color="statusColor[order.status]" class="q-ml-xs">{{ tdc(statusLabel[order.status]) }}</q-badge>
          </q-item-label>
          <q-item-label caption>
            <span v-for="(item, index) in order.items" :key="index">{{ index ? ', ' : '' }}{{ item.quantity }} × {{ item.medicine }}</span>
          </q-item-label>
          <q-item-label v-if="order.status === 'reserved'" caption>
            {{ tdc('Reserved until') }} {{ new Date(order.expires_at).toLocaleString() }}
          </q-item-label>
          <q-item-label v-if="order.prescription_required && order.status === 'reserved'" caption class="text-warning">
            {{ tdc('Bring the prescription when you collect.') }}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label class="text-weight-medium">{{ formatMoney(order.total, order.currency) }}</q-item-label>
          <s-btn v-if="order.status === 'reserved'" flat dense color="negative" label="Cancel" @click="cancel(order)">
            <s-tooltip>{{ tdc('Cancel') }}</s-tooltip>
          </s-btn>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="state.rows.length < state.count" class="text-center q-mt-md">
      <s-btn flat label="Show more" :loading="state.loading" @click="more">
        <s-tooltip>{{ tdc('Show more') }}</s-tooltip>
      </s-btn>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { sDialog, tdc } from 'quasar_resaas'
import { cancelMyOrder, formatMoney, useMyOrders } from './useMarketplace'

const { state, load, more } = useMyOrders()
const reload = () => load()
defineExpose({ reload })

const statusLabel = { reserved: 'Reserved', collected: 'Collected', cancelled: 'Cancelled', expired: 'Expired' }
const statusColor = { reserved: 'primary', collected: 'positive', cancelled: 'grey', expired: 'grey' }

function cancel (order) {
  sDialog({
    title: tdc('Cancel the reservation?'),
    message: tdc('The pharmacy will release the medicines.'),
    ok: { label: tdc('Cancel the reservation'), color: 'negative', flat: true },
    cancel: { label: tdc('Keep it'), flat: true },
  }).onOk(async () => {
    try {
      await cancelMyOrder(order.id)
    } finally {
      reload()
    }
  })
}

onMounted(reload)
</script>
