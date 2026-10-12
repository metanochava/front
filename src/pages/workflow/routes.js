import { tdc } from 'quasar_resaas'

const crud = (name, model, icon, title) => ({
  path: `/${name}`,
  name,
  component: () => import('./WorkflowCrudPage.vue'),
  props: { model },
  meta: { title: tdc(title), requiresAuth: true, icon, requiredRole: name },
})

export let workflowRoutes = [
  {
    path: '/view_approval_inbox',
    name: 'view_approval_inbox',
    component: () => import('./ApprovalInboxPage.vue'),
    meta: { title: tdc('My approvals'), requiresAuth: true, icon: 'inbox', requiredRole: 'inbox_workflowinstance' },
  },
  {
    path: '/view_workflowinstance/:id',
    name: 'view_workflowinstance',
    component: () => import('./WorkflowInstanceVPage.vue'),
    meta: { title: tdc('Approval request'), requiresAuth: true, icon: 'fact_check', requiredRole: 'view_workflowinstance' },
  },
  crud('list_workflowinstance', 'WorkflowInstance', 'fact_check', 'Approval requests'),
  crud('list_workflowdefinition', 'WorkflowDefinition', 'account_tree', 'Workflows'),
  crud('list_workflowstep', 'WorkflowStep', 'format_list_numbered', 'Workflow steps'),
]
