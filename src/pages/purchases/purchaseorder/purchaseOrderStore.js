import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

// The status changes are domain actions of the backend (purchases.services):
// each one answers the updated order, or 409 when the status does not allow it.
export const usePurchaseOrderStore = createBaseStore(
  'purchaseorder',
  { app: 'purchases', model: 'PurchaseOrder' },
  {
    state: () => ({}),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      async runAction(id, action, payload = {}) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/${action}/` }),
          payload
        )
        this.row = action === 'receive' ? data.order : data
        return data
      },

      submit(id) { return this.runAction(id, 'submit') },
      returnToDraft(id) { return this.runAction(id, 'return_to_draft') },
      approve(id) { return this.runAction(id, 'approve') },
      cancel(id, reason) { return this.runAction(id, 'cancel', { reason }) },
      receive(id, payload) { return this.runAction(id, 'receive', payload) },
    },
  }
)
