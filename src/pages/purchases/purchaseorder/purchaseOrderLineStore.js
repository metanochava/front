import { createBaseStore } from 'quasar_resaas'

export const usePurchaseOrderLineStore = createBaseStore(
  'purchaseorderline',
  { app: 'purchases', model: 'PurchaseOrderLine' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
