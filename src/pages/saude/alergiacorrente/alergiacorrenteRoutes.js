
import { tdc } from 'quasar_resaas'

export let alergiacorrenteRoutes = [
  {
    path: '/list_alergiacorrente',
    name: 'list_alergiacorrente',
    component: () => import('./AlergiacorrenteLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('current allergy'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_alergiacorrente',
    },
  },
  {
    path: '/add_alergiacorrente',
    name: 'add_alergiacorrente',
    component: () => import('./AlergiacorrenteSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('current allergy'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_alergiacorrente',
    },
  },
  {
    path: '/change_alergiacorrente/:id',
    name: 'change_alergiacorrente',
    component: () => import('./AlergiacorrenteSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('current allergy'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_alergiacorrente',
    },
  },
  {
    path: '/view_alergiacorrente/:id',
    name: 'view_alergiacorrente',
    component: () => import('./AlergiacorrenteVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('current allergy'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_alergiacorrente',
    },
  }
]

