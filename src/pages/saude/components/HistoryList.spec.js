import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { createPinia, setActivePinia, defineStore } from 'pinia'

// a record added through the page's form (store.create via save()) or a
// store's own changed(row) shows at once at the top of the right menu
vi.mock('quasar_resaas', () => ({
  tdc: s => s,
  sDialog: () => ({ onOk: () => {} }),
  useUserStore: () => ({ data: { id: 'u1' }, Entity: { id: 'e1' }, Branch: { id: 'b1' }, can: () => true }),
  AlertSuccess: () => {},
  AlertError: () => {},
  getUserPreference: () => null,
  setUserPreference: () => {},
  rawValue: v => (v && typeof v === 'object' ? v.id : v),
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: () => {} }) }))
vi.mock('./HistoryItem.vue', () => ({ default: { props: ['item'], template: '<div class="history-row">{{ item.id }}</div>' } }))
vi.mock('./ReprintDialog.vue', () => ({ default: { template: '<div />' } }))
// the open patient (Paciente.row): the menu lists only its documents
const paciente = { row: null }
vi.mock('../paciente/pacienteStore', () => ({ usePacienteStore: () => paciente }))

import HistoryList from './HistoryList.vue'

let server
let lastPatient
const useDocs = defineStore('docs-spec', {
  actions: {
    async fetchPage({ page, patient }) {
      lastPatient = patient
      return { rows: page === 1 ? [...server] : [], hasNext: false }
    },
    async create() {
      const row = { id: `n${server.length}`, created_at: '2026-11-08' }
      server.unshift(row)
      return row
    },
    changed(row) { return row },
  },
})

const global = {
  plugins: [Quasar],
  stubs: {
    's-card': { template: '<div><slot /></div>' },
    's-btn': true,
  },
}

function ids(wrapper) {
  return wrapper.findAll('.history-row').map(r => r.text())
}

beforeEach(() => {
  setActivePinia(createPinia())
  server = [{ id: 'old', created_at: '2026-11-01' }]
  paciente.row = null
  lastPatient = undefined
})

describe('HistoryList (right menu)', () => {
  it('shows a record created through the store at the top at once', async () => {
    vi.useFakeTimers()
    const store = useDocs()
    const wrapper = mount(HistoryList, { props: { store, title: 'Docs' }, global, attachTo: document.body })
    await vi.runAllTimersAsync()
    await flushPromises()
    expect(ids(wrapper)).toEqual(['old'])

    await store.create()
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()

    expect(ids(wrapper)).toEqual(['n1', 'old'])
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('refreshes on changed(row) (records saved through custom requests)', async () => {
    vi.useFakeTimers()
    const store = useDocs()
    const wrapper = mount(HistoryList, { props: { store, title: 'Docs' }, global, attachTo: document.body })
    await vi.runAllTimersAsync()
    await flushPromises()

    server.unshift({ id: 'rx', created_at: '2026-11-08' })
    store.changed(server[0])
    await vi.advanceTimersByTimeAsync(200)
    await flushPromises()

    expect(ids(wrapper)[0]).toBe('rx')
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('asks only for the open patient\'s documents, unless told not to', async () => {
    const store = useDocs()
    paciente.row = { id: 'p1' }
    const wrapper = mount(HistoryList, { props: { store, title: 'Docs' }, global, attachTo: document.body })
    await flushPromises()
    expect(lastPatient).toBe('p1')
    wrapper.unmount()

    lastPatient = undefined
    const catalogue = mount(HistoryList, { props: { store, title: 'Exams', byPatient: false }, global, attachTo: document.body })
    await flushPromises()
    expect(lastPatient).toBeUndefined()
    catalogue.unmount()
  })
})
