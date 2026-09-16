
import { tdc } from 'quasar_resaas'

export let medicamentoRoutes = [
  {
    path: '/list_medicamento',
    name: 'list_medicamento',
    component: () => import('./MedicamentoLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('medicine'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_medicamento',
    },
  },
  {
    path: '/add_medicamento',
    name: 'add_medicamento',
    component: () => import('./MedicamentoSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('medicine'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_medicamento',
    },
  },
  {
    path: '/change_medicamento/:id',
    name: 'change_medicamento',
    component: () => import('./MedicamentoSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('medicine'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_medicamento',
    },
  },
  {
    path: '/view_medicamento/:id',
    name: 'view_medicamento',
    component: () => import('./MedicamentoVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('medicine'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_medicamento',
    },
  }
]

