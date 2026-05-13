
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useDoencacorrentetore = createBaseStore(
  'doencacorrente',
  { app: 'saude', model: 'Doencacorrente' },
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
