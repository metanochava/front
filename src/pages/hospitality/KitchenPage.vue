<template>
  <q-page class="kds q-pa-sm column no-wrap" :style-fn="pageHeight">
    <!-- stations -->
    <div class="row items-center no-wrap q-gutter-x-xs q-mb-sm kds-stations">
      <s-btn
        no-caps rounded unelevated size="md"
        :color="station === null ? 'primary' : undefined" :outline="station !== null"
        :label="tdc('All')" @click="pick(null)"
      >
        <s-tooltip>{{ tdc('Every station') }}</s-tooltip>
      </s-btn>
      <s-btn
        v-for="s in stations" :key="s.id"
        no-caps rounded unelevated size="md"
        :color="station === s.id ? 'primary' : undefined" :outline="station !== s.id"
        :label="s.name" data-test="kds-station" @click="pick(s.id)"
      >
        <s-tooltip>{{ tdc('Only this station') }}</s-tooltip>
      </s-btn>
      <q-space />
      <q-spinner v-if="loading" size="20px" color="primary" />
    </div>

    <div v-if="error" class="text-negative q-mb-sm">{{ error }}</div>

    <!-- columns: new / preparing / ready -->
    <div class="col kds-columns">
      <section v-for="col in columns" :key="col.status" class="kds-col">
        <header class="kds-col__head" :class="`kds-col__head--${col.status}`">
          <q-icon :name="col.icon" size="20px" /> {{ col.label }}
          <q-badge rounded color="white" text-color="dark" class="q-ml-xs">{{ byStatus(col.status).length }}</q-badge>
        </header>
        <div class="kds-col__body">
          <article
            v-for="t in byStatus(col.status)" :key="t.id"
            class="kds-ticket" :class="{ 'kds-ticket--late': minutes(t) >= 15, 'kds-ticket--dark': $q.dark.isActive }"
            data-test="kds-ticket"
          >
            <div class="row items-center no-wrap">
              <div class="col kds-ticket__where">{{ t.table || t.tab_label }}</div>
              <div class="kds-ticket__time"><q-icon name="schedule" size="14px" /> {{ minutes(t) }} min</div>
            </div>
            <div class="text-caption text-grey-7">{{ t.station.name }}</div>
            <ul class="kds-ticket__lines">
              <li v-for="(l, i) in t.lines" :key="i"><b>{{ qty(l.quantidade) }}×</b> {{ l.product_nome }}</li>
            </ul>
            <s-btn
              unelevated rounded no-caps class="full-width"
              :color="col.next.color" :icon="col.next.icon" :label="col.next.label"
              :loading="advancing === t.id" data-test="kds-advance"
              @click="advance(t, col.next.status)"
            >
              <s-tooltip>{{ col.next.label }}</s-tooltip>
            </s-btn>
          </article>
          <div v-if="!byStatus(col.status).length" class="text-center text-grey-6 q-pa-md">—</div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { tdc, errorMessage } from 'quasar_resaas'
import { useTableStore } from './tableStore'

// The kitchen / bar screen (a tablet on the wall): what each station has to
// prepare, from the tabs' orders. New -> preparing -> ready -> served.
// Refreshed every 10 seconds; a ticket waiting 15 minutes or more is marked.
const Table = useTableStore()

const tickets = ref([])
const stations = ref([])
const station = ref(null)
const loading = ref(false)
const advancing = ref(null)
const error = ref('')
const now = ref(Date.now())
let timer = null

const columns = [
  { status: 'new', label: tdc('New'), icon: 'fiber_new',
    next: { status: 'preparing', label: tdc('Start preparing'), icon: 'local_fire_department', color: 'orange' } },
  { status: 'preparing', label: tdc('Preparing'), icon: 'local_fire_department',
    next: { status: 'ready', label: tdc('Ready'), icon: 'done', color: 'positive' } },
  { status: 'ready', label: tdc('Ready'), icon: 'room_service',
    next: { status: 'served', label: tdc('Served'), icon: 'done_all', color: 'primary' } },
]

function pageHeight (offset, height) {
  return { height: `${height - offset}px` }
}

function byStatus (status) {
  return tickets.value.filter(t => t.status === status)
}

function minutes (t) {
  return Math.max(0, Math.floor((now.value - new Date(t.created_at).getTime()) / 60000))
}

function qty (v) {
  const n = Number(v) || 0
  return Number.isInteger(n) ? n : n.toFixed(3).replace(/0+$/, '')
}

async function load () {
  loading.value = true
  now.value = Date.now()
  try {
    tickets.value = await Table.kitchen(station.value)
    error.value = ''
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    loading.value = false
  }
}

function pick (id) {
  station.value = id
  load()
}

async function advance (ticket, status) {
  advancing.value = ticket.id
  try {
    await Table.advanceTicket(ticket.id, status)
    await load()
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    advancing.value = null
  }
}

onMounted(async () => {
  try { stations.value = await Table.stations() } catch { stations.value = [] }
  load()
  timer = setInterval(load, 10000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.kds { overflow: hidden; }
.kds-stations { overflow-x: auto; scrollbar-width: none; }
.kds-columns { display: grid; grid-template-columns: repeat(3, minmax(260px, 1fr)); gap: 10px; min-height: 0; overflow-x: auto; }
.kds-col { display: flex; flex-direction: column; min-height: 0; border-radius: 16px; background: rgba(128, 128, 128, 0.08); }
.kds-col__head { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border-radius: 16px 16px 0 0;
                 color: #fff; font-weight: 700; }
.kds-col__head--new { background: var(--q-info); }
.kds-col__head--preparing { background: #fb8c00; }
.kds-col__head--ready { background: var(--q-positive); }
.kds-col__body { overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px; }
.kds-ticket { background: #fff; border-radius: 14px; padding: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
              border-left: 6px solid transparent; }
.kds-ticket--dark { background: #1f1f24; }
.kds-ticket--late { border-left-color: var(--q-negative); }
.kds-ticket__where { font-size: 1.15rem; font-weight: 800; }
.kds-ticket__time { font-size: 0.85rem; opacity: 0.75; white-space: nowrap; }
.kds-ticket--late .kds-ticket__time { color: var(--q-negative); opacity: 1; font-weight: 700; }
.kds-ticket__lines { margin: 8px 0 10px; padding-left: 0; list-style: none; font-size: 1.05rem; line-height: 1.6; }
@media (max-width: 599px) { .kds-columns { grid-template-columns: repeat(3, 85vw); } }
</style>
