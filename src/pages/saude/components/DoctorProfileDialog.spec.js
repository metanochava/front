import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

// the right menu's doctor dialog, also the public site's doctor profile
const { perms, rating, internalProfile, httpAuth, httpClient, fetchPage } = vi.hoisted(() => {
  const rating = { scope: 'entity', average: 4.5, count: 2, distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
    comments: [{ id: 'c1', stars: 5, comment: 'Very attentive', date: '2026-11-01' }] }
  const internalProfile = { id: 'e1', name: 'Ana Cossa', category: 'Especialista', order_number: '456', photo: null,
    specialties: [{ id: 's1', title: 'Cardiologia' }], branches: ['b2'], branch_names: ['Matola'], bio: 'Family medicine.',
    languages: 'Português', rating, medico_id: 'm1', active: true, can_moderate: false }
  return {
    perms: new Set(),
    rating,
    internalProfile,
    httpAuth: { get: vi.fn(), post: vi.fn(async () => ({ data: {} })) },
    httpClient: { get: vi.fn(async () => ({ data: rating })) },
    fetchPage: vi.fn(async () => ({ rows: [{ id: 'm1', assinatura: { url: 'sig.png' }, carimbo: null }] })),
  }
})

vi.mock('quasar_resaas', () => ({
  tdc: s => s,
  ds: s => s,
  url: ({ url, params }) => `${url}${params ? '?' + new URLSearchParams(params) : ''}`,
  HTTPAuth: httpAuth,
  HTTPClient: httpClient,
  useUserStore: () => ({ can: p => perms.has(p) }),
}))
vi.mock('../../hr/stores/EmployeeStore.js', () => ({ useEmployeeStore: () => ({ fetchPage }) }))
vi.mock('../medico/medicoStore', () => ({ useMedicoStore: () => ({ fetchPage }) }))

import DoctorProfileDialog from './DoctorProfileDialog.vue'

const stubs = {
  // q-dialog stubbed: it emits "show" when opened, like the real one
  'q-dialog': {
    props: ['modelValue'], emits: ['show'],
    mounted () { if (this.modelValue) this.$emit('show') },
    template: '<div v-if="modelValue"><slot /></div>'
  },
  's-modal-card': { props: ['title'], template: '<div><h1>{{ title }}</h1><slot /><slot name="footer" /></div>' },
  's-card': { template: '<div><slot /></div>' },
  's-btn': { props: ['label'], emits: ['click'], template: '<button @click="$emit(\'click\')">{{ label }}<slot /></button>' },
  's-tooltip': { template: '<span class="tip"><slot /></span>' },
}

const doctor = { id: 'd1', name: 'Ana Cossa', category: 'Especialista', order_number: '456', photo: null,
  specialties: [{ id: 's1', title: 'Cardiologia' }], branches: ['b2'], bio: 'Family medicine.', languages: 'Português',
  rating: { average: 4.5, count: 2 } }
const branches = [{ id: 'b1', name: 'Maputo' }, { id: 'b2', name: 'Matola' }]

async function open (props) {
  const w = mount(DoctorProfileDialog, { props: { modelValue: true, ...props }, global: { plugins: [Quasar], stubs } })
  await flushPromises()
  return w
}

beforeEach(() => {
  perms.clear()
  vi.clearAllMocks()
  httpAuth.get.mockResolvedValue({ data: internalProfile })
})

describe('DoctorProfileDialog - public site', () => {
  it('shows only the public data and the rating, never the signature or stamp', async () => {
    const w = await open({ publicDoctor: doctor, branches })

    expect(w.text()).toContain('Ana Cossa')
    expect(w.text()).toContain('456')
    expect(w.text()).toContain('Cardiologia')
    expect(w.text()).toContain('Matola')
    expect(w.text()).not.toContain('Maputo')
    expect(w.text()).toContain('Family medicine.')
    expect(w.text()).toContain('Very attentive')
    expect(w.text()).not.toContain('Signature and stamp')
    expect(httpClient.get.mock.calls[0][0]).toContain('saude/publicbooking/rating/')
    expect(httpAuth.get).not.toHaveBeenCalled()
    expect(fetchPage).not.toHaveBeenCalled()
  })

  it('offers "Book appointment" when bookable; every button has a tooltip', async () => {
    const w = await open({ publicDoctor: doctor, branches, bookable: true })
    await w.find('[data-test="doctor-profile-book"]').trigger('click')

    expect(w.emitted('book')[0][0]).toEqual(doctor)
    for (const button of w.findAll('button')) expect(button.find('.tip').exists()).toBe(true)
  })
})

describe('DoctorProfileDialog - app', () => {
  it('without HR or doctor permissions shows the public profile, no error', async () => {
    const w = await open({ employee: { id: 'e1' } })

    expect(httpAuth.get.mock.calls[0][0]).toContain('saude/doctorprofile/e1/')
    expect(w.text()).toContain('Ana Cossa')
    expect(w.text()).toContain('Matola')
    expect(w.text()).toContain('Very attentive')
    expect(w.text()).not.toContain('Could not load the doctor information.')
    expect(w.text()).not.toContain('Signature and stamp')
    expect(w.text()).not.toContain('Employee code')
    expect(fetchPage).not.toHaveBeenCalled()
  })

  it('adds the signature and stamp for whoever may list doctors', async () => {
    perms.add('list_medico')
    const w = await open({ employee: 'e1' })

    expect(fetchPage).toHaveBeenCalledTimes(1)
    expect(w.text()).toContain('Signature and stamp')
  })

  it('lets a moderator approve a pending comment', async () => {
    httpAuth.get.mockResolvedValue({ data: { ...internalProfile, can_moderate: true,
      rating: { ...rating, pending: [{ id: 'p1', stars: 2, comment: 'Late', date: '2026-11-02' }] } } })
    const w = await open({ employee: 'e1' })

    await w.find('[data-test="rating-approve"]').trigger('click')
    await flushPromises()
    expect(httpAuth.post.mock.calls[0][0]).toContain('hr/employeeratings/p1/moderate/')
    expect(httpAuth.post.mock.calls[0][1]).toEqual({ status: 'approved' })
  })
})
