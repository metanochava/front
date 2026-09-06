import { tdc } from 'quasar_resaas'

import { filafarmaciaRoutes } from './filafarmacia/filafarmaciaRoutes'
import { dispensaRoutes } from './dispensa/dispensaRoutes'

export let farmaciaRoutes = [
  {
    path: '/view_farmacia_dashboard',
    name: 'view_farmacia_dashboard',
    component: () => import('./FarmaciaDashboard.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Farmácia'),
      requiresAuth: true,
      icon: 'dashboard',
      requiredRole: 'view_farmacia_dashboard',
    },
  },
  ...filafarmaciaRoutes,
  ...dispensaRoutes,
]
