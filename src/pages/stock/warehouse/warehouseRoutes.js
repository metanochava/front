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
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_warehouse',
    name: 'add_warehouse',
    component: () => import('./WarehouseSEPage.vue'),
    meta: { title: tdc('New warehouse'), requiresAuth: true, icon: 'add', requiredRole: 'add_warehouse' },
  },
  {
    path: '/change_warehouse/:id',
    name: 'change_warehouse',
    component: () => import('./WarehouseSEPage.vue'),
    meta: { title: tdc('Edit warehouse'), requiresAuth: true, icon: 'edit', requiredRole: 'change_warehouse' },
  },
]
