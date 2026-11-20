<template>
  <q-page class="pos-page column no-wrap q-pa-sm" :style-fn="pageHeight">

    <!-- tables (hospitality) + quick sale + open tabs -->
    <PosTabsBar
      :model-value="activeTabId" :tabs="tabs"
      :show-tables="canSeeTables" :tables-open="tablesOpen" :calling="callingCount"
      @update:model-value="selectTab" @new="newTabOpen = true" @tables="tablesOpen = !tablesOpen"
    />

    <div class="col row no-wrap pos-body">
      <!-- the tables, or the products -->
      <div class="col pos-body__products">
        <TablesBoard v-if="tablesOpen" :tables="board" :loading="boardLoading" :busy="busy"
                     @open="openTable" @handle="handleRequest" @orders="showOrders" />
        <TableOrdersDialog v-model="ordersOpen" :table="ordersTable" :busy="orderBusy" :error="orderError"
                           @accept="acceptOrder" @reject="rejectOrder" />
        <PosProductGrid v-show="!tablesOpen" ref="gridRef" :disabled="busy" @add="onAdd" />
      </div>

      <!-- the cart, beside the products on a tablet in landscape / a PC -->
      <s-card v-if="wide" flat bordered class="pos-body__cart q-ml-sm">
        <PosCart v-bind="cartProps" v-on="cartEvents">
          <template #settings><PosSettings /></template>
        </PosCart>
      </s-card>
    </div>

    <!-- phone / tablet in portrait: the cart is a bar at the bottom -->
    <button
      v-if="!wide"
      type="button"
      class="pos-cartbar"
      data-test="pos-cartbar"
      @click="cartSheet = true"
    >
      <q-icon :name="activeTab ? 'table_bar' : 'shopping_basket'" size="22px" />
      <span class="pos-cartbar__count">{{ itemCount }}</span>
      <span class="col text-left ellipsis q-ml-sm">{{ cartProps.title }}</span>
      <span class="text-weight-bold">{{ money(cartProps.totals.total) }}</span>
      <q-icon name="expand_less" size="22px" class="q-ml-xs" />
      <s-tooltip>{{ tdc('Show the cart') }}</s-tooltip>
    </button>

    <q-dialog v-model="cartSheet" position="bottom" :maximized="$q.screen.lt.sm">
      <s-modal-card :title="cartProps.title" :icon="activeTab ? 'table_bar' : 'bolt'" width="560px">
        <div class="pos-sheet">
          <PosCart v-bind="cartProps" :title="''" v-on="cartEvents">
            <template #settings><PosSettings /></template>
          </PosCart>
        </div>
      </s-modal-card>
    </q-dialog>

    <PosNewTabDialog v-model="newTabOpen" :saving="savingTab" :error="newTabError" @submit="createTab" />
    <PosSplitDialog v-model="splitOpen" :lines="activeTab?.lines || []" :saving="splitting" :error="splitError" @submit="doSplit" />
    <PosPaymentDialog v-model="paymentOpen" :sale-id="payingSaleId" :total="payingTotal" :methods="paymentMethods"
                      @paid="onPaid" @void="voidPaying" />

    <!-- receipt -->
    <q-dialog v-model="receiptOpen" persistent>
      <s-modal-card :title="tdc('Sale Completed')" icon="check_circle" width="400px" :closable="false">
        <div v-if="receipt" class="text-center">
          <q-icon name="check_circle" color="positive" size="56px" />
          <div class="text-caption text-grey-7">{{ tdc('Sale') }} #{{ receipt.saleId.slice(0, 8) }}</div>
          <div class="text-h4 text-weight-bold q-my-sm" data-test="receipt-total">{{ money(receipt.total) }}</div>
          <div v-for="(p, i) in receipt.pagamentos" :key="i" class="row justify-between q-py-xs">
            <span>{{ methodLabel(p.forma_pagamento) }}</span><span>{{ money(p.valor) }}</span>
          </div>
          <div v-if="receipt.totalTroco > 0" class="row justify-between q-py-xs text-positive text-weight-bold">
            <span>{{ tdc('Change') }}</span><span>{{ money(receipt.totalTroco) }}</span>
          </div>
        </div>
        <template #footer>
          <!-- the printed receipt: the Branch's default printer / paper, or choose -->
          <s-print-btn
            v-if="receipt"
            document="sales.receipt" :object-id="receipt.saleId"
            flat :label="tdc('Print receipt')"
            data-test="receipt-print"
          />
          <s-btn unelevated color="primary" icon="add_shopping_cart" :label="tdc('New Sale')" data-test="receipt-new" @click="afterReceipt">
            <s-tooltip>{{ tdc('Start a new sale') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, resolveComponent, watch } from 'vue'
import { useQuasar, QExpansionItem } from 'quasar'
import { tdc, url, HTTPAuth, errorMessage, useUserStore, sDialog } from 'quasar_resaas'
import { useSaleStore } from './saleStore'
import PosTabsBar from './pos/PosTabsBar.vue'
import PosProductGrid from './pos/PosProductGrid.vue'
import PosCart from './pos/PosCart.vue'
import PosPaymentDialog from './pos/PosPaymentDialog.vue'
import PosNewTabDialog from './pos/PosNewTabDialog.vue'
import PosSplitDialog from './pos/PosSplitDialog.vue'
// the tables are the hospitality module's: shown only with board_diningtable
import TablesBoard from 'src/pages/hospitality/pos/TablesBoard.vue'
import TableOrdersDialog from 'src/pages/hospitality/pos/TableOrdersDialog.vue'
import { useTableStore } from 'src/pages/hospitality/tableStore'

// The point of sale (add_sale), made for a bar on a phone or tablet:
// - QUICK SALE: a local cart sent once (Sale.checkout, prices from the
//   catalog for the customer, a checkout key against double sales);
// - OPEN TABS: named draft sales the branch's devices add to (Sale.order),
//   split ("each pays theirs") and close (Sale.closeTab), refreshed every
//   few seconds so every device sees the same tabs.
// Then the payment (split between methods) and the receipt.
const $q = useQuasar()
const Sale = useSaleStore()
const User = useUserStore()

const canUseStock = computed(() => User.can('list_warehouse'))
const canDiscount = computed(() => User.can('discount_sale'))
const wide = computed(() => $q.screen.gt.sm)          // >= md: cart beside the products

function pageHeight (offset, height) {
  return { height: `${height - offset}px` }
}

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function extractError (e) {
  return errorMessage(e) || tdc('An error occurred. Please try again.')
}

const gridRef = ref(null)
const cartSheet = ref(false)
const busy = ref(false)
const finishing = ref(false)
const cartError = ref('')

// ---------------- SETTINGS: customer / warehouse / tax ----------------
const customerId = ref(null)
const warehouseId = ref(null)
const taxId = ref(null)
const taxOptions = ref([])
const taxRate = computed(() => Number(taxOptions.value.find(o => o.value === taxId.value)?.rate || 0))
const customerSelectUrl = url({ type: 'u', url: 'sales/customers', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })

async function loadTaxes () {
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'sales/taxes', params: { active: 'true', page_size: 100 } }))
    taxOptions.value = (data.results || data || []).filter(t => t.active !== false)
      .map(t => ({ label: t.display_name || t.name, value: t.id, rate: t.rate }))
  } catch {
    taxOptions.value = []
  }
}

