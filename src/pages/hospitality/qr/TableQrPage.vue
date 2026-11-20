<template>
  <div class="qr-page" :class="{ 'qr-page--dark': $q.dark.isActive }" :style="{ '--brand': page?.place?.color || '#1976D2' }">

    <div v-if="loading && !page" class="flex flex-center qr-center">
      <q-spinner size="44px" :color="$q.dark.isActive ? 'white' : 'primary'" />
    </div>

    <div v-else-if="notFound" class="qr-center text-center q-pa-lg" data-test="qr-not-found">
      <q-icon name="qr_code_scanner" size="56px" color="grey-6" />
      <div class="text-h6 q-mt-md">{{ tdc('This table was not found.') }}</div>
      <div class="text-grey-7 q-mt-xs">{{ tdc('Ask a member of staff for help.') }}</div>
    </div>

    <template v-else-if="page">
      <!-- header: the place and the table -->
      <header class="qr-header">
        <div class="row items-center no-wrap">
          <img v-if="page.place.logo" :src="page.place.logo" class="qr-logo" :alt="page.place.name">
          <div class="col">
            <div class="qr-place ellipsis">{{ page.place.name }}</div>
            <div class="qr-branch ellipsis">{{ page.place.branch }}</div>
          </div>
          <div class="qr-table" data-test="qr-table">
            <q-icon name="table_bar" size="18px" />
            {{ page.table.name }}
          </div>
        </div>

        <div v-if="page.tab" class="qr-tab" data-test="qr-tab">
          <span>{{ tdc('Your tab') }} · {{ page.tab.line_count }} {{ tdc('Items') }}</span>
          <span class="text-weight-bold">{{ money(page.tab.total) }}</span>
        </div>
      </header>

      <!-- categories -->
      <nav v-if="sections.length > 1" class="qr-chips">
        <button
          v-for="(s, i) in sections" :key="i" type="button"
          class="qr-chip" :class="{ 'qr-chip--active': current === i }"
          @click="goTo(i)"
        >
          {{ s.title }}
        </button>
      </nav>

      <!-- the menu -->
      <main class="qr-menu">
        <div v-if="!sections.length" class="text-center text-grey-7 q-pa-xl">{{ tdc('The menu is not available yet.') }}</div>
        <section v-for="(s, i) in sections" :id="`qr-section-${i}`" :key="i" class="qr-section">
          <h2 class="qr-section__title">{{ s.title }}</h2>
          <div v-for="item in s.items" :key="item.id" class="qr-item" data-test="qr-item">
            <div class="qr-item__media" :style="!item.imagem ? { background: tint(item.nome) } : {}">
              <img v-if="item.imagem" :src="item.imagem" :alt="item.nome" loading="lazy">
              <span v-else>{{ initials(item.nome) }}</span>
            </div>
            <div class="col">
              <div class="qr-item__name">{{ item.nome }}</div>
              <div v-if="item.product_type === 'service'" class="qr-item__note">{{ tdc('Service') }}</div>
            </div>
            <div class="column items-end">
              <div class="qr-item__price">{{ money(item.preco_base) }}</div>
              <div class="qr-stepper row items-center no-wrap q-mt-xs">
                <button v-if="cartQty(item.id)" type="button" class="qr-step" data-test="qr-item-dec" @click="changeCart(item, -1)">−</button>
                <span v-if="cartQty(item.id)" class="qr-step__qty">{{ cartQty(item.id) }}</span>
                <button type="button" class="qr-step qr-step--add" data-test="qr-item-add" @click="changeCart(item, 1)">+</button>
              </div>
            </div>
          </div>
        </section>

        <!-- this table's recent orders -->
        <section v-if="page.orders && page.orders.length" class="qr-section">
          <h2 class="qr-section__title">{{ tdc('Your orders') }}</h2>
          <div v-for="o in page.orders" :key="o.id" class="qr-order" data-test="qr-order">
            <div class="row items-center no-wrap">
              <div class="col text-caption">{{ time(o.created_at) }}</div>
              <span class="qr-order__status" :class="`qr-order__status--${o.status}`">{{ statusLabel(o.status) }}</span>
            </div>
            <div v-for="(l, i) in o.lines" :key="i" class="text-body2">{{ l.quantidade }}× {{ l.product_nome }}</div>
          </div>
        </section>
      </main>

      <!-- what the customer can ask -->
      <footer class="qr-actions">
        <button v-if="cartCount" type="button" class="qr-cartbar" data-test="qr-cartbar" @click="cartOpen = true">
          <q-icon name="shopping_bag" size="20px" />
          <span class="col text-left">{{ tdc('Your order') }} · {{ cartCount }}</span>
          <span class="text-weight-bold">{{ money(cartTotal) }}</span>
        </button>
        <div v-if="message" class="qr-message" data-test="qr-message">
          <q-icon name="check_circle" size="18px" /> {{ message }}
        </div>
        <div class="row no-wrap q-gutter-x-sm">
          <s-btn
            unelevated rounded no-caps size="lg" class="col qr-btn"
            :color="waiting('waiter') ? 'positive' : 'primary'"
            :icon="waiting('waiter') ? 'hourglass_top' : 'front_hand'"
            :label="waiting('waiter') ? tdc('The waiter is coming') : tdc('Call the waiter')"
            :loading="calling === 'waiter'"
            data-test="qr-call-waiter"
            @click="call('waiter')"
          >
            <s-tooltip>{{ tdc('A member of staff comes to your table') }}</s-tooltip>
          </s-btn>
          <s-btn
            unelevated rounded no-caps size="lg" class="col qr-btn"
            :color="waiting('bill') ? 'positive' : 'dark'"
            :icon="waiting('bill') ? 'hourglass_top' : 'receipt_long'"
            :label="waiting('bill') ? tdc('The bill is coming') : tdc('Ask for the bill')"
            :loading="calling === 'bill'"
            data-test="qr-call-bill"
            @click="call('bill')"
          >
            <s-tooltip>{{ tdc('The bill is brought to your table') }}</s-tooltip>
          </s-btn>
        </div>
        <div v-if="error" class="text-negative text-caption text-center q-mt-xs">{{ error }}</div>
      </footer>
    </template>

    <q-dialog v-model="cartOpen" position="bottom" :maximized="$q.screen.lt.sm">
      <s-modal-card :title="tdc('Your order')" icon="shopping_bag" width="480px">
        <div v-for="line in cart" :key="line.id" class="row items-center no-wrap q-py-sm qr-cartline" data-test="qr-cart-line">
          <div class="col">
            <div class="text-weight-medium">{{ line.nome }}</div>
            <div class="text-caption text-grey-7">{{ money(line.preco_base) }}</div>
          </div>
          <div class="qr-stepper row items-center no-wrap">
            <button type="button" class="qr-step" @click="changeCart(line, -1)">−</button>
            <span class="qr-step__qty">{{ line.quantidade }}</span>
            <button type="button" class="qr-step qr-step--add" @click="changeCart(line, 1)">+</button>
          </div>
        </div>
        <s-input v-model="note" class="q-mt-md" maxlength="200" :label="tdc('Note for the staff') + ' (' + tdc('optional') + ')'"
                 :hint="tdc('For example: no ice, well done')" data-test="qr-note" />
        <div class="row justify-between text-subtitle1 text-weight-bold q-mt-md">
          <span>{{ tdc('Total') }}</span><span data-test="qr-cart-total">{{ money(cartTotal) }}</span>
        </div>
        <div class="text-caption text-grey-7">{{ tdc('A member of staff confirms your order; then it is prepared.') }}</div>
        <div v-if="orderError" class="text-negative text-caption q-mt-xs">{{ orderError }}</div>
        <template #footer>
          <s-btn flat :label="tdc('Keep choosing')" @click="cartOpen = false">
            <s-tooltip>{{ tdc('Back to the menu') }}</s-tooltip>
          </s-btn>
          <s-btn unelevated rounded color="primary" icon="send" :label="tdc('Send order')" :loading="sending"
                 :disable="!cartCount" data-test="qr-send" @click="sendOrder">
            <s-tooltip>{{ tdc('Send the order to the staff') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { tdc, url, HTTPClient, errorMessage } from 'quasar_resaas'

// The page a table's QR code opens (public, no session): the place, the
// table, the menu and the tab's total, and two buttons - call the waiter,
// ask for the bill (hospitality/qr/<token>/). Refreshed every 20 seconds so
// a handled request shows.
const route = useRoute()
const $q = useQuasar()

const page = ref(null)
const loading = ref(false)
const notFound = ref(false)
const calling = ref(null)
const message = ref('')
const error = ref('')
const current = ref(0)
let timer = null
let messageTimer = null

const token = computed(() => String(route.params.token || ''))
const base = computed(() => `hospitality/qr/${encodeURIComponent(token.value)}`)

const sections = computed(() => (page.value?.menu || []).map(group => ({
  title: group.category || tdc('Other'),
  items: group.items,
})))

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function initials (name) {
  return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const TINTS = ['#5c6bc0', '#26a69a', '#ff7043', '#ab47bc', '#42a5f5', '#66bb6a', '#ec407a', '#ffa726']
function tint (name) {
  let h = 0
  for (const ch of String(name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return TINTS[h % TINTS.length]
}

// ---------------- THE CUSTOMER'S ORDER ----------------
// The cart lives on the phone; "Send order" posts it once with a key (a retry
// returns the same order); a member of staff confirms it before it is charged.
const cart = ref([])
const cartOpen = ref(false)
const note = ref('')
const sending = ref(false)
const orderError = ref('')

function newKey () {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
let orderKey = newKey()

const cartCount = computed(() => cart.value.reduce((s, l) => s + l.quantidade, 0))
const cartTotal = computed(() => cart.value.reduce((s, l) => s + l.quantidade * Number(l.preco_base || 0), 0))

function cartQty (id) {
  return cart.value.find(l => l.id === id)?.quantidade || 0
}

function changeCart (item, delta) {
  const line = cart.value.find(l => l.id === item.id)
  if (!line && delta > 0) cart.value.push({ id: item.id, nome: item.nome, preco_base: item.preco_base, quantidade: 1 })
  else if (line) {
    line.quantidade = Math.min(20, line.quantidade + delta)
    if (line.quantidade <= 0) cart.value = cart.value.filter(l => l !== line)
  }
  orderKey = newKey()       // another cart, another order
  if (!cart.value.length) cartOpen.value = false
}

async function sendOrder () {
  orderError.value = ''
  sending.value = true
  try {
    await HTTPClient.post(url({ type: 'u', url: `${base.value}/order/` }), {
      client_key: orderKey,
      note: note.value || '',
      lines: cart.value.map(l => ({ product_id: l.id, quantidade: l.quantidade })),
    })
    cart.value = []
    note.value = ''
    orderKey = newKey()
    cartOpen.value = false
    message.value = tdc('Order sent: a member of staff confirms it.')
    clearTimeout(messageTimer)
    messageTimer = setTimeout(() => { message.value = '' }, 5000)
    await load()
  } catch (e) {
    orderError.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    sending.value = false
  }
}

function time (value) {
  return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function statusLabel (status) {
  return { pending: tdc('Waiting'), accepted: tdc('Accepted'), rejected: tdc('Rejected') }[status] || status
}

function waiting (kind) {
  return (page.value?.waiting || []).includes(kind)
}

async function load () {
  loading.value = true
  try {
    const { data } = await HTTPClient.get(url({ type: 'u', url: `${base.value}/` }))
    page.value = data
    notFound.value = false
  } catch (e) {
    if (e?.response?.status === 404) notFound.value = true
  } finally {
    loading.value = false
  }
}

async function call (kind) {
  if (waiting(kind)) return
  error.value = ''
  calling.value = kind
  try {
    await HTTPClient.post(url({ type: 'u', url: `${base.value}/call/` }), { kind })
    page.value = { ...page.value, waiting: [...(page.value.waiting || []), kind] }
    message.value = kind === 'bill' ? tdc('We are bringing your bill.') : tdc('A member of staff is on the way.')
    clearTimeout(messageTimer)
    messageTimer = setTimeout(() => { message.value = '' }, 5000)
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    calling.value = null
  }
}

function goTo (index) {
  current.value = index
  document.getElementById(`qr-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  load()
  timer = setInterval(load, 20000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(messageTimer)
})
</script>

<style scoped>
.qr-page { min-height: 100vh; background: #f5f6f8; color: #111827; padding-bottom: 120px; }
.qr-page--dark { background: #121214; color: #f3f4f6; }
.qr-center { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }

.qr-header {
  background: var(--brand);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.12));
  color: #fff;
  padding: 18px 16px 16px;
  border-radius: 0 0 24px 24px;
}
.qr-logo { width: 44px; height: 44px; border-radius: 50%; background: #fff; object-fit: contain; padding: 4px; margin-right: 12px; }
.qr-place { font-size: 1.2rem; font-weight: 700; }
.qr-branch { font-size: 0.8rem; opacity: 0.85; }
.qr-table { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 999px;
            background: rgba(255, 255, 255, 0.2); font-weight: 700; white-space: nowrap; }
.qr-tab { display: flex; justify-content: space-between; margin-top: 14px; padding: 10px 14px; border-radius: 14px;
          background: rgba(255, 255, 255, 0.16); font-size: 0.95rem; }

.qr-chips { position: sticky; top: 0; z-index: 2; display: flex; gap: 8px; overflow-x: auto; padding: 12px 16px;
            background: inherit; scrollbar-width: none; }
.qr-chips::-webkit-scrollbar { display: none; }
.qr-chip { flex: 0 0 auto; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(128, 128, 128, 0.3);
           background: transparent; color: inherit; font: inherit; font-size: 0.9rem; cursor: pointer; }
.qr-chip--active { background: var(--brand); border-color: var(--brand); color: #fff; }

.qr-menu { padding: 0 16px; max-width: 720px; margin: 0 auto; }
.qr-section { scroll-margin-top: 64px; }
.qr-section__title { font-size: 1.05rem; font-weight: 700; margin: 18px 0 8px; line-height: 1.2; }
.qr-item { display: flex; align-items: center; gap: 12px; padding: 10px; margin-bottom: 8px; border-radius: 16px;
           background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.qr-page--dark .qr-item { background: #1f1f24; }
.qr-item__media { width: 56px; height: 56px; border-radius: 12px; overflow: hidden; flex: 0 0 56px; display: flex;
                  align-items: center; justify-content: center; color: #fff; font-weight: 700; }
.qr-item__media img { width: 100%; height: 100%; object-fit: cover; }
.qr-item__name { font-weight: 600; line-height: 1.25; }
.qr-item__note { font-size: 0.75rem; opacity: 0.6; }
.qr-item__price { font-weight: 700; color: var(--brand); white-space: nowrap; }

.qr-actions { position: fixed; left: 0; right: 0; bottom: 0; padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
              background: rgba(245, 246, 248, 0.92); backdrop-filter: blur(8px); box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08); }
.qr-page--dark .qr-actions { background: rgba(18, 18, 20, 0.92); }
.qr-btn { min-height: 52px; }
.qr-stepper { gap: 6px; }
.qr-step { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(128, 128, 128, 0.35); background: transparent;
           color: inherit; font-size: 1.1rem; font-weight: 700; line-height: 1; cursor: pointer; }
.qr-step--add { background: var(--brand); border-color: var(--brand); color: #fff; }
.qr-step__qty { min-width: 18px; text-align: center; font-weight: 700; }
.qr-cartbar { display: flex; align-items: center; gap: 8px; width: 100%; margin-bottom: 8px; padding: 12px 16px; border: none;
              border-radius: 14px; background: var(--brand); color: #fff; font: inherit; font-size: 1rem; cursor: pointer; }
.qr-cartline { border-bottom: 1px solid rgba(128, 128, 128, 0.15); }
.qr-order { padding: 10px 12px; margin-bottom: 8px; border-radius: 14px; background: #fff; }
.qr-page--dark .qr-order { background: #1f1f24; }
.qr-order__status { font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: 999px; }
.qr-order__status--pending { background: #fff3cd; color: #8a6d00; }
.qr-order__status--accepted { background: #d1f2dd; color: #16794a; }
.qr-order__status--rejected { background: #fde2e1; color: #b42318; }
.qr-message { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;
              color: var(--q-positive); font-weight: 600; }
</style>
