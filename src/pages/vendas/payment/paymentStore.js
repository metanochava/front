import { createBaseStore } from 'quasar_resaas'

export const usePaymentStore = createBaseStore(
  'payment',
  { app: 'sales', model: 'Payment' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
