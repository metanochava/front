
import { tdc } from 'quasar_resaas'

export let dadovitalRoutes = [
  {
    path: '/list_dadovital',
    name: 'list_dadovital',
    component: () => import('./DadovitalLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('dadovital'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_dadovital',
    },
  },
  {
    path: '/add_dadovital',
    name: 'add_dadovital',
    component: () => import('./DadovitalSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('dadovital'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_dadovital',
    },
  },
  {
    path: '/change_dadovital/:id',
    name: 'change_dadovital',
    component: () => import('./DadovitalSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('dadovital'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_dadovital',
    },
  },
  {
    path: '/view_dadovital/:id',
    name: 'view_dadovital',
    component: () => import('./DadovitalVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('dadovital'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_dadovital',
    },
  }
]

