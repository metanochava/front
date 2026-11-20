import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { reactive } from 'vue'

const push = vi.fn()
const params = vi.hoisted(() => ({ value: {} }))
const can = new Set(['add_customer', 'change_customer', 'view_customer'])
vi.mock('vue-router', () => ({ useRoute: () => ({ params: params.value }), useRouter: () => ({ push, back: vi.fn(), hasRoute: () => true }) }))
vi.mock('quasar_resaas', () => ({ tdc: t => t, url: ({ url }) => url, useUserStore: () => ({ can: p => can.has(p) }) }))

const store = reactive({
  loading: false, fields: [{ name: 'person', type: 'ForeignKey' }], form: {}, row: null, errors: {},
  init: vi.fn(async () => {}),
  resetForm: vi.fn(function () { store.form = {} }),
  getById: vi.fn(async () => ({ id: 'c1', customer_type: { value: 'company', label: 'Company' }, company_name: 'ACME', person: null })),
  save: vi.fn(async () => ({ id: 'new1' })),
})
vi.mock('./customerStore', () => ({ useCustomerStore: () => store }))

import CustomerSEPage from './CustomerSEPage.vue'

const stubs = {
  'q-page': { template: '<div><slot /></div>' }, 's-card': { template: '<div><slot /></div>' }, 's-tooltip': { template: '<span />' },
  's-btn': { props: ['label', 'disable'], emits: ['click'], template: '<button v-bind="$attrs" :disabled="disable" @click="$emit(\'click\')">{{ label }}</button>' },
  's-field': { props: ['modelValue'], template: '<div data-test="person-field" />' },
  's-input': { props: ['modelValue', 'label'], emits: ['update:modelValue'], template: '<input :data-label="label" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  's-select': { template: '<div />' }, 's-toggle': { template: '<div />' },
  'q-btn-toggle': { props: ['modelValue', 'options'], emits: ['update:modelValue'],
    template: '<div><button v-for="o in options" :key="o.value" :data-test="`type-${o.value}`" @click="$emit(\'update:modelValue\', o.value)">{{ o.label }}</button></div>' },
}

const mountPage = () => mount(CustomerSEPage, { global: { plugins: [Quasar], stubs } })

beforeEach(() => { params.value = {}; push.mockClear(); store.save.mockClear(); store.errors = {} })

describe('add_customer / change_customer', () => {
  it('a new customer is an individual: the person shows, the company name does not', async () => {
    const w = mountPage()
    await flushPromises()

    expect(store.form.customer_type).toBe('individual')
    expect(w.find('[data-test="customer-person"]').exists()).toBe(true)
    expect(w.find('[data-test="customer-company"]').exists()).toBe(false)
  })

  it('choosing company shows its name and clears the person', async () => {
    const w = mountPage()
    await flushPromises()
    store.form.person = 'p1'

    await w.find('[data-test="type-company"]').trigger('click')

    expect(store.form.person).toBeNull()
    expect(w.find('[data-test="customer-company"]').exists()).toBe(true)
    expect(w.find('[data-test="customer-person"]').exists()).toBe(false)
  })

  it('saving goes through the store and opens the customer', async () => {
    const w = mountPage()
    await flushPromises()

    await w.find('[data-test="customer-save"]').trigger('click')
    await flushPromises()

    expect(store.save).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith({ name: 'view_customer', params: { id: 'new1' } })
  })

  it('editing a company loads it with its name', async () => {
    params.value = { id: 'c1' }
    const w = mountPage()
    await flushPromises()

    expect(w.find('[data-test="customer-form-title"]').text()).toBe('Edit customer')
    expect(w.find('[data-test="customer-company"]').exists()).toBe(true)
  })
})
