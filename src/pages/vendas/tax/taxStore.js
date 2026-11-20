import { createBaseStore } from 'quasar_resaas'

export const useTaxStore = createBaseStore('tax', { app: 'sales', model: 'Tax' })
