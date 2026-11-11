import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

// Reprint: the same document with the date chosen next to the signature;
// it only asks for the PDF - nothing is saved
vi.mock('quasar_resaas', () => ({ tdc: s => s, errorMessage: () => '' }))

import ReprintDialog from './ReprintDialog.vue'

const stubs = {
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue"><slot /></div>' },
  's-modal-card': { emits: ['submit'], template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="footer" /></form>' },
  's-date': { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
  's-btn': { template: '<button><slot /></button>' },
  's-tooltip': { template: '<span><slot /></span>' },
}

describe('ReprintDialog', () => {
  it('prints the same document with the chosen date and saves nothing', async () => {
    const store = { getPdf: vi.fn(async () => {}), patchById: vi.fn() }
    const w = mount(ReprintDialog, {
      props: { modelValue: false, store, item: { id: 'r1' } },
      global: { plugins: [Quasar], stubs },
    })
    await w.setProps({ modelValue: true })

    const input = w.find('[data-test="reprint-date"]')
    expect(input.element.value).toMatch(/^\d{4}-\d{2}-\d{2}$/)   // today by default
    await input.setValue('2026-11-20')
    await w.find('form').trigger('submit')
    await flushPromises()

    expect(store.getPdf).toHaveBeenCalledWith('r1', { date: '2026-11-20' })
    expect(store.patchById).not.toHaveBeenCalled()
    expect(w.emitted('update:modelValue')[0]).toEqual([false])
  })
})
