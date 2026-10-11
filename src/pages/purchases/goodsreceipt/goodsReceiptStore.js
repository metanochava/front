import { createBaseStore } from 'quasar_resaas'

export const useGoodsReceiptStore = createBaseStore(
  'goodsreceipt',
  { app: 'purchases', model: 'GoodsReceipt' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
