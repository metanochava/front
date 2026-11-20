import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the crm models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const crmViews = {
  Activity: {
    label: 'Activity',
    icon: 'description',
    title: (r) => label(r.lead),
    statusField: null
  },
  Lead: {
    label: 'Lead',
    icon: 'person_search',
    title: (r) => label(r.company_name),
    tabs: [
      { name: 'activity', label: 'Activities', icon: 'list', model: 'Activity', fk: 'lead' },
      { name: 'opportunity', label: 'Opportunities', icon: 'list', model: 'Opportunity', fk: 'lead' }
    ]
  },
  Stage: {
    label: 'Stage',
    icon: 'description',
    title: (r) => label(r.name),
    statusField: null,
    tabs: [
      { name: 'opportunity', label: 'Opportunities', icon: 'list', model: 'Opportunity', fk: 'stage' }
    ]
  }
}
