import { createBaseStore } from 'quasar_resaas'

export const useStockitemStore = createBaseStore(
  'stockitem',
  { app: 'inventory', model: 'Stockitem' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
