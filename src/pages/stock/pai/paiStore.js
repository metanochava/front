
import { /*HTTPAuth, */ /*url, */ createBaseStore } from 'quasar_resaas'

export const usePaitore = createBaseStore(
  'pai',
  { url: 'api/stock/pais', app: 'stock', model: 'Pai' },
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
