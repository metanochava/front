import { createBaseStore } from 'quasar_resaas'

export const usePricelistStore = createBaseStore('priceList', { app: 'catalog', model: 'PriceList' })
