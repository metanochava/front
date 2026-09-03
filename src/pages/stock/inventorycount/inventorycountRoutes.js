import { tdc } from 'quasar_resaas'

export let inventorycountRoutes = [
  {
    path: '/list_inventorycount',
    name: 'list_inventorycount',
    component: () => import('./InventorycountLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Contagens Físicas'),
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
      title: tdc('Visualizar') + ' ' + tdc('Contagem Física'),
      requiresAuth: true,
      icon: 'fact_check',
      requiredRole: 'view_inventorycount',
    },
  },
]
