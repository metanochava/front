import { tdc } from '@metano/quasar_rest_auth'

export let rhRoutes = [
  {
    path: '/list_entidade',
    name: 'list_entidade',
    component: () => import('./entidade/EntidadePage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Scaffold'),
      requiresAuth: true,
      icon: 'inventory_2',
      requiredRole: 'list_entidade',
    },
  },
  {
    path: '/add_entidade',
    name: 'add_entidade',
    component: () => import('./entidade/EntidadeCreatePage.vue'),
    meta: {
      title: tdc('Add de') + ' ' + tdc('Entidade'),
      requiresAuth: true,
      icon: 'inventory_2',
      requiredRole: 'add_entidade',
    },
  },
]
