
import { tdc } from 'quasar_resaas'

export let itempedidoexamemedicoRoutes = [
  {
    path: '/list_itempedidoexamemedico',
    name: 'list_itempedidoexamemedico',
    component: () => import('./ItemPedidoexamemedicoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('exam request item'),
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
      title: tdc('Add') + ' ' + tdc('exam request item'),
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
      title: tdc('Edit') + ' ' + tdc('exam request item'),
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
      title: tdc('View') + ' ' + tdc('exam request item'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_itempedidoexamemedico',
    },
  }
]

