// add_<model> / change_<model>/:id for the models with no form page of their
// own (RecordFormPage) - never over a module's own page.
import { describe, it, expect, vi } from 'vitest'

vi.mock('quasar_resaas', () => ({ tdc: (t) => t }))

import { formRoutes, missingFormRoutes } from './viewRoutes'

describe('formRoutes', () => {
  it('add_ and change_ of each model, with their permission', () => {
    const routes = formRoutes('sales', { Customer: { label: 'Customer' }, Tax: { form: false } })

    expect(routes.map(r => r.name)).toEqual(['add_customer', 'change_customer'])
    expect(routes[0].path).toBe('/add_customer')
    expect(routes[1].path).toBe('/change_customer/:id')
    expect(routes.map(r => r.meta.requiredRole)).toEqual(['add_customer', 'change_customer'])
    expect(routes[1].props({ params: { id: 'c1' } })).toMatchObject({ app: 'sales', model: 'Customer', id: 'c1' })
    expect(routes[0].props({ params: {} }).id).toBeNull()
  })

  it('only the ones missing: a module page with that name wins', () => {
    const existing = [{ path: '/', children: [{ name: 'add_employee' }, { name: 'list_employee' }] }]

    const routes = missingFormRoutes(existing, [['hr', ['Employee', 'Termination']], ['sales', ['Customer']]])

    expect(routes.map(r => r.name)).toEqual(['change_employee', 'add_termination', 'change_termination', 'add_customer', 'change_customer'])
  })

  it('lines and records of the system get no form page', () => {
    const routes = missingFormRoutes([], [['sales', ['SaleItem', 'Payment', 'Tax']]])
    expect(routes.map(r => r.name)).toEqual(['add_tax', 'change_tax'])
  })
})
