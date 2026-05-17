
import { tdc } from 'quasar_resaas'

export let resultadopedidoexamemedicoRoutes = [
  {
    path: '/list_resultadopedidoexamemedico',
    name: 'list_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('resultadopedidoexamemedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_resultadopedidoexamemedico',
    },
  },
  {
    path: '/add_resultadopedidoexamemedico',
    name: 'add_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('resultadopedidoexamemedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_resultadopedidoexamemedico',
    },
  },
  {
    path: '/change_resultadopedidoexamemedico/:id',
    name: 'change_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('resultadopedidoexamemedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_resultadopedidoexamemedico',
    },
  },
  {
    path: '/view_resultadopedidoexamemedico/:id',
    name: 'view_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('resultadopedidoexamemedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_resultadopedidoexamemedico',
    },
  }
]

