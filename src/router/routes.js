import { restRoutes, authRoutes } from 'quasar_resaas'
import { rhRoutes } from './../pages/rh/routes'
import { amalSiteRoutes } from 'src/sites/amal/routes'
import { stockRoutes } from './../pages/stock/routes'
import { saudeRoutes } from './../pages/saude/routes'

const host = window.location.hostname

const domainRoutes = {
  "clinicaamal.co.mz": amalSiteRoutes,
}
let routes = []

const siteRoutes = domainRoutes[host] || []

if(siteRoutes.length !== 0 ){
  routes = [ ...siteRoutes, {path: '/:catchAll(.*)*',component: () => import('pages/ErrorNotFound.vue'), }]
}else{
  routes = [
    ...authRoutes,

    {
      path: '/',
      component: () => import('quasar_resaas/layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('src/pages/IndexPage.vue'), name: 'home' },
        {
          path: 'authwelcome',
          component: () => import('src/pages/WelcomePage.vue'),
          name: 'authwelcome',
        },
        {
          path: 'crud',
          component: () => import('quasar_resaas/components/auto/CrudPage.vue'),
          name: 'crud_state',
        },

        {
          path: 'crud/:module/:model/go',
          component: () => import('quasar_resaas/components/auto/CrudPage.vue'),
          name: 'crud_route',
        },
        ...restRoutes,
        ...rhRoutes,
        ...stockRoutes,
        ...saudeRoutes
      ],
    },

    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue'),
    },
  ]
}

export default routes
