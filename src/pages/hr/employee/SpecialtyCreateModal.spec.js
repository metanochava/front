import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createPinia, setActivePinia } from 'pinia'
import { reactive } from 'vue'

// a new specialty from the employee's Employment tab: saved through the real
// hr.Specialty store, then handed to the page (which gives it to the employee)
const store = reactive({
  form: {}, errors: {},
  loadSchemaOnce: vi.fn(async () => {}),
  resetForm: vi.fn(() => { store.form = {} }),
  save: vi.fn(async () => ({ data: { id: 's1', title: store.form.title } })),
})
vi.mock('quasar_resaas', () => ({ tdc: s => s }))
vi.mock('../stores/SpecialtyStore.js', () => ({ useSpecialtyStore: () => store }))

import SpecialtyCreateModal from './SpecialtyCreateModal.vue'

const stubs = {
  's-modal-card': { template: '<div><slot /><slot name="footer" /></div>' },
  's-input': { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  's-btn': { props: ['disable'], emits: ['click'], template: '<button :disabled="disable" @click="$emit(\'click\')"><slot /></button>' },
  's-tooltip': { template: '<span class="tip"><slot /></span>' },
}

beforeEach(() => setActivePinia(createPinia()))

describe('SpecialtyCreateModal', () => {
  it('saves the specialty as Active and emits the new row', async () => {
    const w = mount(SpecialtyCreateModal, { global: { plugins: [Quasar], stubs } })
    await flushPromises()

    await w.find('input').setValue('Cardiologia')
    await w.find('[data-test="specialty-save"]').trigger('click')
    await flushPromises()

    expect(store.form.state).toBe('Active')
    expect(w.emitted('saved')[0][0]).toEqual({ id: 's1', title: 'Cardiologia' })
  })

  it('every button has a tooltip', async () => {
    const w = mount(SpecialtyCreateModal, { global: { plugins: [Quasar], stubs } })
    for (const button of w.findAll('button')) expect(button.find('.tip').exists()).toBe(true)
  })
})
