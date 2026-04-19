
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useFuncionariotore = createBaseStore(
  'funcionario',
  { url: 'api/rh/funcionarios', app: 'rh', model: 'Funcionario' },
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
