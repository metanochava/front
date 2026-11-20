// The point of sale's bar: the open tabs that fit stay in their container;
// the rest go behind an expand button (+N) that opens a dialog with all of
// them; the selected tab is always visible.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

vi.mock('quasar_resaas', () => ({ tdc: (t) => t }))

import PosTabsBar from './PosTabsBar.vue'
import { fitTabs, GAP, MORE_WIDTH } from './posTabsFit'

const tab = (id) => ({ id, tab_label: `Table ${id}`, total: '10.00', line_count: 1, created_at: new Date().toISOString() })
const TABS = ['1', '2', '3', '4', '5'].map(tab)
const W = 100   // every tab 100 px wide

const stubs = {
  's-btn': { emits: ['click'], template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>' },
  's-tooltip': { template: '<span />' },
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue" data-test="dialog"><slot /></div>' },
  's-modal-card': { props: ['title'], template: '<div><h3>{{ title }}</h3><slot /><slot name="footer" /></div>' },
}

// jsdom has no layout: give the strip a width and every measured tab W px
function withLayout (stripWidth) {
  const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
    return this.dataset?.id ? W : 0
  })
  const client = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function () {
    return this.dataset?.test === 'pos-tabs-strip' ? stripWidth : 0
  })
  return () => { width.mockRestore(); client.mockRestore() }
}

let restore = () => {}
afterEach(() => restore())

async function mountBar (stripWidth, props = {}) {
  restore = withLayout(stripWidth)
  const w = mount(PosTabsBar, { props: { tabs: TABS, modelValue: null, ...props }, global: { plugins: [Quasar], stubs } })
  await flushPromises()
  w.vm.measure()
  await flushPromises()
  return w
}

const shown = (w) => w.findAll('[data-test="pos-tab"]').map(b => b.text())

describe('fitTabs', () => {
  const widths = Object.fromEntries(TABS.map(t => [t.id, W]))

  it('all of them when they fit', () => {
    expect(fitTabs(TABS, widths, 5 * W + 4 * GAP).size).toBe(5)
  })

  it('else those that fit beside the expand button, in order', () => {
    const room = 3 * W + 2 * GAP + MORE_WIDTH + GAP   // room for 3 + the button
    expect([...fitTabs(TABS, widths, room)]).toEqual(['1', '2', '3'])
  })

  it('the selected tab is always in, dropping the last ones', () => {
    const room = 3 * W + 2 * GAP + MORE_WIDTH + GAP
    expect([...fitTabs(TABS, widths, room, '5')]).toEqual(['1', '2', '5'])
  })
})

describe('PosTabsBar', () => {
  it('with room for every tab there is no expand button', async () => {
    const w = await mountBar(1000)

    expect(shown(w)).toHaveLength(5)
    expect(w.find('[data-test="pos-tabs-more"]').exists()).toBe(false)
  })

  it('without room: the tabs that fit and an expand button with how many are hidden', async () => {
    const w = await mountBar(3 * W + 2 * GAP + MORE_WIDTH + GAP)

    expect(shown(w).map(text => text.match(/Table \d/)[0])).toEqual(['Table 1', 'Table 2', 'Table 3'])
    expect(w.find('[data-test="pos-tabs-more-count"]').text()).toBe('+2')
  })

  it('the selected tab stays visible', async () => {
    const w = await mountBar(3 * W + 2 * GAP + MORE_WIDTH + GAP, { modelValue: '5' })

    expect(shown(w).some(text => text.includes('Table 5'))).toBe(true)
  })

  it('the expand button opens every tab; choosing one selects it', async () => {
    const w = await mountBar(2 * W)

    await w.find('[data-test="pos-tabs-more"]').trigger('click')
    const items = w.findAll('[data-test="pos-tabs-all-item"]')
    expect(items).toHaveLength(5)
    expect(w.text()).toContain('Open tabs (5)')

    await items[3].trigger('click')
    expect(w.emitted('update:modelValue').at(-1)).toEqual(['4'])
  })

  it('new tab and the quick sale keep working', async () => {
    const w = await mountBar(2 * W)

    await w.find('[data-test="pos-new-tab"]').trigger('click')
    await w.find('[data-test="pos-quick-sale"]').trigger('click')
    expect(w.emitted('new')).toHaveLength(1)
    expect(w.emitted('update:modelValue').at(-1)).toEqual([null])
  })
})
