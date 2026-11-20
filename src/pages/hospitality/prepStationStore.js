import { createBaseStore } from 'quasar_resaas'

// the branch's preparation stations (hospitality/prepstations/): kitchen, bar
export const usePrepStationStore = createBaseStore('prepstation', { app: 'hospitality', model: 'PrepStation' })
