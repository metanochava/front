
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useReceitamedicatore = createBaseStore(
  'receitamedica',
  { url: 'api/saude/receitamedicas', app: 'saude', model: 'Receitamedica' },
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
