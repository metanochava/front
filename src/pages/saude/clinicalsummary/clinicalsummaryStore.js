import { createBaseStore } from 'quasar_resaas'

// the view is registered as "clinicalsummaries" (not the "{model}s" convention)
export const useClinicalsummaryStore = createBaseStore(
  'clinicalsummary',
  { app: 'saude', model: 'Clinicalsummary', url: 'saude/clinicalsummaries' },
  {
    getters: {
      actual: (state) => state.row,
    },
  }
)
