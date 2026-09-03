import { createBaseStore } from 'quasar_resaas'

export const useCustomerStore = createBaseStore(
  'customer',
  { app: 'sales', model: 'Customer' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
