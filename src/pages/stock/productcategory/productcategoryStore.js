import { createBaseStore } from 'quasar_resaas'

export const useProductcategoryStore = createBaseStore(
  'productcategory',
  { app: 'catalog', model: 'Productcategory' },
  {
    state: () => ({}),
    getters: {
      actual: (state) => state.row,
    },
    actions: {},
  }
)
