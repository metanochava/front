import { tdc } from 'quasar_resaas'

export let inventorysettingRoutes = [
  {
    path: '/list_inventorysetting',
    name: 'list_inventorysetting',
    component: () => import('./InventorysettingLPage.vue'),
    meta: {
      title: tdc('Inventory Settings'),
      requiresAuth: true,
      icon: 'settings',
      requiredRole: 'list_inventorysetting',
    },
  },
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_inventorysetting',
    name: 'add_inventorysetting',
    component: () => import('./InventorysettingSEPage.vue'),
    meta: { title: tdc('Stock settings'), requiresAuth: true, icon: 'add', requiredRole: 'add_inventorysetting' },
  },
  {
    path: '/change_inventorysetting/:id',
    name: 'change_inventorysetting',
    component: () => import('./InventorysettingSEPage.vue'),
    meta: { title: tdc('Stock settings'), requiresAuth: true, icon: 'edit', requiredRole: 'change_inventorysetting' },
  },
]
