
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useAtestadomedicoStore = createBaseStore(
  'atestadomedico',
  { app: 'saude', model: 'Atestadomedico' },
  {
    state: () => ({

    }),

    getters: {
      actual: (state) => state.row,
    },

    actions: {

    },

    hooks: {
      beforeLoad() {

      },

      afterLoad(data) {
        data
      },

      beforeCreate(form) {
        form
      }
    }
  }
)
