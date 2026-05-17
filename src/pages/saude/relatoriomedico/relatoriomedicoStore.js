
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useRelatoriomedicoStore = createBaseStore(
  'relatoriomedico',
  { app: 'saude', model: 'Relatoriomedico' },
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
