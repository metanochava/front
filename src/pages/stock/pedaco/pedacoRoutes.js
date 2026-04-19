
import { tdc } from 'quasar_resaas'

export let pedacoRoutes = [
  {
    path: '/list_pedaco',
    name: 'list_pedaco',
    component: () => import('./PedacoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('pedaco'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_pedaco',
    },
  },
  {
    path: '/add_pedaco',
    name: 'add_pedaco',
    component: () => import('./PedacoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('pedaco'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_pedaco',
    },
  },
  {
    path: '/change_pedaco/:id',
    name: 'change_pedaco',
    component: () => import('./PedacoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('pedaco'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_pedaco',
    },
  },
  {
    path: '/view_pedaco/:id',
    name: 'view_pedaco',
    component: () => import('./PedacoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('pedaco'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_pedaco',
    },
  }
]

