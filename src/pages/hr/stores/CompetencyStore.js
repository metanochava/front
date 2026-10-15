import { createBaseStore } from 'quasar_resaas'

export const useCompetencyStore = createBaseStore(
  'competency',
  {
    app: 'hr',
    model: 'Competency', url: 'hr/competencies'
  },
  {
    state: () => ({

    }),

    getters: {

    },

    actions: {

    }
  }
)
