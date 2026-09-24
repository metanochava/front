import { tdc } from 'quasar_resaas'

// Patient portal. No requiredRole on purpose: a patient has no profile.
// The backend (/api/saude/me/...) enforces the session, the tenant context
// and that the user is a patient with portal access - see
// back/saude/views/patient_portal.py.
export let myHealthRoutes = [
  {
    path: '/my_health',
    name: 'my_health',
    component: () => import('./MyHealthPage.vue'),
    meta: {
      title: tdc('My Health'),
      requiresAuth: true,
      icon: 'favorite',
    },
  },
]
