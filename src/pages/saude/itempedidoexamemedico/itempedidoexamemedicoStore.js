
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useItempedidoexamemedicoStore = createBaseStore(
  'itempedidoexamemedico',
  { app: 'saude', model: 'Itempedidoexamemedico' },
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
