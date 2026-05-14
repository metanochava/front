
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const usePacienteStore = createBaseStore(
  'paciente',
  { app: 'saude', model: 'Paciente' },
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
