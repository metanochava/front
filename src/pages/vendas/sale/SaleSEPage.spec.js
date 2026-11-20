// The point of sale (add_sale) for a bar:
// - quick sale: the local cart shows the customer's price (Sale.quote), is
//   sent once without prices (Sale.checkout) with a checkout key - the same
//   key on a retry of the same cart, a new one after it changes - and paid
//   with the server's total;
// - open tabs: listed from the server, a tapped product is an order on the
//   active tab (Sale.order +1 / -1), a new tab, splitting, and closing the
//   tab (Sale.closeTab) before the payment;
// - a discount only with discount_sale.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

const can = new Set()
const TAB = {
  id: 't1', tab_label: 'Table 4', estado: 'rascunho', customer_label: null, total: '200.00', subtotal: '200.00',
  desconto_total: '0', tax_total: '0', saldo_devedor: '200.00', created_at: new Date().toISOString(),
  lines: [{ id: 'l1', product_id: 'p1', product_nome: 'Beer', quantidade: '2', preco_unitario: '100.00', desconto_valor: '0' }],
}
const store = {
  checkout: vi.fn(),
  quote: vi.fn(async () => ({ price: '80.00', price_list: 'pl1' })),
  paymentMethods: vi.fn(async () => [{ value: 'numerario', label: 'Cash' }, { value: 'mpesa', label: 'M-Pesa' }]),
  pagar: vi.fn(async () => ({ sale: { estado: 'paga', total: '160.00' } })),
  anular: vi.fn(async () => ({})),
  openTabs: vi.fn(async () => []),
  openTab: vi.fn(async ({ tab_label }) => ({ ...TAB, id: 't9', tab_label, lines: [] })),
  getTab: vi.fn(async () => TAB),
  order: vi.fn(async () => TAB),
  discountLine: vi.fn(async () => TAB),
  splitTab: vi.fn(async () => ({ ...TAB, id: 't2', tab_label: 'Table 4 (2)' })),
  closeTab: vi.fn(async () => ({ id: 't1', total: '200.00', saldo_devedor: '200.00' })),
}
const PRODUCTS = [{ id: 'p1', nome: 'Beer', codigo: 'B1', preco_base: '100.00' }]

vi.mock('./saleStore', () => ({ useSaleStore: () => store }))
const tableStore = {
  board: vi.fn(async () => [
    { id: 'tb4', name: 'Table 4', seats: 4, area: { id: 'a1', name: 'Room' }, state: 'free', tab: null,
      requests: [{ id: 'r1', kind: 'waiter' }],
      orders: [{ id: 'o1', status: 'pending', note: 'no ice', created_at: new Date().toISOString(),
                 lines: [{ product_nome: 'Beer', quantidade: 2 }] }] },
  ]),
  startTab: vi.fn(async () => 't1'),
  handleRequest: vi.fn(async () => ({})),
  acceptOrder: vi.fn(async () => ({ id: 'o1', status: 'accepted' })),
  rejectOrder: vi.fn(async () => ({ id: 'o1', status: 'rejected' })),
}
vi.mock('src/pages/hospitality/tableStore', () => ({ useTableStore: () => tableStore }))
vi.mock('src/components/CameraScannerDialog.vue', () => ({ default: { template: '<div />' } }))
vi.mock('quasar_resaas', () => ({
  tdc: s => s,
  errorMessage: e => e?.message,
  sDialog: () => ({ onOk: (fn) => fn() }),
  useUserStore: () => ({ can: (p) => can.has(p), ps: {} }),
  url: ({ url }) => url,
  HTTPAuth: {
    get: vi.fn(async (path) => {
      if (path === 'catalog/products') return { data: { results: PRODUCTS } }
      return { data: { results: [] } }
    }),
  },
}))

