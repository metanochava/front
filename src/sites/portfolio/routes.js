import { tdc } from 'quasar_resaas'

export const portfolioSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/PortfolioLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: () => import('./pages/HomePage.vue'),
        name: 'home',
        meta: {
          title: tdc('Portfolio')
        }
      }
    ]
  }
]
