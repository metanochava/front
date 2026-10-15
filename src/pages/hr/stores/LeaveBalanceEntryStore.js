import { createBaseStore } from 'quasar_resaas'

export const useLeaveBalanceEntryStore = createBaseStore(
  'leavebalanceentry',
  {
    app: 'hr',
    model: 'LeaveBalanceEntry', url: 'hr/leavebalanceentries'
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
