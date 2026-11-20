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
          url({ type: 'u', url: `${this.safeUrl}/${id}/confirmar/` })
        )
        this.row = data.data
        return data.data
      },

      async reservar(id) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/reservar/` })
        )
        return data.data
      },

      async anular(id) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/anular/` })
        )
        this.row = data.data
        return data.data
      },

      async pagar(id, { valor, forma_pagamento, referencia }) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/pagar/` }),
          { valor, forma_pagamento, referencia }
        )
        this.row = data.data.sale
        return data.data
      },

      // the point of sale: the whole cart as one confirmed sale (prices are
      // the catalog's for the customer; the same checkout_key never creates a
      // second sale - see sales.services.checkout_sale)
      async checkout(payload) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/checkout/` }),
          payload
        )
        this.row = data.data
        return data.data
      },

      // what checkout will charge for one line: {price, price_list}
      async quote({ product, quantidade, customer }) {
        const { data } = await HTTPAuth.get(
          url({ type: 'u', url: `${this.safeUrl}/quote/`, params: { product, quantidade, customer: customer || null } })
        )
        return data.data
      },

      // [{value, label}] - labels canonical English, translated with tdc()
      async paymentMethods() {
        const { data } = await HTTPAuth.get(
          url({ type: 'u', url: `${this.safeUrl}/payment_methods/` })
        )
        return data.data || []
      },

      // ---------------- OPEN TABS (bar, restaurant) ----------------
      // a tab is a named draft sale (sales.services open_tab ... close_tab);
      // every call answers the tab with its lines
      async openTabs() {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/open_tabs/` }))
        return data.data || []
      },

      async openTab({ tab_label, customer, warehouse_id }) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/open_tab/` }),
          { tab_label, customer: customer || null, warehouse_id: warehouse_id || null }
        )
        return data.data
      },

      async getTab(id) {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/${id}/tab/` }))
        return data.data
      },

      async order(id, { product_id, delta = 1 }) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/order/` }), { product_id, delta })
        return data.data
      },

      async discountLine(id, { item, desconto_valor }) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/discount/` }), { item, desconto_valor })
        return data.data
      },

      async splitTab(id, { items, tab_label }) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/split/` }), { items, tab_label: tab_label || null })
        return data.data
      },

      // confirms the tab (a tab already closed is answered again, never twice)
      async closeTab(id, { tax, warehouse_id } = {}) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/close/` }),
          { tax: tax || null, warehouse_id: warehouse_id || null }
        )
        return data.data
      },

      async getDisponibilidade(id) {
        const { data } = await HTTPAuth.get(
          url({ type: 'u', url: `${this.safeUrl}/${id}/disponibilidade/` })
        )
        this.disponibilidade = data.data
        return data.data
      },
    },
  }
)
