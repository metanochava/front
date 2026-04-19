
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useMedicamentotore = createBaseStore(
  'medicamento',
  { url: 'api/saude/medicamentos', app: 'saude', model: 'Medicamento' },
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
