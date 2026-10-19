import { tdc } from 'quasar_resaas'

// the pharmacy's own operations (backend permissions are authoritative;
// requiredRole only hides what the user cannot do)
export let counterRoutes = [
  {
    path: '/farmacia_counter',
    name: 'farmacia_counter',
    component: () => import('./CounterPage.vue'),
    meta: { title: tdc('Pharmacy counter'), requiresAuth: true, icon: 'point_of_sale', requiredRole: 'add_countersale' },
  },
  {
    path: '/farmacia_online_orders',
    name: 'farmacia_online_orders',
    component: () => import('./OnlineOrdersPage.vue'),
    meta: { title: tdc('Online orders'), requiresAuth: true, icon: 'shopping_bag', requiredRole: 'list_onlineorder' },
  },
  {
    path: '/farmacia_patient_lookup',
    name: 'farmacia_patient_lookup',
    component: () => import('./PatientLookupPage.vue'),
    meta: { title: tdc('Find patient'), requiresAuth: true, icon: 'person_search', requiredRole: 'lookup_patient_filafarmacia' },
  },
]
