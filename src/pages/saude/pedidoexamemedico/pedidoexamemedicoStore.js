
import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const usePedidoexamemedicoStore = createBaseStore(
  'pedidoexamemedico',
  { app: 'saude', model: 'Pedidoexamemedico' },
  {
    state: () => ({
      showDialogModal: false,
      items: []
    }),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      async getItemPedido(id){
        await this.getById(id)
        const { data } = await HTTPAuth.get(
          url({ type: 'u', url: `${this.safeUrl}/${id}/items` })
        )
        this.items = data.data
        this.loading = false
      }
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
