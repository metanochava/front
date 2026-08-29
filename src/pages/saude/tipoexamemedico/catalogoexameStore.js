
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useCatalogoexameStore = createBaseStore(
  'catalogoexame',
  { app: 'saude', model: 'Catalogoexame' },
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
