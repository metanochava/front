import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import ExplorerGrid from './ExplorerGrid.vue'
import { shortFileName, fileKind } from './fileKind'

const global = { plugins: [Quasar], stubs: { 's-tooltip': { template: '<span class="tip"><slot /></span>' } } }
const folder = { id: 'd1', nome: 'masta', tipo: { id: 'Folder' } }
const image = { id: 'f1', nome: 'Creatinina', extensao: '.jpg', tipo: { id: 'File' }, file: { url: 'http://x/c.jpg' }, size_human: '120 KB', updated_at: '2026-10-31T10:00:00Z' }
const pdf = { id: 'f2', nome: 'PtCv2025.docx', extensao: '.pdf', tipo: { id: 'File' }, file: { url: 'http://x/cv.pdf', mime_type: 'application/pdf' } }
const props = { folders: [folder], files: [image, pdf] }

describe('ExplorerGrid', () => {
  it('icons and gallery preview what the browser can show', () => {
    for (const mode of ['icons', 'gallery']) {
      const wrapper = mount(ExplorerGrid, { props: { ...props, mode }, global })
      expect(wrapper.findAll('.explorer-item')).toHaveLength(3)
      expect(wrapper.find('[data-test="file-thumb-image"] img').exists()).toBe(true)
      expect(wrapper.find('[data-test="file-thumb-pdf"] iframe').exists()).toBe(true)
    }
  })

  it('list: a table with the details, one row per item', async () => {
    const list = mount(ExplorerGrid, { props: { ...props, mode: 'list' }, global })
    expect(list.findAll('tbody tr')).toHaveLength(3)
    expect(list.findAll('thead th')).toHaveLength(4)
    expect(list.find('[data-test="explorer-row-f1"]').text()).toContain('120 KB')
    // rows are small: no PDF frame there
    expect(list.find('iframe').exists()).toBe(false)

    await list.find('[data-test="explorer-row-f2"]').trigger('dblclick')
    await list.find('[data-test="explorer-row-d1"]').trigger('dblclick')
    expect(list.emitted('open-file')[0][0]).toEqual(pdf)
    expect(list.emitted('open-folder')[0][0]).toEqual(folder)
  })

  it('names: one line, cut in the middle, the extension kept', () => {
    expect(shortFileName({ nome: 'WhatsApp Image 2026-10-22 at 21.40.17 (1).jpeg', extensao: '.jpeg' })).toBe('What... (1).jpeg')
    expect(shortFileName(pdf)).toBe('PtCv2...docx.pdf')
    expect(fileKind({ nome: 'x' })).toBe('none')
  })
})
