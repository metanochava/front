import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const useInventorycountStore = createBaseStore(
  'inventorycount',
  { app: 'inventory', model: 'Inventorycount' },
  {
    state: () => ({}),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      async finalizar(id) {
        const { data } = await HTTPAuth.post(
          url({ type: 'u', url: `${this.safeUrl}/${id}/finalizar` })
        )
        this.row = data.data.inventory_count
        return data.data
      },
    },
  }
)
