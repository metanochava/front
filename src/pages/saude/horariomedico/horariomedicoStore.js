
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useHorariomedicoStore = createBaseStore(
  'horariomedico',
  { app: 'saude', model: 'Horariomedico' },
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
