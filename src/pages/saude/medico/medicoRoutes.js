
import { tdc } from 'quasar_resaas'

export let medicoRoutes = [
  {
    path: '/list_medico',
    name: 'list_medico',
    component: () => import('./MedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('medico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_medico',
    },
  },
  {
    path: '/add_medico',
    name: 'add_medico',
    component: () => import('./MedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('medico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_medico',
    },
  },
  {
    path: '/change_medico/:id',
    name: 'change_medico',
    component: () => import('./MedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('medico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_medico',
    },
  },
  {
    path: '/view_medico/:id',
    name: 'view_medico',
    component: () => import('./MedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('medico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_medico',
    },
  }
]
