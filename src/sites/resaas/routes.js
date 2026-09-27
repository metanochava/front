import { tdc } from 'quasar_resaas'

// The RESAAS documentation site (resaas.mytech.co.mz / resaas.dev.mytech.co.mz):
// a landing page and the docs of both libraries, rendered from ./content.
export const resaasSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/ResaasLayout.vue'),
    children: [
      { path: '', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        component: () => import('./pages/HomePage.vue'),
        meta: { title: tdc('RESAAS documentation') }
      },
      { path: '/docs', redirect: '/docs/guide/start-here' },
      {
        path: '/docs/:product(guide|django-resaas|quasar-resaas)/:slug(.*)*',
        name: 'doc',
        component: () => import('./pages/DocPage.vue'),
        meta: { title: tdc('Documentation') }
      }
    ]
  }
]
