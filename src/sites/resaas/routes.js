import { tdc } from 'quasar_resaas'

// The RESAAS documentation site (resaas.mytech.co.mz / resaas.dev.mytech.co.mz):
// a landing page and the docs of both libraries, rendered from ./content.
export const resaasSiteRoutes = [
  {
    path: '/',
    component: () => import('./layouts/ResaasLayout.vue'),
    children: [
      {
        // the landing page is the site's root: no /home in the address
        path: '',
        name: 'home',
        component: () => import('./pages/HomePage.vue'),
        meta: { title: tdc('RESAAS documentation') }
      },
      // old links
      { path: '/home', redirect: '/' },
      { path: '/docs', redirect: '/docs/guide/start-here' },
      {
        path: '/docs/:product(guide|django-resaas|quasar-resaas)/:slug(.*)*',
        name: 'doc',
        component: () => import('./pages/DocPage.vue'),
        meta: { title: tdc('Documentation') }
      },
      {
        // this site's own 404, inside its layout
        path: '/:catchAll(.*)*',
        name: 'resaas-404',
        component: () => import('./pages/NotFoundPage.vue'),
        meta: { title: tdc('Page not found') }
      }
    ]
  }
]
