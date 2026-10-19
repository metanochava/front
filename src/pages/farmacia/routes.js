import { tdc } from 'quasar_resaas'

import { filafarmaciaRoutes } from './filafarmacia/filafarmaciaRoutes'
import { dispensaRoutes } from './dispensa/dispensaRoutes'
import { marketplaceRoutes } from './marketplace/marketplaceRoutes'
import { counterRoutes } from './counter/counterRoutes'

export let farmaciaRoutes = [
  {
    path: '/view_farmacia_dashboard',
    name: 'view_farmacia_dashboard',
    component: () => import('./FarmaciaDashboard.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Pharmacy'),
      requiresAuth: true,
      icon: 'dashboard',
      requiredRole: 'view_farmacia_dashboard',
    },
  },
  ...filafarmaciaRoutes,
  ...dispensaRoutes,
  ...marketplaceRoutes,
  ...counterRoutes,
]
