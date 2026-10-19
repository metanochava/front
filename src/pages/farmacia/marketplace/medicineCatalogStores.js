import { createBaseStore } from 'quasar_resaas'

// The common catalogue (Root writes it) and its gallery of photos and videos
// (backend: farmacia/views/medicine_catalog_item.py, medicine_catalog_media.py).
export const useMedicineCatalogItemStore = createBaseStore(
  'medicinecatalogitem',
  { app: 'farmacia', model: 'MedicineCatalogItem' },
  { state: () => ({}), getters: { actual: (state) => state.row }, actions: {} },
)

export const useMedicineCatalogMediaStore = createBaseStore(
  'medicinecatalogmedia',
  // registered as "medicinecatalogmedia" (not the "{model}s" convention)
  { app: 'farmacia', model: 'MedicineCatalogMedia', url: 'farmacia/medicinecatalogmedia' },
  { state: () => ({}), getters: { actual: (state) => state.row }, actions: {} },
)
