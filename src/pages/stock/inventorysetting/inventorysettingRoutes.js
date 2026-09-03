import { tdc } from 'quasar_resaas'

export let inventorysettingRoutes = [
  {
    path: '/list_inventorysetting',
    name: 'list_inventorysetting',
    component: () => import('./InventorysettingLPage.vue'),
    meta: {
      title: tdc('Configurações de Inventário'),
      requiresAuth: true,
      icon: 'settings',
      requiredRole: 'list_inventorysetting',
    },
  },
]
