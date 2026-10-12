import { tdc } from 'quasar_resaas'

const crud = (name, model, icon, title) => ({
  path: `/${name}`,
  name,
  component: () => import('./CrmCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name },
})

export let crmRoutes = [
  {
    path: '/view_pipeline',
    name: 'view_pipeline',
    component: () => import('./PipelinePage.vue'),
    meta: { title: tdc('Pipeline'), requiresAuth: true, icon: 'view_kanban', requiredRole: 'pipeline_opportunity' },
  },
  {
    path: '/list_lead',
    name: 'list_lead',
    component: () => import('./LeadLPage.vue'),
    meta: { title: tdc('Leads'), requiresAuth: true, icon: 'person_search', requiredRole: 'list_lead' },
  },
  crud('list_opportunity', 'Opportunity', 'trending_up', 'Opportunities'),
  crud('list_activity', 'Activity', 'event_note', 'Activities'),
  crud('list_stage', 'Stage', 'linear_scale', 'Stages'),
  {
    path: '/view_opportunity/:id',
    name: 'view_opportunity',
    component: () => import('./OpportunityVPage.vue'),
    meta: { title: tdc('Opportunity'), requiresAuth: true, icon: 'trending_up', requiredRole: 'view_opportunity' },
  },
]
