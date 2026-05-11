
import { tdc } from 'quasar_resaas'

export let funcionario_cargoRoutes = [
  {
    path: '/list_funcionariocargo',
    name: 'list_funcionariocargo',
    component: () => import('./FuncionarioCargoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('funcionario cargo'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_funcionariocargo',
    },
  },
  {
    path: '/add_funcionariocargo',
    name: 'add_funcionariocargo',
    component: () => import('./FuncionarioCargoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('funcionario cargo'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_funcionariocargo',
    },
  },
  {
    path: '/change_funcionariocargo/:id',
    name: 'change_funcionariocargo',
    component: () => import('./FuncionarioCargoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('funcionario cargo'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_funcionariocargo',
    },
  },
  {
    path: '/view_funcionariocargo/:id',
    name: 'view_funcionariocargo',
    component: () => import('./FuncionarioCargoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('funcionario cargo'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_funcionariocargo',
    },
  }
]

