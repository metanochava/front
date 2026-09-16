import { tdc } from 'quasar_resaas'

export let paymentRoutes = [
  {
    path: '/list_payment',
    name: 'list_payment',
    component: () => import('./PaymentLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('Payments'),
      requiresAuth: true,
      icon: 'payments',
      requiredRole: 'list_payment',
    },
  },
]
