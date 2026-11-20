import { createBaseStore } from 'quasar_resaas'

export const useBatchStore = createBaseStore('batch', { app: 'inventory', model: 'Batch' })
