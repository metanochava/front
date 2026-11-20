import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the workflow models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const workflowViews = {
  WorkflowDefinition: {
    label: 'Workflow definition',
    icon: 'description',
    title: (r) => label(r.name),
    subtitle: (r) => label(r.code),
    statusField: null,
    tabs: [
      { name: 'workflowinstance', label: 'Workflow instances', icon: 'list', model: 'WorkflowInstance', fk: 'definition' },
      { name: 'workflowstep', label: 'Workflow steps', icon: 'list', model: 'WorkflowStep', fk: 'definition' }
    ]
  },
  WorkflowStep: {
    label: 'Workflow step',
    icon: 'description',
    title: (r) => label(r.name),
    statusField: null,
    tabs: [
      { name: 'workflowinstance', label: 'Workflow instances', icon: 'list', model: 'WorkflowInstance', fk: 'current_step' }
    ]
  }
}
