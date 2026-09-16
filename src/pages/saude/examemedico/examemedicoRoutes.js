
import { tdc } from 'quasar_resaas'

export let examemedicoRoutes = [
  {
    path: '/list_examemedico',
    name: 'list_examemedico',
    component: () => import('./ExamemedicoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('medical exam'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_examemedico',
    },
  },
  {
    path: '/add_examemedico',
    name: 'add_examemedico',
    component: () => import('./ExamemedicoSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('medical exam'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_examemedico',
    },
  },
  {
    path: '/change_examemedico/:id',
    name: 'change_examemedico',
    component: () => import('./ExamemedicoSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('medical exam'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_examemedico',
    },
  },
  {
    path: '/view_examemedico/:id',
    name: 'view_examemedico',
    component: () => import('./ExamemedicoVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('medical exam'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_examemedico',
    },
  }
]

