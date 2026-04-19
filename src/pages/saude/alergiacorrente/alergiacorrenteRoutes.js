
import { tdc } from 'quasar_resaas'

export let alergiacorrenteRoutes = [
  {
    path: '/list_alergiacorrente',
    name: 'list_alergiacorrente',
    component: () => import('./AlergiacorrenteLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('alergiacorrente'),
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
      title: tdc('Adicionar') + ' ' + tdc('alergiacorrente'),
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
      title: tdc('Editar') + ' ' + tdc('alergiacorrente'),
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
      title: tdc('Visualizar') + ' ' + tdc('alergiacorrente'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_alergiacorrente',
    },
  }
]

