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
  // one manual page for add_ and change_ (components/record/useRecordForm)
  {
    path: '/add_batch',
    name: 'add_batch',
    component: () => import('./BatchSEPage.vue'),
    meta: { title: tdc('New lot'), requiresAuth: true, icon: 'add', requiredRole: 'add_batch' },
  },
  {
    path: '/change_batch/:id',
    name: 'change_batch',
    component: () => import('./BatchSEPage.vue'),
    meta: { title: tdc('Edit lot'), requiresAuth: true, icon: 'edit', requiredRole: 'change_batch' },
  },
]
