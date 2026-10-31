
import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const usePedidoexamemedicoStore = createBaseStore(
  'pedidoexamemedico',
  { app: 'saude', model: 'Pedidoexamemedico' },
  {
    state: () => ({
      showDialogModal: false,
      // the request's exams (items action). Not `items`: BaseStore's getter
      // `items` (= rows, the list) shadows a state of that name
      requestItems: []
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
        this.requestItems = data.data
        this.loading = false
      },

      // only the request's exams (items action), without reloading the request
      async loadItems(id){
        const { data } = await HTTPAuth.get(
          url({ type: 'u', url: `${this.safeUrl}/${id}/items` })
        )
        this.requestItems = data.data || []
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
