
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas' 

export const usePacientetore = createBaseStore(
  'paciente',
  { url: 'api/clinica/pacientes', app: 'clinica', model: 'Paciente' },
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
