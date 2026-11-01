import { tdc } from 'quasar_resaas'

export let clinicalsummaryRoutes = [
  {
    path: '/list_clinicalsummary',
    name: 'list_clinicalsummary',
    component: () => import('./ClinicalsummaryLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('clinical summary'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_clinicalsummary',
    },
  },
  {
    path: '/add_clinicalsummary',
    name: 'add_clinicalsummary',
    component: () => import('./ClinicalsummarySEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('clinical summary'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_clinicalsummary',
    },
  },
  {
    path: '/change_clinicalsummary/:id',
    name: 'change_clinicalsummary',
    component: () => import('./ClinicalsummarySEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('clinical summary'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_clinicalsummary',
    },
  },
  {
    path: '/view_clinicalsummary/:id',
    name: 'view_clinicalsummary',
    component: () => import('./ClinicalsummaryVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('clinical summary'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_clinicalsummary',
    },
  }
]
