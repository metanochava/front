import { tdc } from 'quasar_resaas'

export let warehouseRoutes = [
  {
    path: '/list_warehouse',
    name: 'list_warehouse',
    component: () => import('./WarehouseLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Warehouses'),
      requiresAuth: true,
      icon: 'warehouse',
      requiredRole: 'list_warehouse',
    },
  },
]