const stubs = {
  'q-page': { template: '<div><slot /></div>' },
  's-card': { template: '<div><slot /></div>' },
  's-btn': { props: ['label', 'disable', 'loading'], emits: ['click'],
    template: '<button v-bind="$attrs" :disabled="disable" @click="$emit(\'click\', $event)">{{ label }}<slot /></button>' },
  's-tooltip': { template: '<span />' },
  's-select': { props: ['modelValue', 'options'], template: '<div data-test="select" />' },
  's-input': { props: ['modelValue'], emits: ['update:modelValue'],
    template: '<input v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue" data-test="dialog"><slot /></div>' },
  's-modal-card': { template: '<div><slot /><slot name="footer" /></div>' },
  's-print-btn': { props: ['document', 'objectId'], template: '<button data-test="receipt-print" :data-document="document" :data-object="objectId" />' },
}

async function mountPOS () {
  const { default: Page } = await import('./SaleSEPage.vue')
  const w = mount(Page, { global: { plugins: [Quasar], stubs } })
  await flushPromises()
  return w
}

// on a narrow screen the cart is behind the bottom bar
async function showCart (w) {
  const bar = w.find('[data-test="pos-cartbar"]')
  if (bar.exists()) { await bar.trigger('click'); await flushPromises() }
}

async function tapBeer (w) {
  await w.find('[data-test="pos-product"]').trigger('click')
  await flushPromises()
}

async function click (w, test) {
  await w.find(`[data-test="${test}"]`).trigger('click')
  await flushPromises()
}

beforeEach(() => {
  can.clear()
  Object.values(store).forEach(fn => fn.mockClear())
  Object.values(tableStore).forEach(fn => fn.mockClear())
  store.openTabs.mockImplementation(async () => [])
  store.checkout.mockImplementation(async () => ({ id: 'sale-1', total: '160.00', saldo_devedor: '160.00' }))
})

describe('quick sale', () => {
  it('shows the price checkout will charge, sends the cart once and pays the server total', async () => {
    const w = await mountPOS()
    await tapBeer(w)
    await tapBeer(w)                                   // the same product: quantity 2
    await showCart(w)
    expect(store.quote).toHaveBeenCalledWith({ product: 'p1', quantidade: 1, customer: null })
    expect(w.find('[data-test="cart-line-price"]').text()).toBe('80.00')

    await click(w, 'pos-finish')
    expect(store.checkout).toHaveBeenCalledTimes(1)
    const payload = store.checkout.mock.calls[0][0]
    expect(payload.lines).toEqual([{ product_id: 'p1', quantidade: 2, desconto_valor: 0 }])
    expect(payload.checkout_key).toMatch(/^[0-9a-f-]{36}$/)
    expect(w.find('[data-test="payment-total"]').text()).toBe('160.00')

    await click(w, 'payment-confirm')
    expect(store.pagar).toHaveBeenCalledWith('sale-1', { valor: 160, forma_pagamento: 'numerario', referencia: null })
    expect(w.find('[data-test="receipt-total"]').text()).toBe('160.00')
    // the printed receipt of that sale
    const print = w.find('[data-test="receipt-print"]')
    expect(print.attributes('data-document')).toBe('sales.receipt')
    expect(print.attributes('data-object')).toBeTruthy()
  })

  it('retries the same cart with the same key, a changed cart with a new one', async () => {
    store.checkout.mockRejectedValue(new Error('Network Error'))
    const w = await mountPOS()
    await tapBeer(w)
    await showCart(w)
    await click(w, 'pos-finish')
    expect(w.find('[data-test="pos-error"]').text()).toBe('Network Error')
    await click(w, 'pos-finish')
    const [first, second] = store.checkout.mock.calls.map(c => c[0].checkout_key)
    expect(second).toBe(first)

    await click(w, 'cart-line-inc')                    // the cart changed
    await click(w, 'pos-finish')
    expect(store.checkout.mock.calls[2][0].checkout_key).not.toBe(first)
  })

  it('offers a discount only with discount_sale', async () => {
    let w = await mountPOS()
    await tapBeer(w)
    await showCart(w)
    expect(w.find('[data-test="cart-line-discount"]').exists()).toBe(false)

    can.add('discount_sale')
    w = await mountPOS()
    await tapBeer(w)
    await showCart(w)
    await w.find('[data-test="cart-line-discount"]').setValue('10')
    await click(w, 'pos-finish')
    expect(Number(store.checkout.mock.calls[0][0].lines[0].desconto_valor)).toBe(10)
  })
})

