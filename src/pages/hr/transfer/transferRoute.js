import { tdc } from 'quasar_resaas'

export let transferRoutes = [
  {
    path: '/list_transfer',
    name: 'list_transfer',
    component: () => import('./TransferListPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('transfer'),
      requiresAuth: true,
      icon: 'compare_arrows',
      requiredRole: 'list_transfer',
    },
  },
]
