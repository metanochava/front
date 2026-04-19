
import { tdc } from 'quasar_resaas'

export let contratoRoutes = [
  {
    path: '/list_contrato',
    name: 'list_contrato',
    component: () => import('./ContratoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('contrato'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_contrato',
    },
  },
  {
    path: '/add_contrato',
    name: 'add_contrato',
    component: () => import('./ContratoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('contrato'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_contrato',
    },
  },
  {
    path: '/change_contrato/:id',
    name: 'change_contrato',
    component: () => import('./ContratoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('contrato'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_contrato',
    },
  },
  {
    path: '/view_contrato/:id',
    name: 'view_contrato',
    component: () => import('./ContratoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('contrato'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_contrato',
    },
  }
]

