// The clinic's exams and prices on its public site (saude/publicsite/): the
// exams section lists the real exams with their price or "Price on request",
// searches and opens an exam's details in a modal; the modal shows what the
// price includes; a consultation's "Book appointment" preselects its specialty.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createPinia, setActivePinia } from 'pinia'

const push = vi.fn(async () => {})
const replies = {}
vi.mock('vue-router', () => ({ useRouter: () => ({ push, back: vi.fn(), currentRoute: { value: { name: 'home' } } }) }))
vi.mock('quasar_resaas', () => ({
  tdc: s => s,
  useUserStore: () => ({ ps: {} }),
  url: ({ url }) => url,
  HTTPClient: { get: vi.fn(async (path) => ({ data: replies[path] })) },
}))

const EXAMS = [
  { id: 'e1', code: 'HEM', name: 'Blood count', type: 'Laboratory', class: 'Haematology', price: '900.00' },
  { id: 'e2', code: 'RX', name: 'X-ray', type: 'Imaging', class: 'Radiology', price: null },
]
replies['saude/publicsite/exams/'] = EXAMS
replies['saude/publicsite/exams/e1/'] = {
  ...EXAMS[0], preparation: '8h fast', sample: 'Blood', result_hours: 24, images: [],
  includes: [{ name: 'Blood count', quantity: '1', total: '800.00' }, { name: 'Tube', quantity: '2', total: '100.00' }],
}
replies['saude/publicsite/consultations/c1/'] = {
  key: 'c1', title: 'Cardiology', general: false, price: '3000.00', includes: [], images: [],
  doctors: [{ id: 'd1', name: 'Ana Doctor', specialties: [{ id: 'c1', title: 'Cardiology' }] }],
}

const stubs = {
  's-card': { emits: ['click'], template: '<div v-bind="$attrs" @click="$emit(\'click\')"><slot /></div>' },
  's-btn': { props: ['label'], emits: ['click'], template: '<button v-bind="$attrs" @click.stop="$emit(\'click\', $event)">{{ label }}<slot /></button>' },
  's-tooltip': { template: '<span />' },
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue" data-test="dialog"><slot /></div>' },
  's-modal-card': { props: ['title'], template: '<div><h3>{{ title }}</h3><slot /><slot name="footer" /></div>' },
  's-input': { props: ['modelValue'], emits: ['update:modelValue'],
    template: '<input data-test="exams-search" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
}
const mountIt = async (component, props = {}) => {
  const w = mount(component, { props, global: { plugins: [Quasar], stubs } })
  await flushPromises()
  return w
}

beforeEach(() => { setActivePinia(createPinia()); push.mockClear() })

describe('exams section', () => {
  it('lists the exams with the price or price on request and opens one in a modal', async () => {
    const { default: ExamesPage } = await import('./ExamesPage.vue')
    const w = await mountIt(ExamesPage)
    const cards = w.findAll('[data-test="exam-card"]')
    expect(cards.length).toBe(2)
    expect(cards[0].text()).toContain('900,00 MZN')
    expect(cards[1].text()).toContain('Price on request')

    await w.find('input[data-test="exams-search"]').setValue('raio x')
    expect(w.findAll('[data-test="exam-card"]').length).toBe(0)
    await w.find('input[data-test="exams-search"]').setValue('x-ray')
    expect(w.findAll('[data-test="exam-card"]').length).toBe(1)

    expect(w.find('[data-test="dialog"]').exists()).toBe(false)
    await w.find('input[data-test="exams-search"]').setValue('blood')
    await w.find('[data-test="exam-card"]').trigger('click')
    await flushPromises()
    expect(w.find('[data-test="dialog"]').exists()).toBe(true)
    expect(w.find('[data-test="offer-price"]').text()).toBe('900,00 MZN')
    expect(push).not.toHaveBeenCalled()      // a modal, not another page
  })
})

describe('offer modal', () => {
  it('shows an exam with what its price includes', async () => {
    const { default: OfferDetailDialog } = await import('./OfferDetailDialog.vue')
    const w = await mountIt(OfferDetailDialog, { modelValue: true, kind: 'exam', id: 'e1' })
    expect(w.find('[data-test="offer-price"]').text()).toBe('900,00 MZN')
    const includes = w.find('[data-test="offer-includes"]').text()
    expect(includes).toContain('Tube')
    expect(includes).toContain('100,00 MZN')
    expect(w.text()).toContain('8h fast')
  })

  it('books a consultation with its specialty', async () => {
    const { default: OfferDetailDialog } = await import('./OfferDetailDialog.vue')
    const { usePublicBooking } = await import('../usePublicBooking')
    const w = await mountIt(OfferDetailDialog, { modelValue: true, kind: 'consultation', id: 'c1' })
    expect(w.text()).toContain('Ana Doctor')
    await w.find('[data-test="offer-book"]').trigger('click')
    expect(usePublicBooking().state.preselect).toEqual({ doctor: null, specialty: 'c1' })
    expect(w.emitted('update:modelValue').at(-1)).toEqual([false])   // the modal closes
  })

  it('says when the exam does not exist', async () => {
    const { default: OfferDetailDialog } = await import('./OfferDetailDialog.vue')
    const w = await mountIt(OfferDetailDialog, { modelValue: true, kind: 'exam', id: 'missing' })
    expect(w.find('[data-test="offer-not-found"]').exists()).toBe(true)
  })
})
