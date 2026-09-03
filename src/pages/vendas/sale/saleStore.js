import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const useSaleStore = createBaseStore(
  'sale',
  { app: 'sales', model: 'Sale' },
  {
    state: () => ({
      disponibilidade: [],
    }),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      async confirmar(id) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/confirmar` })
        )
        this.row = data.data
        return data.data
      },

      async anular(id) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/anular` })
        )
        this.row = data.data
        return data.data
      },

      async pagar(id, { valor, forma_pagamento, referencia }) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/pagar` }),
          { valor, forma_pagamento, referencia }
        )
        this.row = data.data.sale
        return data.data
      },

      async getDisponibilidade(id) {
        const { data } = await HTTPAuth.get(
          url({ type: 'u', url: `${this.safeUrl}/${id}/disponibilidade` })
        )
        this.disponibilidade = data.data
        return data.data
      },
    },
  }
)
