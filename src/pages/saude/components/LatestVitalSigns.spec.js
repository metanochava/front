import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Quasar } from 'quasar'

vi.mock('quasar_resaas', () => ({
  HTTPAuth: { get: vi.fn(async () => ({ data: { results: [{ id: 'v9', created_at: '2026-11-20T10:00:00Z', peso: 70 }] } })) },
  url: ({ url }) => url,
  tdc: s => s,
  ds: v => v,
  displayValue: v => v,
  rawValue: v => v,
  useUserStore: () => ({ can: () => true }),
}))
vi.mock('./VitalSignsCharts.vue', () => ({ default: { template: '<div />' } }))

import LatestVitalSigns from './LatestVitalSigns.vue'

const stubs = {
  's-card': { template: '<div><slot /></div>' },
  's-btn': { template: '<button><slot /></button>' },
  's-tooltip': { template: '<span />' },
  's-modal-card': { template: '<div><slot /></div>' },
  'q-dialog': { template: '<div />' },
  's-print-btn': { props: ['document', 'objectId'], template: '<i>{{ document }} {{ objectId }}</i>' },
}

const mountCard = props => mount(LatestVitalSigns, { props: { pacienteId: 'p1', ...props }, global: { plugins: [Quasar], stubs } })

describe('Latest vital signs: print', () => {
  it('the consultation (printable) can print the record shown', async () => {
    const w = mountCard({ printable: true })
    await flushPromises()
    expect(w.find('[data-test="latest-vital-signs-print"]').text()).toBe('saude.vital_signs v9')
  })

  it('elsewhere there is no print button', async () => {
    const w = mountCard()
    await flushPromises()
    expect(w.find('[data-test="latest-vital-signs-print"]').exists()).toBe(false)
  })
})
