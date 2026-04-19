
import { tdc } from 'quasar_resaas'

export let tipoexamemedicoRoutes = [
  {
    path: '/list_tipoexamemedico',
    name: 'list_tipoexamemedico',
    component: () => import('./TipoexamemedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('tipoexamemedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_tipoexamemedico',
    },
  },
  {
    path: '/add_tipoexamemedico',
    name: 'add_tipoexamemedico',
    component: () => import('./TipoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('tipoexamemedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_tipoexamemedico',
    },
  },
  {
    path: '/change_tipoexamemedico/:id',
    name: 'change_tipoexamemedico',
    component: () => import('./TipoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('tipoexamemedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_tipoexamemedico',
    },
  },
  {
    path: '/view_tipoexamemedico/:id',
    name: 'view_tipoexamemedico',
    component: () => import('./TipoexamemedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('tipoexamemedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_tipoexamemedico',
    },
  }
]

