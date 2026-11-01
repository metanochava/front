import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

const get = vi.fn()
vi.mock('quasar_resaas', async (orig) => ({ ...(await orig()), HTTPAuth: { get: (...a) => get(...a) }, url: ({ url }) => url }))

const { default: FilePreviewDialog } = await import('./FilePreviewDialog.vue')

const stubs = {
  's-modal-card': { template: '<div class="card"><slot name="bar-actions" /><slot /></div>' },
  's-btn': { template: '<button><slot /></button>' },
  's-tooltip': { template: '<span><slot /></span>' },
  's-card': { template: '<div class="s-card" @click="$emit(\'click\')"><slot /></div>' },
}
const file = { id: 'f1', nome: 'a.pdf', extensao: '.pdf', file: { url: 'http://x/a.pdf', mime_type: 'application/pdf' } }

describe('FilePreviewDialog', () => {
  it('shows the file and the exam values entered with it', async () => {
    get.mockResolvedValue({ data: { id: 'f1', exam: { name: 'Hemograma' }, date: '2026-10-31T10:00:00Z', revision: 1, validated: false, value: '12', report: 'Normal', observation: null, values: [{ code: 'hb', name: 'Hemoglobin', value: '14.2', unit: 'g/dL' }] } })
    const wrapper = mount(FilePreviewDialog, { props: { modelValue: true, file }, global: { plugins: [Quasar], stubs: { ...stubs, 'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue" class="dlg"><slot /></div>' } } } })
    await flushPromises()
    expect(get).toHaveBeenCalledWith('saude/resultadoexamemedicos/f1/exam_values/')
    // the file is a card; the render is in the second modal, opened by a click
    expect(wrapper.find('[data-test="file-preview-pdf"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="file-preview-thumb-pdf"] iframe').exists()).toBe(true)
    await wrapper.find('[data-test="file-preview-file"]').trigger('click')
    expect(wrapper.find('[data-test="file-preview-pdf"] iframe').exists()).toBe(true)
    const panel = wrapper.find('[data-test="file-preview-values"]').text()
    expect(panel).toContain('Hemograma')
    expect(panel).toContain('14.2')
  })
  it('a result without an attachment still shows its values', async () => {
    get.mockResolvedValue({ data: { id: 'r2', exam: { name: 'Raio-X' }, date: '2026-10-31T10:00:00Z', revision: 1, validated: false, value: 'Normal', values: [] } })
    const wrapper = mount(FilePreviewDialog, { props: { modelValue: true, file: { id: 'r2', nome: 'Raio-X', file: null } }, global: { plugins: [Quasar], stubs: { ...stubs, 'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue" class="dlg"><slot /></div>' } } } })
    await flushPromises()
    expect(wrapper.find('[data-test="file-preview-no-file"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="file-preview-values"]').text()).toContain('Raio-X')
  })
})
