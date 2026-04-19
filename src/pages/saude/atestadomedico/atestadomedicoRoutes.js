
import { tdc } from 'quasar_resaas'

export let atestadomedicoRoutes = [
  {
    path: '/list_atestadomedico',
    name: 'list_atestadomedico',
    component: () => import('./AtestadomedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('atestadomedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_atestadomedico',
    },
  },
  {
    path: '/add_atestadomedico',
    name: 'add_atestadomedico',
    component: () => import('./AtestadomedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('atestadomedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_atestadomedico',
    },
  },
  {
    path: '/change_atestadomedico/:id',
    name: 'change_atestadomedico',
    component: () => import('./AtestadomedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('atestadomedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_atestadomedico',
    },
  },
  {
    path: '/view_atestadomedico/:id',
    name: 'view_atestadomedico',
    component: () => import('./AtestadomedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('atestadomedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_atestadomedico',
    },
  }
]

