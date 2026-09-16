
import { tdc } from 'quasar_resaas'

export let atestadomedicoRoutes = [
  {
    path: '/list_atestadomedico',
    name: 'list_atestadomedico',
    component: () => import('./AtestadomedicoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('medical certificate'),
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
      title: tdc('Add') + ' ' + tdc('medical certificate'),
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
      title: tdc('Edit') + ' ' + tdc('medical certificate'),
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
      title: tdc('View') + ' ' + tdc('medical certificate'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_atestadomedico',
    },
  }
]

