import { tdc } from 'quasar_resaas'

export let productcategoryRoutes = [
  {
    path: '/list_productcategory',
    name: 'list_productcategory',
    component: () => import('./ProductcategoryLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Categorias de Produto'),
      requiresAuth: true,
      icon: 'category',
      requiredRole: 'list_productcategory',
    },
  },
]
