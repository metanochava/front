
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useMedicoStore = createBaseStore(
  'medico',
  { app: 'saude', model: 'Medico' },
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
