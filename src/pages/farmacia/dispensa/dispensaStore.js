import { createBaseStore } from 'quasar_resaas'

export const useDispensaStore = createBaseStore(
  'dispensa',
  { app: 'farmacia', model: 'Dispensa' },
  {
    state: () => ({}),

    getters: {
      actual: (state) => state.row,
    },

    actions: {},
  }
)
