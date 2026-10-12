import { tdc } from 'quasar_resaas'

export let batchRoutes = [
  {
    path: '/list_batch',
    name: 'list_batch',
    component: () => import('./BatchLPage.vue'),
    meta: { title: tdc('Lots'), requiresAuth: true, icon: 'qr_code_2', requiredRole: 'list_batch' },
  },
  {
    path: '/view_expiring_batches',
    name: 'view_expiring_batches',
    component: () => import('./ExpiringBatchesPage.vue'),
    meta: { title: tdc('Expiring lots'), requiresAuth: true, icon: 'event_busy', requiredRole: 'expiring_batch' },
  },
]
