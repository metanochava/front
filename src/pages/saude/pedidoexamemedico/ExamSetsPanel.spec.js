import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

// exam sets of the exam request page: a click hands all of a set's exams
// (with their type and class) to the page; saving posts the request's exams
const { perms, http } = vi.hoisted(() => ({
  perms: new Set(),
  http: { get: vi.fn(), post: vi.fn(async () => ({ data: {} })), patch: vi.fn(async () => ({ data: {} })), delete: vi.fn() },
}))
vi.mock('quasar_resaas', () => ({
  tdc: s => s,
  url: ({ url }) => url,
  HTTPAuth: http,
  useUserStore: () => ({ can: p => perms.has(p) }),
  sDialog: () => ({ onOk: fn => fn() }),
}))

import ExamSetsPanel from './ExamSetsPanel.vue'

const cbc = { id: 'x1', nome: 'Blood count' }
const glucose = { id: 'x2', nome: 'Glucose' }
const classe = { id: 'c1', nome: 'Haematology', exames: [cbc, glucose] }
const tipo = { id: 't1', nome: 'Laboratory', classes: [classe] }

const stubs = {
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue"><slot /></div>' },
  's-modal-card': { template: '<div><slot /><slot name="footer" /></div>' },
  's-btn': { props: ['label'], emits: ['click'], template: '<button @click="$emit(\'click\', $event)">{{ label }}<slot /></button>' },
  's-tooltip': { template: '<span class="tip"><slot /></span>' },
  's-highlight': { props: ['text'], template: '<span>{{ text }}</span>' },
  's-input': { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
}

function mountPanel (props = {}) {
  return mount(ExamSetsPanel, {
    props: { catalogo: [tipo], currentExams: [], ...props },
    global: { plugins: [Quasar], stubs },
  })
}

beforeEach(() => {
  perms.clear()
  vi.clearAllMocks()
  http.get.mockResolvedValue({ data: [
    { id: 's1', name: 'Pre-operative', exams: ['x1', 'x2', 'gone'], scope: 'entity' },
    { id: 's2', name: 'Mine', exams: ['x2'], scope: 'mine' },
  ] })
})

describe('ExamSetsPanel', () => {
  it('lists the sets and hands every exam of the clicked one (an exam gone from the catalogue is skipped)', async () => {
    perms.add('list_examset')
    const w = mountPanel()
    await flushPromises()

    const rows = w.findAll('[data-test="exam-set"]')
    expect(rows.map(r => r.text()).join(' ')).toContain('Pre-operative')
    await rows[0].trigger('click')

    expect(w.emitted('apply')[0][0]).toEqual([{ tipo, classe, exame: cbc }, { tipo, classe, exame: glucose }])
  })

  it('removes only what the user may: own sets with delete_examset, the clinic\'s with manage_entity_examset', async () => {
    perms.add('list_examset').add('delete_examset')
    const w = mountPanel()
    await flushPromises()

    expect(w.findAll('[data-test="exam-set-remove"]')).toHaveLength(1)   // only "Mine"
    await w.find('[data-test="exam-set-remove"]').trigger('click')
    await flushPromises()
    expect(http.delete.mock.calls[0][0]).toBe('saude/examsets/s2/')
  })

  it('saves the request\'s exams as a personal set', async () => {
    perms.add('list_examset').add('add_examset')
    const w = mountPanel({ currentExams: ['x1', 'x2'] })
    await flushPromises()

    w.vm.openSave()
    await flushPromises()
    await w.find('[data-test="exam-set-name"]').setValue('Routine')
    await w.find('[data-test="exam-set-save"]').trigger('click')
    await flushPromises()

    expect(http.post.mock.calls[0][1]).toEqual({ name: 'Routine', exams: ['x1', 'x2'], scope: 'mine' })
    expect(w.find('[data-test="exam-set-scope"]').exists()).toBe(false)   // no clinic option without the permission
  })

  it('the search filters by the set name or the name of one of its exams', async () => {
    perms.add('list_examset')
    const w = mountPanel({ search: 'glucose' })
    await flushPromises()
    // both sets have Glucose
    expect(w.findAll('[data-test="exam-set"]')).toHaveLength(2)

    await w.setProps({ search: 'pre-op' })
    expect(w.findAll('[data-test="exam-set"]').map(r => r.text()).join(' ')).toContain('Pre-operative')
    expect(w.findAll('[data-test="exam-set"]')).toHaveLength(1)

    await w.setProps({ search: 'nothing like it' })
    expect(w.find('[data-test="exam-sets-none-found"]').exists()).toBe(true)
  })

  it('edits a personal set: name, removing an exam and adding the request\'s ones', async () => {
    perms.add('list_examset').add('change_examset')
    const w = mountPanel({ currentExams: ['x1'] })
    await flushPromises()

    // only the personal set is editable without manage_entity_examset
    expect(w.findAll('[data-test="exam-set-edit"]')).toHaveLength(1)
    await w.find('[data-test="exam-set-edit"]').trigger('click')
    await flushPromises()

    await w.find('[data-test="exam-set-name"]').setValue('Mine renamed')
    await w.find('[data-test="exam-set-add-current"]').trigger('click')
    await w.find('[data-test="exam-set-save"]').trigger('click')
    await flushPromises()

    expect(http.patch.mock.calls[0][0]).toBe('saude/examsets/s2/')
    expect(http.patch.mock.calls[0][1]).toEqual({ name: 'Mine renamed', exams: ['x2', 'x1'] })
  })
})
