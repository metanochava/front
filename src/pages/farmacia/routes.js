import { tdc } from 'quasar_resaas'

import { filafarmaciaRoutes } from './filafarmacia/filafarmaciaRoutes'
import { dispensaRoutes } from './dispensa/dispensaRoutes'
import { marketplaceRoutes } from './marketplace/marketplaceRoutes'
import { counterRoutes } from './counter/counterRoutes'
import { viewRoutes } from 'src/components/record/viewRoutes'
import { farmaciaViews } from './views'

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
  // record pages of the models without a view page of their own (views.js)
  ...viewRoutes('farmacia', farmaciaViews),
]
