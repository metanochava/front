import { createBaseStore } from 'quasar_resaas'
import { usePacienteStore } from './../paciente/pacienteStore'

export const useAtestadomedicoStore = createBaseStore(
  'atestadomedico',
  {
    app: 'saude',
    model: 'Atestadomedico'
  },
  {
    state: () => ({

    }),

    getters: {

      actual: (state) => state.row

    },

    actions: {

    },

    hooks: {

      beforeInit() {

      },

      beforeLoad() {

      },

      afterLoad(data) {
        return data
      },

      beforeGet(id) {
        return id
      },

      beforeCreate(form) {

        const Paciente = usePacienteStore()

        if (Paciente.row?.id) {
          form.paciente = Paciente.row.id
        }

        return form
      },

      beforeUpdate(form) {

        const Paciente = usePacienteStore()

        if (Paciente.row?.id) {
          form.paciente = Paciente.row.id
        }

        return form
      },

      afterCreate(data) {
        return data
      },

      afterUpdate(data) {
        return data
      }

    }
  }
)