describe('open tabs', () => {
  beforeEach(() => {
    store.openTabs.mockImplementation(async () => [{ ...TAB, line_count: 1 }])
  })

  it('a tapped product is an order on the active tab; the steppers order and take back', async () => {
    const w = await mountPOS()
    expect(w.findAll('[data-test="pos-tab"]').length).toBe(1)
    await click(w, 'pos-tab')
    expect(store.getTab).toHaveBeenCalledWith('t1')

    await tapBeer(w)
    expect(store.order).toHaveBeenLastCalledWith('t1', { product_id: 'p1', delta: 1 })
    expect(store.checkout).not.toHaveBeenCalled()

    await showCart(w)
    await click(w, 'cart-line-dec')
    expect(store.order).toHaveBeenLastCalledWith('t1', { product_id: 'p1', delta: -1 })
    await click(w, 'cart-line-remove')
    expect(store.order).toHaveBeenLastCalledWith('t1', { product_id: 'p1', delta: -2 })
  })

  it('closes the tab before taking the payment', async () => {
    const w = await mountPOS()
    await click(w, 'pos-tab')
    await showCart(w)
    await click(w, 'pos-finish')
    expect(store.closeTab).toHaveBeenCalledWith('t1', { tax: null, warehouse_id: null })
    expect(w.find('[data-test="payment-total"]').text()).toBe('200.00')
  })

  it('opens a new tab and makes it the active one', async () => {
    const w = await mountPOS()
    await click(w, 'pos-new-tab')
    await w.find('[data-test="new-tab-label"]').setValue('João')
    await click(w, 'new-tab-submit')
    expect(store.openTab).toHaveBeenCalledWith({ tab_label: 'João', customer: null, warehouse_id: null })
  })

  it('splits chosen units to a new tab', async () => {
    const w = await mountPOS()
    await click(w, 'pos-tab')
    await showCart(w)
    await click(w, 'pos-split')
    await click(w, 'split-inc')
    await click(w, 'split-submit')
    expect(store.splitTab).toHaveBeenCalledWith('t1', { items: [{ item: 'l1', quantidade: 1 }], tab_label: null })
  })
})

describe('tables (hospitality)', () => {
  it('are hidden without board_diningtable', async () => {
    const w = await mountPOS()
    expect(w.find('[data-test="pos-tables"]').exists()).toBe(false)
    expect(tableStore.board).not.toHaveBeenCalled()
  })

  it('show the board with the calls; a table opens its tab; a call is handled', async () => {
    can.add('board_diningtable')
    store.openTabs.mockImplementation(async () => [{ ...TAB, line_count: 1 }])
    const w = await mountPOS()
    expect(w.find('[data-test="pos-tables-calling"]').text()).toBe('2')     // a call and an order
    await click(w, 'pos-tables')
    expect(w.findAll('[data-test="pos-table"]').length).toBe(1)

    await click(w, 'pos-table-request')
    expect(tableStore.handleRequest).toHaveBeenCalledWith('r1')

    await w.find('[data-test="pos-table"] .pos-table__open').trigger('click')
    await flushPromises()
    expect(tableStore.startTab).toHaveBeenCalledWith('tb4')
    expect(store.getTab).toHaveBeenCalledWith('t1')
    expect(w.find('[data-test="pos-table"]').exists()).toBe(false)     // back to the products, on the tab
  })

  it('accepts a table\'s order from the QR code', async () => {
    can.add('board_diningtable')
    const w = await mountPOS()
    await click(w, 'pos-tables')
    await click(w, 'pos-table-orders')
    expect(w.find('[data-test="table-order"]').text()).toContain('Beer')
    await click(w, 'order-accept')
    expect(tableStore.acceptOrder).toHaveBeenCalledWith('o1')
  })
})
