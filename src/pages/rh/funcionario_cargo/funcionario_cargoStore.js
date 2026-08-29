
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useFuncionarioCargoStore = createBaseStore(
  'funcionario_cargo',
  {  app: 'rh', model: 'FuncionarioCargo' },
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