async function loadSingleWarehouse () {
  if (!canUseStock.value) return
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true', page_size: 2 } }))
    const rows = data.results ?? data
    if (rows.length === 1) warehouseId.value = rows[0].value
  } catch {
    // no warehouse yet
  }
}

// the quick sale's customer / warehouse / tax; on a tab only what closing
// uses (warehouse, tax) - the tab's customer was chosen when it was opened
const PosSettings = defineComponent({
  name: 'PosSettings',
  setup () {
    return () => {
      const SSelect = resolveComponent('s-select')
      const fields = []
      if (!activeTab.value) {
        fields.push(h(SSelect, {
          modelValue: customerId.value, 'onUpdate:modelValue': v => { customerId.value = v },
          api: customerSelectUrl, optionLabel: 'label', optionValue: 'value', emitValue: true, mapOptions: true,
          clearable: true, dense: true, disable: !!pendingSaleId.value,
          label: tdc('Customer') + ' (' + tdc('optional') + ')',
        }))
      }
      if (canUseStock.value) {
        fields.push(h(SSelect, {
          modelValue: warehouseId.value, 'onUpdate:modelValue': v => { warehouseId.value = v },
          api: warehouseSelectUrl, optionLabel: 'label', optionValue: 'value', emitValue: true, mapOptions: true,
          clearable: true, dense: true, label: tdc('Warehouse'),
          hint: !warehouseId.value ? tdc('Without a warehouse, the sale does not move stock') : '',
        }))
      }
      if (taxOptions.value.length) {
        fields.push(h(SSelect, {
          modelValue: taxId.value, 'onUpdate:modelValue': v => { taxId.value = v },
          options: taxOptions.value, emitValue: true, mapOptions: true, clearable: true, dense: true,
          label: tdc('Tax'), 'data-test': 'pos-tax',
        }))
      }
      if (!fields.length) return null
      return h(QExpansionItem, {
        dense: true, icon: 'tune', label: tdc('Options'),
        caption: [!activeTab.value && customerId.value ? tdc('Customer') : null, taxId.value ? tdc('Tax') : null].filter(Boolean).join(' · '),
        class: 'q-mb-sm pos-settings',
      }, () => h('div', { class: 'q-gutter-sm q-pa-xs' }, fields))
    }
  },
})


