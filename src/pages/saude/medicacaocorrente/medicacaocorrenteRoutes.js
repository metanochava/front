
import { tdc } from 'quasar_resaas'

export let medicacaocorrenteRoutes = [
  {
    path: '/list_medicacaocorrente',
    name: 'list_medicacaocorrente',
    component: () => import('./MedicacaocorrenteLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('current medication'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_medicacaocorrente',
    },
  },
  {
    path: '/add_medicacaocorrente',
    name: 'add_medicacaocorrente',
    component: () => import('./MedicacaocorrenteSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('current medication'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_medicacaocorrente',
    },
  },
  {
    path: '/change_medicacaocorrente/:id',
    name: 'change_medicacaocorrente',
    component: () => import('./MedicacaocorrenteSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('current medication'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_medicacaocorrente',
    },
  },
  {
    path: '/view_medicacaocorrente/:id',
    name: 'view_medicacaocorrente',
    component: () => import('./MedicacaocorrenteVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('current medication'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_medicacaocorrente',
    },
  }
]

