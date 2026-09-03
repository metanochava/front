import { createBaseStore } from 'quasar_resaas'

export const useWarehouseStore = createBaseStore(
  'warehouse',
  { app: 'inventory', model: 'Warehouse' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
