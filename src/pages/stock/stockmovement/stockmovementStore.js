import { createBaseStore } from 'quasar_resaas'

export const useStockmovementStore = createBaseStore(
  'stockmovement',
  { app: 'inventory', model: 'Stockmovement' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
