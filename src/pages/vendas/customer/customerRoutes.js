import { tdc } from 'quasar_resaas'

export let customerRoutes = [
  {
    path: '/list_customer',
    name: 'list_customer',
    component: () => import('./CustomerLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Customers'),
      requiresAuth: true,
      icon: 'groups',
      requiredRole: 'list_customer',
    },
  },
]
