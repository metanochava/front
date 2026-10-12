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
      },
      {
        // this site's own 404, inside its layout (header, footer, style)
        path: '/:catchAll(.*)*',
        name: 'portfolio-404',
        component: () => import('./pages/NotFoundPage.vue'),
        meta: { title: tdc('Page not found') },
      },
    ]
  }
]
