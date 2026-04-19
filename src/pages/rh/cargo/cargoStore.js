
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useCargotore = createBaseStore(
  'cargo',
  { url: 'api/rh/cargos', app: 'rh', model: 'Cargo' },
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
