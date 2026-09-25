import { tdc } from 'quasar_resaas'

// Patient portal - requires the portal capability of the active profile
// (the "Patient" profile has it). UX only: the backend (/api/saude/me/...)
// enforces the session, the tenant context, each section's permission and
// ownership - see back/saude/views/patient_portal.py.
export let myHealthRoutes = [
  {
    path: '/my_health',
    name: 'my_health',
    component: () => import('./MyHealthPage.vue'),
    meta: {
      title: tdc('My Health'),
      requiresAuth: true,
      icon: 'favorite',
      requiredRole: 'view_patient_portal',
    },
  },
]
