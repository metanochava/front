
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useExamemedicoStore = createBaseStore(
  'examemedico',
  { app: 'saude', model: 'Examemedico' },
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
