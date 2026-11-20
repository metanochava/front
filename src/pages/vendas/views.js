import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the sales models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const salesViews = {
  Customer: {
    label: 'Customer',
    icon: 'groups',
    title: (r) => label(r.company_name),
    statusField: null,
    defaultTab: 'personal',
    tabs: [
      { name: 'personal', label: 'Personal', icon: 'person', person: 'person', permission: 'view_person' },
      { name: 'customercontact', label: 'Customer contacts', icon: 'contact_phone', model: 'CustomerContact', fk: 'customer' },
      { name: 'sale', label: 'Sales', icon: 'point_of_sale', model: 'Sale', fk: 'customer' }
    ]
  },
  CustomerContact: {
    label: 'Customer contact',
    icon: 'contact_phone',
    title: (r) => label(r.customer),
    statusField: null,
    defaultTab: 'personal',
    tabs: [
      { name: 'personal', label: 'Personal', icon: 'person', person: 'person', permission: 'view_person' }
    ]
  },
  Payment: {
    label: 'Payment',
    icon: 'payments',
    title: (r) => label(r.referencia),
    statusField: null
  },
  SaleItem: {
    label: 'Sale item',
    icon: 'description',
    title: (r) => label(r.sale),
    statusField: null
  },
  Tax: {
    label: 'Tax',
    icon: 'percent',
    title: (r) => label(r.name),
    subtitle: (r) => label(r.code),
    statusField: null,
    tabs: [
      { name: 'saleitem', label: 'Sale items', icon: 'list', model: 'SaleItem', fk: 'tax' }
    ]
  }
}
