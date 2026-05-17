
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useConsultaStore = createBaseStore(
  'consulta',
  { app: 'saude', model: 'Consulta' },
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
