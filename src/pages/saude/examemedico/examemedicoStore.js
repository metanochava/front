
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useExamemedicotore = createBaseStore(
  'examemedico',
  { url: 'api/saude/examemedicos', app: 'saude', model: 'Examemedico' },
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
