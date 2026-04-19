
import { tdc } from 'quasar_resaas'

export let funcionarioRoutes = [
  {
    path: '/list_funcionario',
    name: 'list_funcionario',
    component: () => import('./FuncionarioLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('funcionario'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_funcionario',
    },
  },
  {
    path: '/add_funcionario',
    name: 'add_funcionario',
    component: () => import('./FuncionarioSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('funcionario'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_funcionario',
    },
  },
  {
    path: '/change_funcionario/:id',
    name: 'change_funcionario',
    component: () => import('./FuncionarioSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('funcionario'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_funcionario',
    },
  },
  {
    path: '/view_funcionario/:id',
    name: 'view_funcionario',
    component: () => import('./FuncionarioVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('funcionario'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_funcionario',
    },
  }
]