// ---------------- OPEN TABS ----------------
const tabs = ref([])
const activeTabId = ref(null)            // null = quick sale
const activeTab = ref(null)              // the tab with its lines
const newTabOpen = ref(false)
const savingTab = ref(false)
const newTabError = ref('')
const splitOpen = ref(false)
const splitting = ref(false)
const splitError = ref('')
let pollTimer = null

// ---------------- TABLES (hospitality) ----------------
const Table = useTableStore()
const canSeeTables = computed(() => User.can('board_diningtable'))
const tablesOpen = ref(false)
const board = ref([])
const boardLoading = ref(false)
const callingCount = computed(() => board.value.reduce((s, t) => s + (t.requests?.length || 0) + (t.orders?.length || 0), 0))

async function refreshBoard () {
  if (!canSeeTables.value) return
  boardLoading.value = true
  try {
    board.value = await Table.board()
  } catch {
    // keeps the last board
  } finally {
    boardLoading.value = false
  }
}

// a new call from a table's QR code shows wherever the staff are on the screen
watch(callingCount, (now, before) => {
  if (now > (before || 0)) {
    $q.notify?.({ type: 'warning', icon: 'notifications_active', message: tdc('A table is calling or ordering'), position: 'top' })
  }
})

function selectTab (id) {
  tablesOpen.value = false
  activeTabId.value = id
}

// a table's tab: the one it has, else a new one (the same from any device)
async function openTable (table) {
  cartError.value = ''
  busy.value = true
  try {
    const tabId = await Table.startTab(table.id)
    await refreshTabs()
    selectTab(tabId)
  } catch (e) {
    cartError.value = extractError(e)
  } finally {
    busy.value = false
  }
  refreshBoard()
}

// the QR code's orders of a table: accept (on its tab) or reject
const ordersOpen = ref(false)
const ordersTableId = ref(null)
const ordersTable = computed(() => board.value.find(t => t.id === ordersTableId.value) || null)
const orderBusy = ref(null)
const orderError = ref('')

function showOrders (table) {
  orderError.value = ''
  ordersTableId.value = table.id
  ordersOpen.value = true
}

