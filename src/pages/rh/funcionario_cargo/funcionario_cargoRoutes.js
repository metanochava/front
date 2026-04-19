
import { tdc } from 'quasar_resaas'

export let funcionario_cargoRoutes = [
  {
    path: '/list_funcionario_cargo',
    name: 'list_funcionario_cargo',
    component: () => import('./FuncionarioCargoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('funcionario_cargo'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_funcionario_cargo',
    },
  },
  {
    path: '/add_funcionario_cargo',
    name: 'add_funcionario_cargo',
    component: () => import('./FuncionarioCargoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('funcionario_cargo'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_funcionario_cargo',
    },
  },
  {
    path: '/change_funcionario_cargo/:id',
    name: 'change_funcionario_cargo',
    component: () => import('./FuncionarioCargoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('funcionario_cargo'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_funcionario_cargo',
    },
  },
  {
    path: '/view_funcionario_cargo/:id',
    name: 'view_funcionario_cargo',
    component: () => import('./FuncionarioCargoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('funcionario_cargo'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_funcionario_cargo',
    },
  }
]

