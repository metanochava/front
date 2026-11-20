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
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_productcategory',
    name: 'add_productcategory',
    component: () => import('./ProductcategorySEPage.vue'),
    meta: { title: tdc('New product category'), requiresAuth: true, icon: 'add', requiredRole: 'add_productcategory' },
  },
  {
    path: '/change_productcategory/:id',
    name: 'change_productcategory',
    component: () => import('./ProductcategorySEPage.vue'),
    meta: { title: tdc('Edit product category'), requiresAuth: true, icon: 'edit', requiredRole: 'change_productcategory' },
  },
]
