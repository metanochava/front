import { tdc } from 'quasar_resaas'

export let promotionRoutes = [
  {
    path: '/list_promotion',
    name: 'list_promotion',
    component: () => import('./PromotionListPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('promotion'),
      requiresAuth: true,
      icon: 'trending_up',
      requiredRole: 'list_promotion',
    },
  },
]
