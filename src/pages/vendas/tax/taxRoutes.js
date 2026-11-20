import { tdc } from 'quasar_resaas'

export let taxRoutes = [
  {
    path: '/list_tax',
    name: 'list_tax',
    component: () => import('./TaxLPage.vue'),
    meta: {
      title: tdc('Taxes'),
      requiresAuth: true,
      icon: 'percent',
      requiredRole: 'list_tax',
    },
  },
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_tax',
    name: 'add_tax',
    component: () => import('./TaxSEPage.vue'),
    meta: { title: tdc('New tax'), requiresAuth: true, icon: 'add', requiredRole: 'add_tax' },
  },
  {
    path: '/change_tax/:id',
    name: 'change_tax',
    component: () => import('./TaxSEPage.vue'),
    meta: { title: tdc('Edit tax'), requiresAuth: true, icon: 'edit', requiredRole: 'change_tax' },
  },
]
