
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useMedicamentoStore = createBaseStore(
  'medicamento',
  { app: 'saude', model: 'Medicamento' },
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
