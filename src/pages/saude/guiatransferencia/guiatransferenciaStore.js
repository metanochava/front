
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useGuiatransferenciatore = createBaseStore(
  'guiatransferencia',
  { app: 'saude', model: 'Guiatransferencia' },
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
