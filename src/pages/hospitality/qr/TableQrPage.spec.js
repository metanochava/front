// The page a table's QR code opens (public): the place, the table, the menu by
// category and the tab's total; "call the waiter" / "ask for the bill" post
// once and then show they are on the way; an unknown token says so.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

const PAGE = {
  place: { name: 'Tsakane', branch: 'Mahubo', color: '#123456', logo: null },
  table: { name: 'Table 4', area: 'Room' },
  menu: [
    { category: 'Beers', items: [{ id: 'p1', nome: 'Beer', preco_base: '100.00', product_type: 'goods', imagem: null }] },
    { category: 'Services', items: [{ id: 's1', nome: 'Karaoke', preco_base: '800.00', product_type: 'service', imagem: null }] },
  ],
  tab: { total: '200.00', line_count: 2 },
  waiting: [],
}
const http = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(async () => ({ data: { kind: 'waiter', status: 'open' } })),
}))

vi.mock('vue-router', () => ({ useRoute: () => ({ params: { token: 'abc123' } }) }))
vi.mock('quasar_resaas', () => ({
  tdc: s => s,
  errorMessage: e => e?.message,
  url: ({ url }) => url,
  HTTPClient: http,
}))

const stubs = {
  's-btn': { props: ['label', 'loading'], emits: ['click'],
    template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)">{{ label }}<slot /></button>' },
  's-tooltip': { template: '<span />' },
  's-input': { props: ['modelValue'], emits: ['update:modelValue'],
    template: '<input v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue"><slot /></div>' },
  's-modal-card': { template: '<div><slot /><slot name="footer" /></div>' },
}

async function mountPage () {
  const { default: Page } = await import('./TableQrPage.vue')
  const w = mount(Page, { global: { plugins: [Quasar], stubs } })
  await flushPromises()
  return w
}

beforeEach(() => {
  http.get.mockClear()
  http.post.mockClear()
  http.get.mockImplementation(async () => ({ data: PAGE }))
})

describe('table QR page', () => {
  it('shows the table, the menu and the tab total', async () => {
    const w = await mountPage()
    expect(http.get).toHaveBeenCalledWith('hospitality/qr/abc123/')
    expect(w.find('[data-test="qr-table"]').text()).toContain('Table 4')
    expect(w.findAll('[data-test="qr-item"]').length).toBe(2)
    expect(w.find('[data-test="qr-tab"]').text()).toContain('200.00')
  })

  it('calls the waiter once and shows it is on the way', async () => {
    const w = await mountPage()
    await w.find('[data-test="qr-call-waiter"]').trigger('click')
    await flushPromises()
    expect(http.post).toHaveBeenCalledWith('hospitality/qr/abc123/call/', { kind: 'waiter' })
    expect(w.find('[data-test="qr-call-waiter"]').text()).toBe('The waiter is coming')
    await w.find('[data-test="qr-call-waiter"]').trigger('click')
    await flushPromises()
    expect(http.post).toHaveBeenCalledTimes(1)                       // already waiting
  })

  it('says when the table is unknown', async () => {
    http.get.mockImplementation(async () => { throw Object.assign(new Error('nf'), { response: { status: 404 } }) })
    const w = await mountPage()
    expect(w.find('[data-test="qr-not-found"]').exists()).toBe(true)
  })
})

describe('ordering from the table', () => {
  it('sends the chosen items once with a key and a note', async () => {
    http.post.mockImplementation(async () => ({ data: { id: 'o1', status: 'pending', lines: [] } }))
    const w = await mountPage()
    await w.findAll('[data-test="qr-item-add"]')[0].trigger('click')
    await w.findAll('[data-test="qr-item-add"]')[0].trigger('click')
    expect(w.find('[data-test="qr-cartbar"]').text()).toContain('2')
    await w.find('[data-test="qr-cartbar"]').trigger('click')
    await w.find('[data-test="qr-note"]').setValue('no ice')
    expect(w.find('[data-test="qr-cart-total"]').text()).toBe('200.00')
    await w.find('[data-test="qr-send"]').trigger('click')
    await flushPromises()
    const [path, body] = http.post.mock.calls[0]
    expect(path).toBe('hospitality/qr/abc123/order/')
    expect(body.lines).toEqual([{ product_id: 'p1', quantidade: 2 }])
    expect(body.note).toBe('no ice')
    expect(body.client_key).toMatch(/^[0-9a-f-]{36}$/)
    expect(w.find('[data-test="qr-cartbar"]').exists()).toBe(false)     // the cart is empty again
  })

  it('shows the table\'s orders with their status', async () => {
    http.get.mockImplementation(async () => ({ data: { ...PAGE, orders: [
      { id: 'o1', status: 'accepted', created_at: new Date().toISOString(), lines: [{ product_nome: 'Beer', quantidade: 2 }] },
    ] } }))
    const w = await mountPage()
    expect(w.find('[data-test="qr-order"]').text()).toContain('Accepted')
  })
})
