import { restRoutes, authRoutes, docsRoutes } from 'quasar_resaas'
import {  MainLayout, CrudPage } from 'quasar_resaas'

import { amalSiteRoutes } from 'src/sites/amal/routes'
import { docodelaSiteRoutes } from 'src/sites/docodela/routes'
import { portfolioSiteRoutes } from 'src/sites/portfolio/routes'

import { stockRoutes } from './../pages/stock/routes'
import { saudeRoutes } from './../pages/saude/routes'
import { vendasRoutes } from './../pages/vendas/routes'
import { farmaciaRoutes } from './../pages/farmacia/routes'

const host = window.location.hostname

const domainRoutes = {
  "clinicaamal.co.mz": amalSiteRoutes,
  "amal.dev.mytech.co.mz": amalSiteRoutes,
  "docodela.co.mz": docodelaSiteRoutes,
  "docodela.dev.mytech.co.mz": docodelaSiteRoutes,
  // the portfolio: add the real domain here (e.g. "metanochava.dev": portfolioSiteRoutes)
  "metano.mytech.co.mz": portfolioSiteRoutes,
  "metano.dev.mytech.co.mz": portfolioSiteRoutes,
}

// Preview a site while developing, without its domain:  http://localhost:9000/?site=portfolio
const previewSites = { portfolio: portfolioSiteRoutes, amal: amalSiteRoutes, docodela: docodelaSiteRoutes }
const previewSite = import.meta.env.DEV
  ? previewSites[new URLSearchParams(window.location.search).get('site')]
  : null

let routes = []

const siteRoutes = previewSite || domainRoutes[host] || []

if(siteRoutes.length !== 0 ){
  routes = [ ...siteRoutes, {path: '/:catchAll(.*)*',component: () => import('pages/ErrorNotFound.vue'), }]
}else{
  routes = [

    ...authRoutes,
    ...docsRoutes,

    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '/home',
          component: () => import('src/pages/IndexPage.vue'),
          name: 'home'
        },
        {
          path: 'authwelcome',
          component: () => import('src/pages/WelcomePage.vue'),
          name: 'authwelcome',
        },
        {
          path: 'crud',
          component:CrudPage,
          name: 'crud_state',
        },

        {
          path: 'crud/:module/:model/go',
          component: CrudPage,
          name: 'crud_route',
        },
        ...restRoutes,
        ...stockRoutes,
        ...saudeRoutes,
        ...vendasRoutes,
        ...farmaciaRoutes],
    },

    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue'),
    },
  ]
}

export default routes
