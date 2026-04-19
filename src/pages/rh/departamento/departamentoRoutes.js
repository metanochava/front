
import { tdc } from 'quasar_resaas'

export let departamentoRoutes = [
  {
    path: '/list_departamento',
    name: 'list_departamento',
    component: () => import('./DepartamentoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('departamento'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_departamento',
    },
  },
  {
    path: '/add_departamento',
    name: 'add_departamento',
    component: () => import('./DepartamentoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('departamento'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_departamento',
    },
  },
  {
    path: '/change_departamento/:id',
    name: 'change_departamento',
    component: () => import('./DepartamentoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('departamento'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_departamento',
    },
  },
  {
    path: '/view_departamento/:id',
    name: 'view_departamento',
    component: () => import('./DepartamentoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('departamento'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_departamento',
    },
  }
]

