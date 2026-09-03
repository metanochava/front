import { createBaseStore } from 'quasar_resaas'

export const useCustomercontactStore = createBaseStore(
  'customercontact',
  { app: 'sales', model: 'Customercontact' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
