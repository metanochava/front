
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const usePacientetore = createBaseStore(
  'paciente',
  { app: 'clinica', model: 'Paciente' },
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
