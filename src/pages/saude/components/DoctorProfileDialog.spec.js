import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

// the right menu's doctor dialog, also the public site's doctor profile
vi.mock('quasar_resaas', () => ({ tdc: s => s, ds: s => s }))
const fetchPage = vi.fn(async () => ({ rows: [] }))
vi.mock('../../hr/stores/EmployeeStore.js', () => ({ useEmployeeStore: () => ({ fetchPage }) }))
vi.mock('../medico/medicoStore', () => ({ useMedicoStore: () => ({ fetchPage }) }))

import DoctorProfileDialog from './DoctorProfileDialog.vue'

const stubs = {
  'q-dialog': { props: ['modelValue'], template: '<div v-if="modelValue"><slot /></div>' },
  's-modal-card': { props: ['title'], template: '<div><h1>{{ title }}</h1><slot /><slot name="footer" /></div>' },
  's-card': { template: '<div><slot /></div>' },
  's-btn': { emits: ['click'], template: '<button @click="$emit(\'click\')"><slot /></button>' },
  's-tooltip': { template: '<span class="tip"><slot /></span>' },
}

const doctor = { id: 'd1', name: 'Ana Cossa', category: 'Especialista', order_number: '456', photo: null,
  specialties: [{ id: 's1', title: 'Cardiologia' }], branches: ['b2'] }
const branches = [{ id: 'b1', name: 'Maputo' }, { id: 'b2', name: 'Matola' }]

describe('DoctorProfileDialog - public site', () => {
  it('shows only the public data, never the signature or stamp, and loads nothing', () => {
    const w = mount(DoctorProfileDialog, {
      props: { modelValue: true, publicDoctor: doctor, branches },
      global: { plugins: [Quasar], stubs },
    })

    expect(w.text()).toContain('Ana Cossa')
    expect(w.text()).toContain('456')
    expect(w.text()).toContain('Cardiologia')
    expect(w.text()).toContain('Matola')
    expect(w.text()).not.toContain('Maputo')
    expect(w.text()).not.toContain('Signature and stamp')
    expect(w.find('[data-test="doctor-photo"]').exists()).toBe(true)
    expect(fetchPage).not.toHaveBeenCalled()
  })

  it('offers "Book appointment" when bookable; every button has a tooltip', async () => {
    const w = mount(DoctorProfileDialog, {
      props: { modelValue: true, publicDoctor: doctor, branches, bookable: true },
      global: { plugins: [Quasar], stubs },
    })
    await w.find('[data-test="doctor-profile-book"]').trigger('click')

    expect(w.emitted('book')[0][0]).toEqual(doctor)
    for (const button of w.findAll('button')) expect(button.find('.tip').exists()).toBe(true)
  })
})
