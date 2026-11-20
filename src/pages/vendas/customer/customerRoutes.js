import { tdc } from 'quasar_resaas'

export let customerRoutes = [
  {
    path: '/list_customer',
    name: 'list_customer',
    component: () => import('./CustomerLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Customers'),
      requiresAuth: true,
      icon: 'groups',
      requiredRole: 'list_customer',
    },
  },
  {
    // a manual form: the type shows the Person or the company's name
    path: '/add_customer',
    name: 'add_customer',
    component: () => import('./CustomerSEPage.vue'),
    meta: {
      title: tdc('New customer'),
      requiresAuth: true,
      icon: 'person_add',
      requiredRole: 'add_customer',
    },
  },
  {
    path: '/change_customer/:id',
    name: 'change_customer',
    component: () => import('./CustomerSEPage.vue'),
    meta: {
      title: tdc('Edit customer'),
      requiresAuth: true,
      icon: 'manage_accounts',
      requiredRole: 'change_customer',
    },
  },
]
