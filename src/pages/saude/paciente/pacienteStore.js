
import {  HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const usePacienteStore = createBaseStore(
  'paciente',
  { app: 'saude', model: 'Paciente' },
  {
    state: () => ({
      person: null,
      user: null
    }),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      async getPessoa() {
        const rsp = await HTTPAuth.get(url({ type: 'u', url: 'django_resaas/persons/' + this.row?.person_id, params: { } }))
        this.person = rsp.data
        return rsp.data
      },
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
