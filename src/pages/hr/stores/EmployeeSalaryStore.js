import { createBaseStore } from 'quasar_resaas'

export const useEmployeeSalaryStore = createBaseStore(
  'employeesalary',
  {
    app: 'hr',
    model: 'EmployeeSalary', url: 'hr/employeesalaries'
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
