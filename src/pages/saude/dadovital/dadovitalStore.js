
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useDadovitaltore = createBaseStore(
  'dadovital',
  { url: 'api/saude/dadovitals', app: 'saude', model: 'Dadovital' },
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
