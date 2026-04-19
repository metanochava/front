
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const useDepartamentotore = createBaseStore(
  'departamento',
  { url: 'api/rh/departamentos', app: 'rh', model: 'Departamento' },
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
