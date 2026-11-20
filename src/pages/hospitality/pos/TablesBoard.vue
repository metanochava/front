<template>
  <div class="pos-board">
    <div v-if="loading && !tables.length" class="flex flex-center q-pa-xl">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="40px" />
    </div>
    <div v-else-if="!tables.length" class="text-center text-grey-6 q-pa-xl">
      <q-icon name="table_restaurant" size="40px" /><br>
      {{ tdc('No tables yet - add them under Hospitality → Tables') }}
    </div>

    <section v-for="group in groups" :key="group.key" class="q-mb-md">
      <div class="pos-board__area">{{ group.name }}</div>
      <div class="pos-board__grid">
        <div
          v-for="t in group.tables" :key="t.id"
          class="pos-table"
          :class="[`pos-table--${t.state}`, { 'pos-table--calling': t.requests.length || (t.orders && t.orders.length), 'pos-table--dark': $q.dark.isActive }]"
          data-test="pos-table"
        >
          <button type="button" class="pos-table__open" :disabled="busy" @click="emit('open', t)">
            <div class="pos-table__name">{{ t.name }}</div>
            <div class="pos-table__info">
              <template v-if="t.tab">{{ money(t.tab.total) }}</template>
              <template v-else>{{ tdc('Free') }} · {{ t.seats }} <q-icon name="person" size="12px" /></template>
            </div>
            <s-tooltip>{{ t.tab ? tdc('Continue the table\'s tab') : tdc('Open a tab for this table') }}</s-tooltip>
          </button>

          <!-- what the customers ordered from the QR code: accept / reject -->
          <button
            v-if="t.orders && t.orders.length" type="button"
            class="pos-table__request pos-table__request--order"
            data-test="pos-table-orders"
            @click="emit('orders', t)"
          >
            <q-icon name="receipt" size="14px" />
            {{ t.orders.length }} {{ t.orders.length === 1 ? tdc('order') : tdc('orders') }}
            <s-tooltip>{{ tdc('Accept or reject the orders from the QR code') }}</s-tooltip>
          </button>

          <!-- what the customers asked from the QR code -->
          <button
            v-for="r in t.requests" :key="r.id" type="button"
            class="pos-table__request"
            data-test="pos-table-request"
            @click="emit('handle', r)"
          >
            <q-icon :name="r.kind === 'bill' ? 'receipt_long' : 'front_hand'" size="14px" />
            {{ r.kind === 'bill' ? tdc('Bill') : tdc('Waiter') }}
            <q-icon name="done" size="14px" />
            <s-tooltip>{{ tdc('Mark the request handled') }}</s-tooltip>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'

// The branch's tables by area (hospitality board): free / occupied with the
// tab's total, and blinking when the customers called from the QR code.
const props = defineProps({
  tables: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['open', 'handle', 'orders'])

const groups = computed(() => {
  const map = new Map()
  for (const t of props.tables) {
    const key = t.area?.id || '-'
    if (!map.has(key)) map.set(key, { key, name: t.area?.name || tdc('Other'), tables: [] })
    map.get(key).tables.push(t)
  }
  return [...map.values()]
})

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}
</script>

<style scoped>
.pos-board { height: 100%; overflow-y: auto; padding-bottom: 8px; }
.pos-board__area { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; margin: 4px 2px 8px; }
.pos-board__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 10px; }

.pos-table { display: flex; flex-direction: column; border-radius: 16px; overflow: hidden;
             border: 2px solid rgba(128, 128, 128, 0.2); background: #fff; }
.pos-table--dark { background: #1f1f24; }
.pos-table--occupied { border-color: var(--q-primary); }
.pos-table--occupied .pos-table__open { background: var(--q-primary); color: #fff; }
.pos-table--calling { border-color: var(--q-warning); animation: pos-blink 1.2s ease-in-out infinite; }

.pos-table__open { border: none; background: transparent; color: inherit; font: inherit; padding: 14px 8px; cursor: pointer;
                   text-align: center; -webkit-tap-highlight-color: transparent; }
.pos-table__open:active { transform: scale(0.97); }
.pos-table__name { font-size: 1.05rem; font-weight: 700; }
.pos-table__info { font-size: 0.8rem; opacity: 0.85; margin-top: 2px; }
.pos-table__request--order { background: var(--q-info) !important; color: #fff !important; }
.pos-table__request { display: flex; align-items: center; justify-content: center; gap: 4px; border: none; padding: 6px;
                      background: var(--q-warning); color: #000; font: inherit; font-size: 0.8rem; font-weight: 600; cursor: pointer; }

@keyframes pos-blink { 50% { box-shadow: 0 0 0 4px rgba(242, 192, 55, 0.35); } }
</style>
