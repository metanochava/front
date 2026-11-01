import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import ExplorerItem from './ExplorerItem.vue'
import ExplorerGrid from './ExplorerGrid.vue'

const global = { plugins: [Quasar], stubs: { 's-tooltip': { template: '<span class="tip"><slot /></span>' } } }

const file = { id: 'f1', nome: 'analise_sangue_beatriz_2026', extensao: '.pdf', tipo: { id: 'File' }, file: { url: 'http://x/a.pdf' } }

describe('ExplorerItem', () => {
  it('opens on double click and keeps the extension in a one-line label', async () => {
    const wrapper = mount(ExplorerItem, { props: { item: file }, global })
    await wrapper.trigger('dblclick')
    expect(wrapper.emitted('open')?.[0]?.[0]).toEqual(file)
    expect(wrapper.find('[data-test="explorer-label"]').text()).toBe('anali...2026.pdf')
    expect(wrapper.find('.tip').text()).toBe('analise_sangue_beatriz_2026.pdf')
  })

  it('the grid forwards a file double click as open-file', async () => {
    const wrapper = mount(ExplorerGrid, { props: { files: [file], folders: [] }, global })
    await wrapper.find('.explorer-item').trigger('dblclick')
    expect(wrapper.emitted('open-file')?.[0]?.[0]).toEqual(file)
  })
})
