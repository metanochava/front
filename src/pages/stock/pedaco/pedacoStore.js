
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const usePedacotore = createBaseStore(
  'pedaco',
  { url: 'api/stock/pedacos', app: 'stock', model: 'Pedaco' },
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
