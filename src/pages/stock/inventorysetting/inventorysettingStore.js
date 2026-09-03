import { createBaseStore } from 'quasar_resaas'

export const useInventorysettingStore = createBaseStore(
  'inventorysetting',
  { app: 'inventory', model: 'Inventorysetting' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
