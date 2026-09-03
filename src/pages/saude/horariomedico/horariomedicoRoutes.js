
import { tdc } from 'quasar_resaas'

export let horariomedicoRoutes = [
  {
    path: '/list_horariomedico',
    name: 'list_horariomedico',
    component: () => import('./HorariomedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('horariomedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_horariomedico',
    },
  },
  {
    path: '/add_horariomedico',
    name: 'add_horariomedico',
    component: () => import('./HorariomedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('horariomedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_horariomedico',
    },
  },
  {
    path: '/change_horariomedico/:id',
    name: 'change_horariomedico',
    component: () => import('./HorariomedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('horariomedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_horariomedico',
    },
  },
  {
    path: '/view_horariomedico/:id',
    name: 'view_horariomedico',
    component: () => import('./HorariomedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('horariomedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_horariomedico',
    },
  }
]
