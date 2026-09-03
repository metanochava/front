import { createBaseStore } from 'quasar_resaas'

export const useInventorycountlineStore = createBaseStore(
  'inventorycountline',
  { app: 'inventory', model: 'Inventorycountline' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
