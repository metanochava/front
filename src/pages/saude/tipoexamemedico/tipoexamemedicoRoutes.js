
import { tdc } from 'quasar_resaas'

export let tipoexamemedicoRoutes = [
  {
    path: '/list_tipoexamemedico',
    name: 'list_tipoexamemedico',
    component: () => import('./TipoexamemedicoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('exam type'),
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
      title: tdc('Add') + ' ' + tdc('exam type'),
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
      title: tdc('Edit') + ' ' + tdc('exam type'),
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
      title: tdc('View') + ' ' + tdc('exam type'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_tipoexamemedico',
    },
  }
]

