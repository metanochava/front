import { createBaseStore } from 'quasar_resaas'

export const useSupplierStore = createBaseStore('supplier', { app: 'purchases', model: 'Supplier' })
