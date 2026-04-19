
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useFuncionarioCargotore = createBaseStore(
  'funcionario_cargo',
  { url: 'api/rh/funcionario_cargos', app: 'rh', model: 'FuncionarioCargo' },
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
