
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useResultadopedidoexamemedicoStore = createBaseStore(
  'resultadopedidoexamemedico',
  { app: 'saude', model: 'Resultadopedidoexamemedico' },
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
