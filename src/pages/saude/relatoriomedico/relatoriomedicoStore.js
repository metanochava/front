
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useRelatoriomedicotore = createBaseStore(
  'relatoriomedico',
  { url: 'api/saude/relatoriomedicos', app: 'saude', model: 'Relatoriomedico' },
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
