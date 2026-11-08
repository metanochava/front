
import { /* HTTPAuth, url,*/ createBaseStore } from 'quasar_resaas'

export const useReceitamedicaStore = createBaseStore(
  'receitamedica',
  { app: 'saude', model: 'Receitamedica' },
  {
    state: () => ({

    }),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      // the prescription is saved through its own requests
      // (ReceitamedicaSEPage.saveReceita): tells the right menu (HistoryList)
      // that a record was added
      changed(row) {
        if (row) this.row = row
        return row
      },
    },

    hooks: {
      beforeLoad() {

      },

      afterLoad(data) {
        data
      },

      beforeCreate(form) {
        form
      }
    }
  }
)
