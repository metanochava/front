
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useDoencacorrenteStore = createBaseStore(
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
