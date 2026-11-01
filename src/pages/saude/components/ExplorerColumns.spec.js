import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

const get = vi.fn()
vi.mock('quasar_resaas', async (orig) => ({ ...(await orig()), HTTPAuth: { get: (...a) => get(...a) }, url: (o) => o }))
const { default: ExplorerColumns } = await import('./ExplorerColumns.vue')

const global = { plugins: [Quasar], stubs: { 's-tooltip': { template: '<span><slot /></span>' }, 's-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' } } }
const lab = { id: 'lab', nome: 'Lab', tipo: { id: 'Folder' } }
const blood = { id: 'blood', nome: 'Sangue', tipo: { id: 'Folder' } }
const loose = { id: 'x', nome: 'scan', extensao: '.pdf', tipo: { id: 'File' }, file: { url: 'http://x/s.pdf' } }
const hb = { id: 'hb', nome: 'Hemograma', extensao: '.jpg', tipo: { id: 'File' }, file: { url: 'http://x/h.jpg' }, size_human: '80 KB' }

describe('ExplorerColumns', () => {
  it('one column per open folder, the current one last, the selected file previewed', async () => {
    // root and Lab are earlier columns, read from the explorer endpoint
    get.mockImplementation(({ params }) => Promise.resolve({ data: params.pai === 'lab' ? [blood] : [lab, loose] }))
    const wrapper = mount(ExplorerColumns, { props: { path: [lab, blood], folders: [], files: [hb], selected: hb, paciente: 'p1' }, global })
    await flushPromises()

    expect(get.mock.calls.map(([o]) => o.params.pai)).toEqual([undefined, 'lab'])
    expect(wrapper.findAll('.explorer-columns__column')).toHaveLength(3)
    expect(wrapper.find('[data-test="explorer-column-0"]').text()).toContain('Lab')
    expect(wrapper.find('[data-test="explorer-column-item-lab"]').classes()).toContain('explorer-columns__item--open')
    expect(wrapper.find('[data-test="explorer-column-2"]').text()).toContain('Hemograma.jpg')
    expect(wrapper.find('[data-test="explorer-column-preview"]').text()).toContain('80 KB')
  })

  it('a folder opens at its level; a file selects, double click opens', async () => {
    get.mockResolvedValue({ data: [lab, loose] })
    const wrapper = mount(ExplorerColumns, { props: { path: [lab], folders: [blood], files: [hb], paciente: 'p1' }, global })
    await flushPromises()

    await wrapper.find('[data-test="explorer-column-item-lab"]').trigger('click')
    await wrapper.find('[data-test="explorer-column-item-blood"]').trigger('click')
    await wrapper.find('[data-test="explorer-column-item-hb"]').trigger('click')
    await wrapper.find('[data-test="explorer-column-item-hb"]').trigger('dblclick')

    expect(wrapper.emitted('open-folder-at')).toEqual([[0, lab], [1, blood]])
    expect(wrapper.emitted('select')[0][0]).toEqual(hb)
    expect(wrapper.emitted('open-file')[0][0]).toEqual(hb)
  })
})
