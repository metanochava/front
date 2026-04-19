
import { tdc } from 'quasar_resaas'

export let relatoriomedicoRoutes = [
  {
    path: '/list_relatoriomedico',
    name: 'list_relatoriomedico',
    component: () => import('./RelatoriomedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('relatoriomedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_relatoriomedico',
    },
  },
  {
    path: '/add_relatoriomedico',
    name: 'add_relatoriomedico',
    component: () => import('./RelatoriomedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('relatoriomedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_relatoriomedico',
    },
  },
  {
    path: '/change_relatoriomedico/:id',
    name: 'change_relatoriomedico',
    component: () => import('./RelatoriomedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('relatoriomedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_relatoriomedico',
    },
  },
  {
    path: '/view_relatoriomedico/:id',
    name: 'view_relatoriomedico',
    component: () => import('./RelatoriomedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('relatoriomedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_relatoriomedico',
    },
  }
]

