import { tdc } from 'quasar_resaas'

export let productRoutes = [
  {
    path: '/list_product',
    name: 'list_product',
    component: () => import('./ProductLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Products'),
      requiresAuth: true,
      icon: 'inventory_2',
      requiredRole: 'list_product',
    },
  },
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_product',
    name: 'add_product',
    component: () => import('./ProductSEPage.vue'),
    meta: { title: tdc('New product'), requiresAuth: true, icon: 'add', requiredRole: 'add_product' },
  },
  {
    path: '/change_product/:id',
    name: 'change_product',
    component: () => import('./ProductSEPage.vue'),
    meta: { title: tdc('Edit product'), requiresAuth: true, icon: 'edit', requiredRole: 'change_product' },
  },
]
