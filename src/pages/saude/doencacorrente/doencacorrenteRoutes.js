
import { tdc } from 'quasar_resaas'

export let doencacorrenteRoutes = [
  {
    path: '/list_doencacorrente',
    name: 'list_doencacorrente',
    component: () => import('./DoencacorrenteLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('doencacorrente'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_doencacorrente',
    },
  },
  {
    path: '/add_doencacorrente',
    name: 'add_doencacorrente',
    component: () => import('./DoencacorrenteSEPage.vue'),
    meta: {
      title: tdc('Adicionar') + ' ' + tdc('doencacorrente'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_doencacorrente',
    },
  },
  {
    path: '/change_doencacorrente/:id',
    name: 'change_doencacorrente',
    component: () => import('./DoencacorrenteSEPage.vue'),
    meta: {
      title: tdc('Editar') + ' ' + tdc('doencacorrente'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_doencacorrente',
    },
  },
  {
    path: '/view_doencacorrente/:id',
    name: 'view_doencacorrente',
    component: () => import('./DoencacorrenteVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('doencacorrente'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_doencacorrente',
    },
  }
]

