import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const useFilafarmaciaStore = createBaseStore(
  'filafarmacia',
  { app: 'farmacia', model: 'Filafarmacia' },
  {
    state: () => ({}),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      async revisar(id, { aprovado, motivo_rejeicao, employee_id }) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/revisar` }),
          { aprovado, motivo_rejeicao, employee_id }
        )
        this.row = data.data
        return data.data
      },

      async dispensar(id, { employee_id, warehouse_id, itens }) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/dispensar` }),
          { employee_id, warehouse_id, itens }
        )
        this.row = data.data.fila
        return data.data
      },

      async concluir(id) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/concluir` })
        )
        this.row = data.data
        return data.data
      },
    },
  }
)
