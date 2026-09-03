import { tdc } from 'quasar_resaas'

export let productRoutes = [
  {
    path: '/list_product',
    name: 'list_product',
    component: () => import('./ProductLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Produtos'),
      requiresAuth: true,
      icon: 'inventory_2',
      requiredRole: 'list_product',
    },
  },
]
