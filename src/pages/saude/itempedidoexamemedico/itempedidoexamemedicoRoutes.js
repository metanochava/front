
import { tdc } from 'quasar_resaas'

export let itempedidoexamemedicoRoutes = [
  {
    path: '/list_itempedidoexamemedico',
    name: 'list_itempedidoexamemedico',
    component: () => import('./ItemPedidoexamemedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('itempedidoexamemedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_itempedidoexamemedico',
    },
  },
  {
    path: '/add_itempedidoexamemedico',
    name: 'add_itempedidoexamemedico',
    component: () => import('./ItemPedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('itempedidoexamemedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_itempedidoexamemedico',
    },
  },
  {
    path: '/change_itempedidoexamemedico/:id',
    name: 'change_itempedidoexamemedico',
    component: () => import('./ItemPedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('itempedidoexamemedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_itempedidoexamemedico',
    },
  },
  {
    path: '/view_itempedidoexamemedico/:id',
    name: 'view_itempedidoexamemedico',
    component: () => import('./ItemPedidoexamemedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('itempedidoexamemedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_itempedidoexamemedico',
    },
  }
]

