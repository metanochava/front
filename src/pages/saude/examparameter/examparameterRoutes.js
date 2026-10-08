import { tdc } from 'quasar_resaas'

// Exam configuration (lab phase 6): parameters and reference ranges. Both
// are generic AutoCrud screens - the backend (BaseAPIView, examparameters /
// examreferenceranges) validates and authorises.
export const examparameterRoutes = [
  {
    path: '/list_examparameter',
    name: 'list_examparameter',
    component: () => import('./ExamparameterLPage.vue'),
    meta: {
      title: tdc('Exam Parameters'),
      requiresAuth: true,
      icon: 'tune',
      requiredRole: 'list_examparameter',
    },
  },
  {
    path: '/list_examreferencerange',
    name: 'list_examreferencerange',
    component: () => import('./ExamreferencerangeLPage.vue'),
    meta: {
      title: tdc('Exam Reference Ranges'),
      requiresAuth: true,
      icon: 'straighten',
      requiredRole: 'list_examreferencerange',
    },
  },
]
