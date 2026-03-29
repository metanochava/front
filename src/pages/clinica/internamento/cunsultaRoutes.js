import { tdc } from 'quasar_resaas'

export let consultaRoutes = [
  {
    path: '/list_consulta',
    name: 'list_consulta',
    component: () => import('./ConsultaLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Scaffold'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_consulta',
    },
  },
  {
    path: '/add_consulta',
    name: 'add_consulta',
    component: () => import('./ConsultaSEPage.vue'),
    meta: {
      title: tdc('Add de') + ' ' + tdc('consulta'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_consulta',
    },
  },
  {
    path: '/change_consulta',
    name: 'change_consulta',
    component: () => import('./ConsultaSEPage.vue'),
    meta: {
      title: tdc('Change de') + ' ' + tdc('consulta'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_consulta',
    },
  }
]


