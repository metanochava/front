import { defineStore } from 'pinia'
// import { getStorage, setStorage } from '../boot/storage'
import { HTTPAuth, url } from '../boot/api'
// import { tdc } from '../boot/base'
import { buildFormFromSchema } from '@metano/quasar_rest_auth'

export const UserStore = defineStore('entidade', {
  state: () => ({
    url: 'saas/Modelos',
    campos: [],
    linhas: [],
    linha: null,
    search: '',
    filters: {},
    pagination: {
      page: 1,
      linhasPorPagina: 10,
      linhasNumero: 0,
    },
    loading: false,
  }),

  getters: {
    linha: (state) => state.linha || 'Line',
  },

  actions: {
    async load() {
      this.campos = await buildFormFromSchema('django_saas', 'User')
      this.loadData({ pagination: this.pagination, search: '', filters: this.filters })
    },

    async loadData({ pagination: pg, search, filters }) {
      this.loading = true
      try {
        const { data } = await HTTPAuth.get(
          url({
            type: 'u',
            url: this.url + '',
            params: { page: pg.page, page_size: pg.linhasPerPage, search, ...filters },
          }),
        )

        this.linhas = data.results || data
        this.pagination.linhasNumber = data.count || this.linhas.length
      } finally {
        this.loading = false
      }
    },

    async save() {
      this.loading = true
      await HTTPAuth.post(url({ type: 'u', url: this.url + '', params: {} }), this.form)
        .then((res) => {
          this.loading = false
          this.linhas = res.data.results || res.data
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },

    async update() {
      this.loading = true
      await HTTPAuth.update(url({ type: 'u', url: this.url + '', params: {} }), this.form)
        .then((res) => {
          this.loading = false
          this.linha = res.data.results || res.data
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },

    async remove(linha) {
      await HTTPAuth.delete(url({ type: 'u', url: `${this.url}/${linha.id}/` }))
    },
    async restore(linha) {
      await HTTPAuth.put(url({ type: 'u', url: `${this.url}/${linha.id}/` }), { restore: true })
    },

    async getModeloExtra() {
      this.loading = true
      await HTTPAuth.get(
        url({ type: 'u', url: this.url + '/' + this.linha?.id + '/extra', params: {} }),
      )
        .then((res) => {
          this.loading = false
          this.linhas = res.data.results || res.data
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
  },
})
