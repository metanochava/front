import { tdc } from 'quasar_resaas'

export let taxRoutes = [
  {
    path: '/list_tax',
    name: 'list_tax',
    component: () => import('./TaxLPage.vue'),
    meta: {
      title: tdc('Taxes'),
      requiresAuth: true,
      icon: 'percent',
      requiredRole: 'list_tax',
    },
  },
]
