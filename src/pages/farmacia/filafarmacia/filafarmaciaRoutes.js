
import { tdc } from 'quasar_resaas'

export let filafarmaciaRoutes = [
  {
    path: '/list_filafarmacia',
    name: 'list_filafarmacia',
    component: () => import('./FilafarmaciaLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Pharmacy Queue'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_filafarmacia',
    },
  },
  {
    path: '/add_filafarmacia',
    name: 'add_filafarmacia',
    component: () => import('./FilafarmaciaSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('Pharmacy Queue'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_filafarmacia',
    },
  },
  {
    path: '/change_filafarmacia/:id',
    name: 'change_filafarmacia',
    component: () => import('./FilafarmaciaSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('Pharmacy Queue'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_filafarmacia',
    },
  },
  {
    path: '/view_filafarmacia/:id',
    name: 'view_filafarmacia',
    component: () => import('./FilafarmaciaVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('Pharmacy Queue'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_filafarmacia',
    },
  }
]
