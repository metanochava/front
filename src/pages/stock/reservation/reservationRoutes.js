import { tdc } from 'quasar_resaas'

export let reservationRoutes = [
  {
    path: '/list_stockreservation',
    name: 'list_stockreservation',
    component: () => import('./StockReservationLPage.vue'),
    meta: { title: tdc('Stock reservations'), requiresAuth: true, icon: 'lock', requiredRole: 'list_stockreservation' },
  },
]
