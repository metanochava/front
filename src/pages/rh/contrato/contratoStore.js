
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useContratoStore = createBaseStore(
  'contrato',
  { app: 'rh', model: 'Contrato' },
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
