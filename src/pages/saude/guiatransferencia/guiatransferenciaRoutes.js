
import { tdc } from 'quasar_resaas'

export let guiatransferenciaRoutes = [
  {
    path: '/list_guiatransferencia',
    name: 'list_guiatransferencia',
    component: () => import('./GuiatransferenciaLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('guiatransferencia'),
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
      title: tdc('Adicionar') + ' ' + tdc('guiatransferencia'),
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
      title: tdc('Editar') + ' ' + tdc('guiatransferencia'),
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
      title: tdc('Visualizar') + ' ' + tdc('guiatransferencia'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_guiatransferencia',
    },
  }
]

