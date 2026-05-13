
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useAlergiacorrentetore = createBaseStore(
  'alergiacorrente',
  { app: 'saude', model: 'Alergiacorrente' },
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
