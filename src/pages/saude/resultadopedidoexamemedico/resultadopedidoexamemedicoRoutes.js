
import { tdc } from 'quasar_resaas'

export let resultadopedidoexamemedicoRoutes = [
  {
    // the results of the current patient (pacienteStore row, as the other clinical pages)
    path: '/list_resultadopedidoexamemedico',
    name: 'list_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('exam request result'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_resultadoexamemedico',
    },
  },
  {
    path: '/add_resultadopedidoexamemedico',
    name: 'add_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('exam request result'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_resultadoexamemedico',
    },
  },
  {
    path: '/change_resultadopedidoexamemedico/:id',
    name: 'change_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('exam request result'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_resultadoexamemedico',
    },
  },
  {
    path: '/view_resultadopedidoexamemedico/:id',
    name: 'view_resultadopedidoexamemedico',
    component: () => import('./ResultadopedidoexamemedicoVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('exam request result'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_resultadoexamemedico',
    },
  }
]

