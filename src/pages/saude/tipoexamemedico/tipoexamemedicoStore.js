
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useTipoexamemedicotore = createBaseStore(
  'tipoexamemedico',
  { url: 'api/saude/tipoexamemedicos', app: 'saude', model: 'Tipoexamemedico' },
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
