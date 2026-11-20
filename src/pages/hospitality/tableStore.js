import { HTTPAuth, HTTPAuthBlob, url, pdfBlobUrl, createBaseStore } from 'quasar_resaas'

// The tables of a bar / restaurant (hospitality/diningtables/): the CRUD comes
// from the base store; the point of sale's board and a table's tab here.
export const useTableStore = createBaseStore(
  'diningtable',
  { app: 'hospitality', model: 'DiningTable' },
  {
    actions: {
      // [{id, name, seats, area, state: free|occupied, tab: {id, total, line_count}, requests: [{id, kind}]}]
      async board() {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/board/` }))
        return data.data || []
      },

      // the table's open tab id (opened when it has none; the same from any device)
      async startTab(id) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/start_tab/` }), {})
        return data.data?.tab
      },

      // a customer's request (call the waiter / the bill) handled
      async handleRequest(requestId) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `hospitality/tablerequests/${requestId}/handle/` }), {})
        return data.data
      },

      // a customer's order from the QR page: on the table's tab, or refused
      async acceptOrder(orderId) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `hospitality/tableorders/${orderId}/accept/` }), {})
        return data.data
      },

      async rejectOrder(orderId) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `hospitality/tableorders/${orderId}/reject/` }), {})
        return data.data
      },

      // the kitchen / bar screen: the tickets still to prepare or serve
      async kitchen(station = null) {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: 'hospitality/preptickets/kitchen/', params: { station: station || undefined } }))
        return data.data || []
      },

      async advanceTicket(ticketId, status) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `hospitality/preptickets/${ticketId}/advance/` }), { status })
        return data.data
      },

      async stations() {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: 'hospitality/prepstations/', params: { active: true, page_size: 50 } }))
        return data.results ?? data ?? []
      },

      // the QR cards PDF of these tables (or every active one): a blob: URL
      async qrCards(ids = []) {
        const res = await HTTPAuthBlob.get(url({
          type: 'u', url: `${this.safeUrl}/qr_cards/`, params: { ids: ids.length ? ids.join(',') : undefined },
        }))
        return pdfBlobUrl(res)
      },
    },
  }
)
