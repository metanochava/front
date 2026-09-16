
import { tdc } from 'quasar_resaas'

export let dadovitalRoutes = [
  {
    path: '/list_dadovital',
    name: 'list_dadovital',
    component: () => import('./DadovitalLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('vital sign'),
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
      title: tdc('Add') + ' ' + tdc('vital sign'),
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
      title: tdc('Edit') + ' ' + tdc('vital sign'),
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
      title: tdc('View') + ' ' + tdc('vital sign'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_dadovital',
    },
  }
]

