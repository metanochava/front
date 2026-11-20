import { labelOf as label } from 'src/components/record/viewRoutes'

// The record pages (view_<model>, components/record/RecordViewPage) of the farmacia models
// that have no view page of their own: the header and the tabs after "Details" - the related
// models' records that point at the record (model + its field, fk). A custom view_ page keeps
// its own route, so its model is not listed here. A tab shows only with list_<model>.

export const farmaciaViews = {
  CounterSale: {
    label: 'Counter sale',
    icon: 'description',
    title: (r) => label(r.online_order),
    statusField: null
  },
  ItemDispensa: {
    label: 'Dispensation item',
    icon: 'description',
    title: (r) => label(r.dispensa),
    statusField: null
  },
  MedicineCatalogItem: {
    label: 'Medicine catalogue item',
    icon: 'description',
    title: (r) => label(r.name),
    subtitle: (r) => label(r.code),
    statusField: null,
    tabs: [
      { name: 'medicinecatalogmedia', label: 'Medicine catalogue media', icon: 'list', model: 'MedicineCatalogMedia', fk: 'catalog_item' },
      { name: 'pharmacyoffer', label: 'Pharmacy offers', icon: 'list', model: 'PharmacyOffer', fk: 'catalog_item' }
    ]
  },
  MedicineCatalogMedia: {
    label: 'Medicine catalogue media',
    icon: 'description',
    title: (r) => label(r.catalog_item),
    statusField: null
  },
  OnlineOrder: {
    label: 'Online order',
    icon: 'description',
    title: (r) => label(r.reference)
  },
  PharmacyListing: {
    label: 'Pharmacy listing',
    icon: 'description',
    statusField: null
  },
  PharmacyOffer: {
    label: 'Pharmacy offer',
    icon: 'description',
    title: (r) => label(r.catalog_item),
    statusField: null
  }
}
