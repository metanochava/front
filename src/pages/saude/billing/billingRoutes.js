import { tdc } from 'quasar_resaas'

// what clinical acts charge and consume (one page, one tab per kind)
export let billingRoutes = [
  {
    path: '/list_clinicalbillingrule',
    name: 'list_clinicalbillingrule',
    component: () => import('./ClinicalBillingPage.vue'),
    meta: { title: tdc('Billing and materials'), requiresAuth: true, icon: 'request_quote', requiredRole: 'list_clinicalbillingrule' },
  },
  {
    path: '/list_clinicalcharge',
    name: 'list_clinicalcharge',
    component: () => import('./ClinicalBillingPage.vue'),
    meta: { title: tdc('Charges'), requiresAuth: true, icon: 'receipt_long', requiredRole: 'list_clinicalcharge' },
  },
]
