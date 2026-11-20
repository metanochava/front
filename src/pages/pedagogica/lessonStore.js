import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

// The digital board's lessons (pedagogica/lessons/): the CRUD from the base
// store; publishing, the searchable history, attachments and the portal here.
export const useLessonStore = createBaseStore('lesson', { app: 'pedagogica', model: 'Lesson' }, {
  actions: {
    async saveLesson (payload) {
      const body = { ...payload, blocks: payload.blocks || [] }
      const { data } = payload.id
        ? await HTTPAuth.patch(url({ type: 'u', url: `${this.safeUrl}/${payload.id}/` }), body)
        : await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/` }), body)
      return data
    },

    async setPublished (id, published) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/${published ? 'publish' : 'unpublish'}/` }), {})
      return data
    },

    // ?q=&class_group=&subject=: newest first
    async searchLessons (params = {}) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/search/`, params }))
      return data || []
    },

    // an image / document / drawing of a lesson's blocks: {id, file: {url...}}
    async uploadAttachment (lessonId, file, kind = 'image', caption = '') {
      const form = new FormData()
      form.append('lesson', lessonId)
      form.append('kind', kind)
      form.append('caption', caption)
      form.append('file', file)
      const { data } = await HTTPAuth.post(url({ type: 'u', url: 'pedagogica/lessonattachments/' }), form)
      return data
    },

    async attachments (lessonId) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: 'pedagogica/lessonattachments/', params: { lesson: lessonId, page_size: 100 } }))
      return data.results ?? data ?? []
    },

    // the portal: the class's published lessons of one of the caller's enrolments
    async mine (params) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/mine/`, params }))
      return data || []
    },
  },
})
