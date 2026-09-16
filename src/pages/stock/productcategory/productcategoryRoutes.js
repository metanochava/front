import { tdc } from 'quasar_resaas'

export let productcategoryRoutes = [
  {
    path: '/list_productcategory',
    name: 'list_productcategory',
    component: () => import('./ProductcategoryLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Product Categories'),
      requiresAuth: true,
      icon: 'category',
      requiredRole: 'list_productcategory',
    },
  },
]
