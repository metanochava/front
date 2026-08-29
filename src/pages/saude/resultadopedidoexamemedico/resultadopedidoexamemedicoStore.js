import {
  createBaseStore,
  HTTPAuth,
  url
} from 'quasar_resaas'

export const useResultadopedidoexamemedicoStore = createBaseStore(
  'resultadoexamemedico',
  {
    app: 'saude',
    model: 'Resultadoexamemedico'
  },
  {

    state: () => ({

      pastas: [],
      ficheiros: [],

      caminho: [],

      currentFolder: null

    }),

    getters: {

      actual: (state) => state.row

    },

    actions: {

      //------------------------------------------------
      // Carregar Explorador
      //------------------------------------------------

      async loadExplorer(folder = null, search = '') {

        this.loading = true

        try {

          const { data } = await HTTPAuth.get(

            url({

              type: 'u',

              url: `${this.safeUrl}/explorer/`,

              params: {

                pai: folder,

                search

              }

            })

          )

          this.currentFolder = folder

          this.rows = data.data || data

          this.pastas = this.rows.filter(i => i.tipo.id === 'Folder')

          this.ficheiros = this.rows.filter(i => i.tipo.id === 'File')

          return this.rows

        } finally {

          this.loading = false

        }

      },

      //----------------------------------------------
      // Pesquisa
      //----------------------------------------------

      async searchExplorer(text) {

        return await this.loadExplorer(

          this.currentFolder,

          text

        )

      },

      //----------------------------------------------
      // Abrir Pasta
      //----------------------------------------------

      async openFolder(folder) {

        this.caminho.push(folder)

        await this.loadExplorer(folder.id)

      },

      //----------------------------------------------
      // Raiz
      //----------------------------------------------

      async goRoot() {

        this.caminho = []

        await this.loadExplorer(null)


      },

      //----------------------------------------------
      // Breadcrumb
      //----------------------------------------------

      async goTo(index) {

        this.caminho = this.caminho.slice(

          0,

          index + 1

        )

        const folder = this.caminho[index]

        await this.loadExplorer(

          folder?.id || null

        )

      },

      //----------------------------------------------
      // Criar Pasta/Ficheiro
      //----------------------------------------------

      async createExplorer(form) {

        this.saving = true

        try {

          const { data } = await HTTPAuth.post(

            url({

              type: 'u',

              url: `${this.safeUrl}/explorer/`

            }),

            form

          )

          return data

        }

        finally {

          this.saving = false

        }

      },

      //----------------------------------------------
      // Renomear
      //----------------------------------------------

      async renameExplorer(id, nome) {

        await HTTPAuth.patch(

          url({

            type: 'u',

            url: `${this.safeUrl}/${id}/`

          }),

          {

            nome

          }

        )

      },



      //----------------------------------------------
      // Eliminar
      //----------------------------------------------

      async deleteExplorer(id) {

        await HTTPAuth.delete(

          url({

            type: 'u',

            url: `${this.safeUrl}/${id}/`

          })

        )

      }

    },

    hooks: {

      beforeLoad() {

      },

      afterLoad(data) {

        data

      }

    }

  }

)
