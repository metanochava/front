import { createBaseStore } from 'quasar_resaas'

export const useProductStore = createBaseStore(
  'product',
  { app: 'catalog', model: 'Product' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
