import { createBaseStore } from 'quasar_resaas'

export const useSaleitemStore = createBaseStore(
  'saleitem',
  { app: 'sales', model: 'Saleitem' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
