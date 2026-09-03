import { createBaseStore } from 'quasar_resaas'

export const useProductStore = createBaseStore(
  'product',
  { app: 'inventory', model: 'Product' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
