import { tdc } from 'quasar_resaas'

export let stockitemRoutes = [
  {
    path: '/list_stockitem',
    name: 'list_stockitem',
    component: () => import('./StockitemLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Saldo de Stock'),
      requiresAuth: true,
      icon: 'inventory',
      requiredRole: 'list_stockitem',
    },
  },
]
