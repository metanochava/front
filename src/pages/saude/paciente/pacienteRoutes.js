
import { tdc } from 'quasar_resaas'

export let pacienteRoutes = [
  {
    path: '/list_paciente',
    name: 'list_paciente',
    component: () => import('./PacienteLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('paciente'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_paciente',
    },
  },
  {
    path: '/add_paciente',
    name: 'add_paciente',
    component: () => import('./PacienteSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('paciente'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_paciente',
    },
  },
  {
    path: '/change_paciente/:id',
    name: 'change_paciente',
    component: () => import('./PacienteSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('paciente'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_paciente',
    },
  },
  {
    path: '/view_paciente/:id',
    name: 'view_paciente',
    component: () => import('./PacienteVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('paciente'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_paciente',
    },
  }
]

