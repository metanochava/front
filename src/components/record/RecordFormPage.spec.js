import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

const can = new Set()
const push = vi.fn()
const schemaOf = vi.hoisted(() => ({ value: null }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push, back: vi.fn(), hasRoute: () => true }) }))
vi.mock('quasar_resaas', () => ({
  tdc: (t) => t,
  url: ({ url }) => url,
  HTTPAuth: { get: vi.fn(async () => ({ data: { id: 'c1', company_name: 'ACME' } })) },
  buildFormFromSchema: vi.fn(async () => ({ schema: schemaOf.value, fields: [{ name: 'company_name' }] })),
  useUserStore: () => ({ can: (p) => can.has(p) })
}))
vi.mock('./fieldAccess', () => ({ applyFieldAccess: (fields) => fields }))

import RecordFormPage from './RecordFormPage.vue'

const FormStub = { name: 'SForm', props: ['store'], emits: ['saved'], template: '<div data-test="form" />', methods: { save () { this.$emit('saved', { id: 'new1' }) } } }
const stubs = {
  's-form': FormStub, 's-card': { template: '<div><slot /></div>' }, 's-tooltip': { template: '<span />' },
  's-btn': { props: ['label'], emits: ['click'], template: '<button v-bind="$attrs" @click="$emit(\'click\')">{{ label }}</button>' },
  'q-page': { template: '<div><slot /></div>' },
}

const mountPage = (props) => mount(RecordFormPage, { props: { app: 'sales', model: 'Customer', ...props }, global: { plugins: [Quasar], stubs } })

beforeEach(() => {
  can.clear(); push.mockClear()
  schemaOf.value = { model: { endpoint: 'sales/customers/', label: 'Customer' }, permissions: {}, operations: { create: true, update: true, delete: true } }
})

describe('RecordFormPage', () => {
  it('a new record saves to the model endpoint and opens its page', async () => {
    can.add('add_customer').add('view_customer')
    const w = mountPage()
    await flushPromises()

    expect(w.findComponent(FormStub).props('store').safeUrl).toBe('sales/customers')
    expect(w.find('[data-test="record-form-title"]').text()).toBe('New Customer')

    await w.find('[data-test="record-form-save"]').trigger('click')
    expect(push).toHaveBeenCalledWith({ name: 'view_customer', params: { id: 'new1' } })
  })

  it('editing loads the record', async () => {
    can.add('change_customer')
    const w = mountPage({ id: 'c1' })
    await flushPromises()

    expect(w.findComponent(FormStub).props('store').form).toMatchObject({ id: 'c1', company_name: 'ACME' })
  })

  it('no form when the endpoint takes no such write, or the profile may not do it', async () => {
    can.add('add_customer')
    schemaOf.value.operations.create = false
    let w = mountPage()
    await flushPromises()
    expect(w.find('[data-test="record-form-unavailable"]').exists()).toBe(true)

    schemaOf.value.operations.create = true
    can.clear()
    w = mountPage()
    await flushPromises()
    expect(w.find('[data-test="record-form-unavailable"]').exists()).toBe(true)
  })
})
