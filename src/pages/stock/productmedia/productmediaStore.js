import { createBaseStore } from 'quasar_resaas'

export const useProductmediaStore = createBaseStore(
  'productmedia',
  { app: 'inventory', model: 'Productmedia' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
