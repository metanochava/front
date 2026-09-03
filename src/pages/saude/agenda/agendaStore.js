import { createBaseStore } from 'quasar_resaas'

export const useAgendaStore = createBaseStore(
  'agenda',
  { app: 'saude', model: 'Agenda' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
