import { tdc } from 'quasar_resaas'

export let stockmovementRoutes = [
  {
    path: '/list_stockmovement',
    name: 'list_stockmovement',
    component: () => import('./StockmovementLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Movimentos de Stock'),
      requiresAuth: true,
      icon: 'receipt_long',
      requiredRole: 'list_stockmovement',
    },
  },
]
