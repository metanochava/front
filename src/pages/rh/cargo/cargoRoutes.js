
import { tdc } from 'quasar_resaas'

export let cargoRoutes = [
  {
    path: '/list_cargo',
    name: 'list_cargo',
    component: () => import('./CargoLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('cargo'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_cargo',
    },
  },
  {
    path: '/add_cargo',
    name: 'add_cargo',
    component: () => import('./CargoSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('cargo'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_cargo',
    },
  },
  {
    path: '/change_cargo/:id',
    name: 'change_cargo',
    component: () => import('./CargoSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('cargo'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_cargo',
    },
  },
  {
    path: '/view_cargo/:id',
    name: 'view_cargo',
    component: () => import('./CargoVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('cargo'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_cargo',
    },
  }
]

