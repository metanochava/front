
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useClasseexamemedicotore = createBaseStore(
  'classeexamemedico',
  { app: 'saude', model: 'Classeexamemedico' },
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
