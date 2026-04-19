
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useMedicacaocorrentetore = createBaseStore(
  'medicacaocorrente',
  { url: 'api/saude/medicacaocorrentes', app: 'saude', model: 'Medicacaocorrente' },
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
