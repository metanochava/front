import { tdc } from 'quasar_resaas'

export let inventorycountRoutes = [
  {
    path: '/list_inventorycount',
    name: 'list_inventorycount',
    component: () => import('./InventorycountLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Physical Counts'),
      requiresAuth: true,
      icon: 'fact_check',
      requiredRole: 'list_inventorycount',
    },
  },
  {
    path: '/view_inventorycount/:id',
    name: 'view_inventorycount',
    component: () => import('./InventorycountVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('Physical Count'),
      requiresAuth: true,
      icon: 'fact_check',
      requiredRole: 'view_inventorycount',
    },
  },
]
