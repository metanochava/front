import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }))
vi.mock('quasar_resaas', () => ({
  HTTPAuth: { get: api.get, post: api.post, patch: api.patch },
  url: ({ url }) => url,
  tdc: s => s,
  displayValue: v => v,
  ds: v => v,
  AlertSuccess: () => {},
  useUserStore: () => ({ can: () => true }),
}))
vi.mock('./VitalSignsCharts.vue', () => ({ default: { template: '<div />' } }))

import VitalSignsDialog from './VitalSignsDialog.vue'

const INTAKE = {
  patient: { id: 'p1', nid: 'N1', person: { full_name: 'Maria' } },
  agenda: { id: 'a1', date: '2026-11-20' },
  professional: { person: { full_name: 'Nurse' } },
  previous: null,
  tipo: 'triagem',
  limits: {},
}

const stubs = {
  'q-dialog': { template: '<div><slot /></div>' },
  's-modal-card': { template: '<div><slot name="subheader" /><slot /><div class="footer"><slot name="footer" /></div></div>' },
  's-btn': { props: ['disable', 'loading', 'label'], emits: ['click'], template: '<button :disabled="disable" @click="$emit(\'click\')">{{ label }}<slot /></button>' },
  's-tooltip': { template: '<span />' },
  's-print-dialog': { props: ['modelValue', 'document', 'objectId'], emits: ['update:modelValue'], template: '<div v-if="modelValue" data-test="print-dialog-stub">{{ document }} {{ objectId }}<button data-test="print-dialog-close" @click="$emit(\'update:modelValue\', false)" /></div>' },
  's-input': { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
}

async function mountDialog () {
  const w = mount(VitalSignsDialog, {
    props: { modelValue: true, context: { id: 'a1' } },
    global: { plugins: [Quasar], stubs },
    attachTo: document.body,
  })
  await flushPromises()
  return w
}

beforeEach(() => {
  Object.values(api).forEach(fn => fn.mockReset())
  api.get.mockResolvedValue({ data: INTAKE })
  api.post.mockResolvedValue({ data: { id: 'v1' } })
})

describe('Record vital signs: keyboard and save and print', () => {
  it('Enter moves to the next input, never saves; from the last it wraps to the first', async () => {
    const w = await mountDialog()
    const inputs = w.findAll('.vitals input:not([type=checkbox])').map(i => i.element)
    inputs[0].focus()
    inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(document.activeElement).toBe(inputs[1])
    expect(api.post).not.toHaveBeenCalled()

    const fields = [...w.find('.vitals').element.querySelectorAll('input:not([type=checkbox]), textarea')]
    fields[fields.length - 1].focus()
    fields[fields.length - 1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(fields[0])
    w.unmount()
  })

  it('"Save and print" saves, then opens the print dialog of the saved record', async () => {
    const w = await mountDialog()
    await w.findAll('.vitals input')[0].setValue('70')
    await w.find('[data-test="vital-signs-save-print"]').trigger('click')
    await flushPromises()

    expect(api.post).toHaveBeenCalledTimes(1)
    expect(w.find('[data-test="print-dialog-stub"]').text()).toBe('saude.vital_signs v1')
    // the page hears "saved" only once the print dialog closes (it may close this one)
    expect(w.emitted('saved')).toBeFalsy()
    await w.find('[data-test="print-dialog-close"]').trigger('click')
    expect(w.emitted('saved')).toBeTruthy()
    w.unmount()
  })

  it('"Save" alone does not print', async () => {
    const w = await mountDialog()
    await w.findAll('.vitals input')[0].setValue('70')
    await w.find('[data-test="vital-signs-save"]').trigger('click')
    await flushPromises()

    expect(api.post).toHaveBeenCalledTimes(1)
    expect(w.find('[data-test="print-dialog-stub"]').exists()).toBe(false)
    expect(w.emitted('saved')).toBeTruthy()
    w.unmount()
  })
})
