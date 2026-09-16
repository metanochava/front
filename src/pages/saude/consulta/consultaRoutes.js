
import { tdc } from 'quasar_resaas'

export let consultaRoutes = [
  {
    path: '/list_consulta',
    name: 'list_consulta',
    component: () => import('./ConsultaLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('consultation'),
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
      title: tdc('Add') + ' ' + tdc('consultation'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_consulta',
    },
  },
  {
    path: '/change_consulta/:id',
    name: 'change_consulta',
    component: () => import('./ConsultaSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('consultation'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_consulta',
    },
  },
  {
    path: '/view_consulta/:id',
    name: 'view_consulta',
    component: () => import('./ConsultaVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('consultation'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_consulta',
    },
  }
]

