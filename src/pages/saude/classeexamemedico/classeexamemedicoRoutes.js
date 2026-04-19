
import { tdc } from 'quasar_resaas'

export let classeexamemedicoRoutes = [
  {
    path: '/list_classeexamemedico',
    name: 'list_classeexamemedico',
    component: () => import('./ClasseexamemedicoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('classeexamemedico'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_classeexamemedico',
    },
  },
  {
    path: '/add_classeexamemedico',
    name: 'add_classeexamemedico',
    component: () => import('./ClasseexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('classeexamemedico'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_classeexamemedico',
    },
  },
  {
    path: '/change_classeexamemedico/:id',
    name: 'change_classeexamemedico',
    component: () => import('./ClasseexamemedicoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('classeexamemedico'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_classeexamemedico',
    },
  },
  {
    path: '/view_classeexamemedico/:id',
    name: 'view_classeexamemedico',
    component: () => import('./ClasseexamemedicoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('classeexamemedico'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_classeexamemedico',
    },
  }
]

