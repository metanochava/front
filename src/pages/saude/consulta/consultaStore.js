
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useConsultatore = createBaseStore(
  'consulta',
  { url: 'api/saude/consultas', app: 'saude', model: 'Consulta' },
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
