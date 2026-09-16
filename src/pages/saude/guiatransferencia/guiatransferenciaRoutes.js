
import { tdc } from 'quasar_resaas'

export let guiatransferenciaRoutes = [
  {
    path: '/list_guiatransferencia',
    name: 'list_guiatransferencia',
    component: () => import('./GuiatransferenciaLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('transfer referral'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_guiatransferencia',
    },
  },
  {
    path: '/add_guiatransferencia',
    name: 'add_guiatransferencia',
    component: () => import('./GuiatransferenciaSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('transfer referral'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_guiatransferencia',
    },
  },
  {
    path: '/change_guiatransferencia/:id',
    name: 'change_guiatransferencia',
    component: () => import('./GuiatransferenciaSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('transfer referral'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_guiatransferencia',
    },
  },
  {
    path: '/view_guiatransferencia/:id',
    name: 'view_guiatransferencia',
    component: () => import('./GuiatransferenciaVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('transfer referral'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_guiatransferencia',
    },
  }
]

