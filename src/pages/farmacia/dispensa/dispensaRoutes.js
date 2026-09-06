
import { tdc } from 'quasar_resaas'

export let dispensaRoutes = [
  {
    path: '/list_dispensa',
    name: 'list_dispensa',
    component: () => import('./DispensaLPage.vue'),
    meta: {
      title: tdc('Vista de') + ' ' + tdc('Dispensas'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_dispensa',
    },
  },
  {
    path: '/view_dispensa/:id',
    name: 'view_dispensa',
    component: () => import('./DispensaVPage.vue'),
    meta: {
      title: tdc('Visualizar') + ' ' + tdc('Dispensa'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_dispensa',
    },
  }
]
