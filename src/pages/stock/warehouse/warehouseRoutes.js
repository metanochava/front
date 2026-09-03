import { tdc } from 'quasar_resaas'

export let warehouseRoutes = [
  {
    path: '/list_warehouse',
    name: 'list_warehouse',
    component: () => import('./WarehouseLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Armazéns'),
      requiresAuth: true,
      icon: 'warehouse',
      requiredRole: 'list_warehouse',
    },
  },
]
