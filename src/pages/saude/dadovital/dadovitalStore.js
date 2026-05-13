
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useDadovitaltore = createBaseStore(
  'dadovital',
  { app: 'saude', model: 'Dadovital' },
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
