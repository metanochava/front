
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const usePedidoexamemedicotore = createBaseStore(
  'pedidoexamemedico',
  { app: 'saude', model: 'Pedidoexamemedico' },
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
