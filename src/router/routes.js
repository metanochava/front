import { restRoutes, authRoutes, docsRoutes } from 'quasar_resaas'
import {  MainLayout, CrudPage } from 'quasar_resaas'
import { academicaRoutes } from './../pages/academica/routes'
import { pedagogicaRoutes } from './../pages/pedagogica/routes'
import { laboratorioRoutes } from './../pages/laboratorio/routes'

import { amalSiteRoutes } from 'src/sites/amal/routes'
import { docodelaSiteRoutes } from 'src/sites/docodela/routes'
import { portfolioSiteRoutes } from 'src/sites/metano/routes'
import { mytechSiteRoutes } from 'src/sites/mytech/routes'
import { resaasSiteRoutes } from 'src/sites/resaas/routes'

import { stockRoutes } from './../pages/stock/routes'
import { saudeRoutes } from './../pages/saude/routes'
import { hrRoutes } from './../pages/hr/routes'
import { vendasRoutes } from './../pages/vendas/routes'
import { farmaciaRoutes } from './../pages/farmacia/routes'
import { purchasesRoutes } from './../pages/purchases/routes'
import { accountingRoutes } from './../pages/accounting/routes'
import { crmRoutes } from './../pages/crm/routes'
import { workflowRoutes } from './../pages/workflow/routes'
import { hospitalityRoutes, hospitalityPublicRoutes } from './../pages/hospitality/routes'
import { missingFormRoutes } from 'src/components/record/viewRoutes'
import { farmaciaViews } from './../pages/farmacia/views'
import { crmViews } from './../pages/crm/views'
import { salesViews } from './../pages/vendas/views'
import { catalogViews, inventoryViews } from './../pages/stock/views'
import { hrViews } from './../pages/hr/views'
import { academicaViews } from './../pages/academica/views'
import { accountingViews } from './../pages/accounting/views'
import { workflowViews } from './../pages/workflow/views'
import { purchasesViews } from './../pages/purchases/views'

// add_<model> / change_<model>/:id for every model with a list and no form
// page of its own (components/record/RecordFormPage.vue; a read-only endpoint
// shows "cannot be created here" - schema.operations). Not here on purpose:
// Health (saude); the workflow pages with their own actions (sale,
// dispensa, inventorycount, journalentry, purchaseorder); the notifications'
// system records (outbox, delivery attempts); formdefinition and app, which
// have their own pages.
const FORM_SOURCES = [
  ['farmacia', farmaciaViews], ['crm', crmViews], ['sales', salesViews],
  ['catalog', catalogViews], ['inventory', inventoryViews], ['hr', hrViews],
  ['academica', academicaViews], ['accounting', accountingViews], ['workflow', workflowViews],
  ['purchases', purchasesViews],
  // modules without a views.js, and models listed by a module's own page
  ['hospitality', ['DiningArea', 'DiningTable', 'PrepStation', 'TableRequest', 'TableOrder']],
  ['pedagogica', ['LessonPlan', 'Lesson', 'Material', 'Assignment', 'Submission', 'CalendarEvent', 'ProgressNote', 'ClassMessage']],
  ['laboratorio', ['Room', 'Network', 'Workstation', 'Equipment', 'Environment', 'LabSession', 'RemoteAccessSession', 'VirtualLab']],
  ['academica', ['TimetableSlot', 'PriorSchooling']],
  ['crm', ['Opportunity']],
  ['workflow', ['WorkflowInstance']],
]

const host = window.location.hostname

// computed once: the module routes, then the add_/change_ routes they lack
const formRoutesFor = missingFormRoutes(
  [...restRoutes, ...stockRoutes, ...hrRoutes, ...saudeRoutes, ...vendasRoutes, ...farmaciaRoutes,
    ...purchasesRoutes, ...accountingRoutes, ...crmRoutes, ...workflowRoutes, ...academicaRoutes,
    ...pedagogicaRoutes, ...laboratorioRoutes, ...hospitalityRoutes],
  FORM_SOURCES
)

const domainRoutes = {
  "clinicaamal.co.mz": amalSiteRoutes,
  "amal.dev.mytech.co.mz": amalSiteRoutes,
  "docodela.co.mz": docodelaSiteRoutes,
  "docodela.dev.mytech.co.mz": docodelaSiteRoutes,
  // the portfolio: add the real domain here (e.g. "metanochava.dev": portfolioSiteRoutes)

  "cv.metano.cc": portfolioSiteRoutes,
  "cv.metanochavana.link": portfolioSiteRoutes,
  "metano.metano.cc": portfolioSiteRoutes,
  "metano.metanochavana.link": portfolioSiteRoutes,
  "metano.mytech.co.mz": portfolioSiteRoutes,

  "mytech.co.mz": mytechSiteRoutes,
  "dev.mytech.co.mz": mytechSiteRoutes,
  "resaas.mytech.co.mz": resaasSiteRoutes,
  "resaas.dev.mytech.co.mz": resaasSiteRoutes,
}

// Preview a site while developing, without its domain:  http://localhost:9000/?site=portfolio
const previewSites = { portfolio: portfolioSiteRoutes, amal: amalSiteRoutes, docodela: docodelaSiteRoutes, mytech: mytechSiteRoutes, resaas: resaasSiteRoutes }
const previewSite = import.meta.env.DEV
  ? previewSites[new URLSearchParams(window.location.search).get('site')]
  : null

let routes = []

const siteRoutes = previewSite || domainRoutes[host] || []

if(siteRoutes.length !== 0 ){
  // a table's QR page works on every domain of the Entity (its own site too)
  routes = [ ...siteRoutes, ...hospitalityPublicRoutes, {path: '/:catchAll(.*)*',component: () => import('pages/ErrorNotFound.vue'), }]
}else{
  routes = [

    ...authRoutes,
    ...docsRoutes,
    // the page a table's QR code opens (public, outside the main layout)
    ...hospitalityPublicRoutes,

    {
      path: '/',
      component: MainLayout,
      children: [
        {
          // the dashboards (was '/home' / name 'home')
          path: '/dashboard',
          component: () => import('src/pages/IndexPage.vue'),
          name: 'dashboard'
        },
        {
          // the Entity's welcome (was '/authwelcome' / name 'authwelcome');
          // '/home' is now quasar_resaas' start page without an Entity
          path: 'welcome',
          component: () => import('src/pages/WelcomePage.vue'),
          name: 'welcome',
        },
        { path: 'authwelcome', redirect: { name: 'welcome' } },
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
        ...hrRoutes,
        ...saudeRoutes,
        ...vendasRoutes,
        ...farmaciaRoutes,
        ...purchasesRoutes,
        ...accountingRoutes,
        ...crmRoutes,
        ...workflowRoutes,
        ...academicaRoutes,
        ...pedagogicaRoutes,
        ...laboratorioRoutes,
        ...hospitalityRoutes
      ].concat(formRoutesFor),
    },

    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue'),
    },
  ]
}

export default routes
