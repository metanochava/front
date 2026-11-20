// The manual add_/change_ pages: each compiles, and the type-driven ones show
// or hide their fields (product: no stock for a service; supplier: person or
// company name).
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { reactive } from 'vue'

const params = vi.hoisted(() => ({ value: {} }))
vi.mock('vue-router', () => ({ useRoute: () => ({ params: params.value }), useRouter: () => ({ push: vi.fn(), back: vi.fn(), hasRoute: () => true }) }))
vi.mock('quasar_resaas', () => ({ tdc: t => t, url: ({ url }) => url, useUserStore: () => ({ can: () => true }), createBaseStore: () => () => ({}) }))

const makeStore = (row = null) => reactive({
  fields: [], form: {}, row: null, errors: {}, loading: false,
  init: vi.fn(async () => {}), resetForm: vi.fn(function () { this.form = {} }),
  getById: vi.fn(async () => row), save: vi.fn(async () => ({ id: 'x' })),
})
const stores = vi.hoisted(() => ({}))
for (const [path, fn] of [['../../pages/stock/product/productStore', 'useProductStore'], ['../../pages/purchases/supplier/supplierStore', 'useSupplierStore']]) {
  vi.doMock(path, () => ({ [fn]: () => stores[fn] }))
}

const stubs = {
  'q-page': { template: '<div><slot /></div>' }, 's-card': { template: '<div><slot /></div>' }, 's-tooltip': { template: '<span />' },
  's-btn': { props: ['label'], template: '<button v-bind="$attrs">{{ label }}</button>' },
  's-input': { props: ['modelValue'], template: '<input v-bind="$attrs" />' }, 's-field': { template: '<div v-bind="$attrs" />' },
  's-select': { template: '<div v-bind="$attrs" />' }, 's-toggle': { template: '<div v-bind="$attrs" />' }, 's-date': { template: '<div v-bind="$attrs" />' },
  'q-toggle': { template: '<div v-bind="$attrs" />' }, 'q-option-group': { template: '<div v-bind="$attrs" />' },
  'q-btn-toggle': { props: ['modelValue', 'options'], emits: ['update:modelValue'],
    template: '<div><button v-for="o in options" :key="o.value" :data-test="`type-${o.value}`" @click="$emit(\'update:modelValue\', o.value)" /></div>' },
}

beforeEach(() => { params.value = {} })

describe('manual add_/change_ pages', () => {
  it('every page of the first batch compiles', async () => {
    const pages = import.meta.glob([
      '../../pages/vendas/tax/TaxSEPage.vue', '../../pages/vendas/customercontact/CustomercontactSEPage.vue',
      '../../pages/stock/pricelist/PricelistSEPage.vue', '../../pages/stock/productcategory/ProductcategorySEPage.vue',
      '../../pages/stock/warehouse/WarehouseSEPage.vue', '../../pages/stock/inventorysetting/InventorysettingSEPage.vue',
      '../../pages/stock/batch/BatchSEPage.vue', '../../pages/stock/product/ProductSEPage.vue',
      '../../pages/purchases/supplier/SupplierSEPage.vue', '../../pages/vendas/customer/CustomerSEPage.vue',
    ])
    expect(Object.keys(pages)).toHaveLength(10)
    for (const load of Object.values(pages)) expect((await load()).default).toBeTruthy()
  })

  it('product: a service has no stock section; goods do', async () => {
    stores.useProductStore = makeStore()
    const { default: Page } = await import('../../pages/stock/product/ProductSEPage.vue')
    const w = mount(Page, { global: { plugins: [Quasar], stubs } })
    await flushPromises()

    expect(stores.useProductStore.form.product_type).toBe('goods')
    expect(w.find('[data-test="product-stock"]').exists()).toBe(true)
    stores.useProductStore.form.track_batches = true

    await w.find('[data-test="type-service"]').trigger('click')
    expect(w.find('[data-test="product-stock"]').exists()).toBe(false)
    expect(stores.useProductStore.form.track_batches).toBe(false)
  })

  it('supplier: individual shows the person, company the name - and clears the other', async () => {
    stores.useSupplierStore = makeStore()
    const { default: Page } = await import('../../pages/purchases/supplier/SupplierSEPage.vue')
    const w = mount(Page, { global: { plugins: [Quasar], stubs } })
    await flushPromises()

    expect(w.find('[data-test="f-company_name"]').exists()).toBe(true)
    stores.useSupplierStore.form.company_name = 'ACME'
    await w.find('[data-test="type-individual"]').trigger('click')
    expect(w.find('[data-test="f-person"]').exists()).toBe(true)
    expect(w.find('[data-test="f-company_name"]').exists()).toBe(false)
    expect(stores.useSupplierStore.form.company_name).toBeNull()
  })
})