async function decideOrder (order, accept) {
  orderError.value = ''
  orderBusy.value = (accept ? 'a' : 'r') + order.id
  try {
    if (accept) await Table.acceptOrder(order.id)
    else await Table.rejectOrder(order.id)
    await refreshBoard()
    if (!ordersTable.value?.orders?.length) ordersOpen.value = false
    if (accept) await refreshTabs()
  } catch (e) {
    orderError.value = extractError(e)
  } finally {
    orderBusy.value = null
  }
}

const acceptOrder = (order) => decideOrder(order, true)
const rejectOrder = (order) => decideOrder(order, false)

async function handleRequest (request) {
  try {
    await Table.handleRequest(request.id)
  } catch (e) {
    cartError.value = extractError(e)
  }
  refreshBoard()
}

async function refreshTabs () {
  refreshBoard()
  try {
    tabs.value = await Sale.openTabs()
  } catch {
    // keeps the last list; the next refresh tries again
  }
  if (activeTabId.value && !tabs.value.some(t => t.id === activeTabId.value) && !payingSaleId.value) {
    // closed / voided on another device
    activeTabId.value = null
  } else if (activeTabId.value && !busy.value) {
    await loadActiveTab()
  }
}

async function loadActiveTab () {
  if (!activeTabId.value) { activeTab.value = null; return }
  try {
    activeTab.value = await Sale.getTab(activeTabId.value)
  } catch (e) {
    cartError.value = extractError(e)
  }
}

watch(activeTabId, () => {
  cartError.value = ''
  activeTab.value = null
  loadActiveTab()
})

async function createTab (payload) {
  newTabError.value = ''
  savingTab.value = true
  try {
    const tab = await Sale.openTab({ ...payload, warehouse_id: warehouseId.value })
    newTabOpen.value = false
    await refreshTabs()
    activeTabId.value = tab.id
    activeTab.value = tab
  } catch (e) {
    newTabError.value = extractError(e)
  } finally {
    savingTab.value = false
  }
}

// every order answers the tab; a tab closed elsewhere (409) leaves the screen
async function onTab (call) {
  cartError.value = ''
  busy.value = true
  try {
    activeTab.value = await call()
    const row = tabs.value.find(t => t.id === activeTab.value.id)
    if (row) Object.assign(row, { total: activeTab.value.total, line_count: activeTab.value.lines.length })
  } catch (e) {
    cartError.value = extractError(e)
    if (e?.response?.status === 409) await refreshTabs()
  } finally {
    busy.value = false
  }
}

async function doSplit (payload) {
  splitError.value = ''
  splitting.value = true
  try {
    const newTab = await Sale.splitTab(activeTabId.value, payload)
    splitOpen.value = false
    await refreshTabs()
    activeTabId.value = newTab.id
  } catch (e) {
    splitError.value = extractError(e)
  } finally {
    splitting.value = false
  }
}

// ---------------- QUICK SALE (local cart, one checkout) ----------------
const cart = ref([])
const pendingSaleId = ref(null)
const quoteTimers = new Map()

