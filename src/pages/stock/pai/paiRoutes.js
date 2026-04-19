
import { tdc } from 'quasar_resaas'

export let paiRoutes = [
  {
    path: '/list_pai',
    name: 'list_pai',
    component: () => import('./PaiLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('pai'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_pai',
    },
  },
  {
    path: '/add_pai',
    name: 'add_pai',
    component: () => import('./PaiSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('pai'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_pai',
    },
  },
  {
    path: '/change_pai/:id',
    name: 'change_pai',
    component: () => import('./PaiSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('pai'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_pai',
    },
  },
  {
    path: '/view_pai/:id',
    name: 'view_pai',
    component: () => import('./PaiVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('pai'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_pai',
    },
  }
]

