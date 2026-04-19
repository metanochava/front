
import { tdc } from 'quasar_resaas'

export let medicacaocorrenteRoutes = [
  {
    path: '/list_medicacaocorrente',
    name: 'list_medicacaocorrente',
    component: () => import('./MedicacaocorrenteLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('medicacaocorrente'),
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
      title: tdc('Adicionar') + ' ' + tdc('medicacaocorrente'),
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
      title: tdc('Editar') + ' ' + tdc('medicacaocorrente'),
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
      title: tdc('Visualizar') + ' ' + tdc('medicacaocorrente'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_medicacaocorrente',
    },
  }
]