function newCheckoutKey () {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
// one key per cart: a retry of the same cart returns its sale; a changed cart
// is a new cart
let checkoutKey = newCheckoutKey()
function cartChanged () {
  if (!pendingSaleId.value) checkoutKey = newCheckoutKey()
}

async function requote (line) {
  line.quoting = true
  try {
    const price = await Sale.quote({ product: line.product_id, quantidade: line.quantidade || 1, customer: customerId.value })
    line.preco_unitario = Number(price?.price) || 0
    line.priceError = false
  } catch {
    line.priceError = true
  } finally {
    line.quoting = false
  }
}

function setQuickQty (line, quantity) {
  line.quantidade = quantity
  cartChanged()
  clearTimeout(quoteTimers.get(line.product_id))
  quoteTimers.set(line.product_id, setTimeout(() => requote(line), 400))
}

function addQuick (product) {
  const id = product.id || product.value
  const existing = cart.value.find(l => l.product_id === id)
  if (existing) return setQuickQty(existing, Number(existing.quantidade) + 1)
  const line = reactive({
    key: id, product_id: id, product_nome: product.nome || product.label, quantidade: 1,
    preco_unitario: Number(product.preco_base) || 0, desconto_valor: 0, quoting: false, priceError: false,
  })
  cart.value.push(line)
  cartChanged()
  requote(line)
}

watch(customerId, () => {
  cartChanged()
  cart.value.forEach(requote)
})
watch([warehouseId, taxId], cartChanged)

// ---------------- THE CART SHOWN ----------------
const quickTotals = computed(() => {
  const subtotal = cart.value.reduce((s, l) => s + Number(l.quantidade || 0) * Number(l.preco_unitario || 0), 0)
  const desconto = cart.value.reduce((s, l) => s + Number(l.desconto_valor || 0), 0)
  const tax = cart.value.reduce((s, l) => {
    const net = Number(l.quantidade || 0) * Number(l.preco_unitario || 0) - Number(l.desconto_valor || 0)
    return s + Math.round(net * taxRate.value) / 100
  }, 0)
  return { subtotal, desconto, tax, total: subtotal - desconto + tax }
})

const tabLines = computed(() => (activeTab.value?.lines || []).map(l => ({ ...l, key: l.id })))

const cartProps = computed(() => {
  if (activeTabId.value) {
    const tab = activeTab.value
    const t = tab || {}
    return {
      mode: 'tab',
      title: tab?.tab_label || tabs.value.find(x => x.id === activeTabId.value)?.tab_label || '',
      subtitle: tab?.customer_label || '',
      lines: tabLines.value,
      totals: { subtotal: Number(t.subtotal || 0), desconto: Number(t.desconto_total || 0), tax: Number(t.tax_total || 0), total: Number(t.total || 0) },
      canDiscount: canDiscount.value,
      canFinish: !!tab && tab.lines.length > 0 && !busy.value,
      busy: busy.value || !tab,
      finishing: finishing.value,
      error: cartError.value,
    }
  }
  return {
    mode: 'quick',
    title: tdc('Quick sale'),
    subtitle: '',
    lines: cart.value,
    totals: quickTotals.value,
    canDiscount: canDiscount.value,
    canFinish: cart.value.length > 0 && !pendingSaleId.value &&
      cart.value.every(l => !l.quoting && !l.priceError && Number(l.quantidade) > 0),
    busy: !!pendingSaleId.value,
    finishing: finishing.value,
    error: cartError.value,
  }
})

const itemCount = computed(() => cartProps.value.lines.reduce((s, l) => s + Number(l.quantidade || 0), 0))

function onAdd (product) {
  if (activeTabId.value) {
    onTab(() => Sale.order(activeTabId.value, { product_id: product.id || product.value, delta: 1 }))
  } else if (!pendingSaleId.value) {
    addQuick(product)
  }
}

const cartEvents = {
  inc (line) {
    if (activeTabId.value) return onTab(() => Sale.order(activeTabId.value, { product_id: line.product_id, delta: 1 }))
    setQuickQty(line, Number(line.quantidade) + 1)
  },
  dec (line) {
    if (activeTabId.value) return onTab(() => Sale.order(activeTabId.value, { product_id: line.product_id, delta: -1 }))
    if (Number(line.quantidade) > 1) setQuickQty(line, Number(line.quantidade) - 1)
    else cartEvents.remove(line)
  },
  remove (line) {
    if (activeTabId.value) {
      return onTab(() => Sale.order(activeTabId.value, { product_id: line.product_id, delta: -Number(line.quantidade) }))
    }
    cart.value = cart.value.filter(l => l !== line)
    cartChanged()
  },
  discount (line, value) {
    if (activeTabId.value) return onTab(() => Sale.discountLine(activeTabId.value, { item: line.id, desconto_valor: Number(value) || 0 }))
    line.desconto_valor = Number(value) || 0
    cartChanged()
  },
  finish () { return finish() },
  split () { splitError.value = ''; splitOpen.value = true },
  void () { return voidCurrent() },
}

// ---------------- FINISH: confirm, then pay ----------------
const paymentOpen = ref(false)
const payingSaleId = ref(null)
const payingTotal = ref(0)
const paymentMethods = ref([])
const receiptOpen = ref(false)
const receipt = ref(null)

async function loadPaymentMethods () {
  try {
    paymentMethods.value = (await Sale.paymentMethods()).map(m => ({ value: m.value, label: tdc(m.label) }))
  } catch {
    paymentMethods.value = []
  }
}

function methodLabel (value) {
  return paymentMethods.value.find(m => m.value === value)?.label || value
}

async function finish () {
  cartError.value = ''
  finishing.value = true
  try {
    let sale
    if (activeTabId.value) {
      sale = await Sale.closeTab(activeTabId.value, { tax: taxId.value, warehouse_id: warehouseId.value })
    } else {
      sale = await Sale.checkout({
        checkout_key: checkoutKey,
        customer: customerId.value || null,
        warehouse_id: warehouseId.value || null,
        tax: taxId.value || null,
        lines: cart.value.map(l => ({
          product_id: l.product_id,
          quantidade: l.quantidade,
          desconto_valor: canDiscount.value ? (l.desconto_valor || 0) : 0,
        })),
      })
      pendingSaleId.value = sale.id
    }
    payingSaleId.value = sale.id
    // the backend total is authoritative (price list, taxes, rounding)
    payingTotal.value = Number(sale.saldo_devedor ?? sale.total)
    cartSheet.value = false
    paymentOpen.value = true
  } catch (e) {
    cartError.value = extractError(e)
  } finally {
    finishing.value = false
  }
}

function onPaid (result) {
  paymentOpen.value = false
  receipt.value = result
  receiptOpen.value = true
}

function resetQuick () {
  cart.value = []
  pendingSaleId.value = null
  customerId.value = null
  taxId.value = null
  checkoutKey = newCheckoutKey()
}

async function afterReceipt () {
  receiptOpen.value = false
  receipt.value = null
  payingSaleId.value = null
  if (activeTabId.value) {
    activeTabId.value = null
    await refreshTabs()
  } else {
    resetQuick()
  }
  cartError.value = ''
  gridRef.value?.focus?.()
}

// cancelling the payment voids the confirmed sale (stock goes back)
async function voidPaying () {
  const id = payingSaleId.value
  paymentOpen.value = false
  if (id) {
    try { await Sale.anular(id) } catch { /* already voided / paid */ }
  }
  payingSaleId.value = null
  if (activeTabId.value) {
    activeTabId.value = null
    await refreshTabs()
  } else {
    resetQuick()
  }
}

function voidCurrent () {
  if (!activeTabId.value) {
    if (pendingSaleId.value) return voidPaying()
    resetQuick()
    return
  }
  const tab = activeTab.value
  sDialog({
    title: tdc('Void tab'),
    message: tdc('Void the tab "{name}"? What was ordered is not charged.').replace('{name}', tab?.tab_label || ''),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    busy.value = true
    try {
      await Sale.anular(activeTabId.value)
      activeTabId.value = null
      await refreshTabs()
    } catch (e) {
      cartError.value = extractError(e)
    } finally {
      busy.value = false
    }
  })
}

// ---------------- LIFECYCLE ----------------
function onVisible () {
  if (document.visibilityState === 'visible') refreshTabs()
}

onMounted(() => {
  loadTaxes()
  loadPaymentMethods()
  loadSingleWarehouse()
  refreshTabs()
  pollTimer = setInterval(refreshTabs, 15000)
  document.addEventListener('visibilitychange', onVisible)
})

onBeforeUnmount(() => {
  clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisible)
})
</script>

<style scoped>
.pos-page { overflow: hidden; }
.pos-body { min-height: 0; }
.pos-body__products { min-width: 0; min-height: 0; }
.pos-body__cart { width: 380px; flex: 0 0 380px; padding: 12px; border-radius: 16px; min-height: 0; }
.pos-sheet { height: min(70vh, 640px); }

.pos-cartbar {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  background: var(--q-primary);
  color: #fff;
  font: inherit;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  -webkit-tap-highlight-color: transparent;
}
.pos-cartbar__count {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.25);
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 24px;
}
</style>
