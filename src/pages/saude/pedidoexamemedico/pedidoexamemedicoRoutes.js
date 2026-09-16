
import { tdc } from 'quasar_resaas'

export let pedidoexamemedicoRoutes = [
  {
    path: '/list_pedidoexamemedico',
    name: 'list_pedidoexamemedico',
    component: () => import('./PedidoexamemedicoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('exam request'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_pedidoexamemedico',
    },
  },
  {
    path: '/add_pedidoexamemedico',
    name: 'add_pedidoexamemedico',
    component: () => import('./PedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('exam request'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_pedidoexamemedico',
    },
  },
  {
    path: '/change_pedidoexamemedico/:id',
    name: 'change_pedidoexamemedico',
    component: () => import('./PedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('exam request'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_pedidoexamemedico',
    },
  },
  {
    path: '/view_pedidoexamemedico/:id',
    name: 'view_pedidoexamemedico',
    component: () => import('./PedidoexamemedicoVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('exam request'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_pedidoexamemedico',
    },
  }
]

