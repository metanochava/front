import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

// Practical sessions (laboratorio/labsessions/): the CRUD from the base
// store; the moves, seats, exercises and remote access here.
export const useLabSessionStore = createBaseStore('labsession', { app: 'laboratorio', model: 'LabSession' }, {
  actions: {
    async sessions (params = {}) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/`, params: { page_size: 50, ...params } }))
      return data.results ?? data ?? []
    },
    async createSession (body) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/` }), body)
      return data
    },
    // start / end / cancel
    async move (id, to) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/${to}/` }), {})
      return data
    },
    async seats (id) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/${id}/seats/` }))
      return data || []
    },
    async seat (session, enrolment, workstation) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: 'laboratorio/seatassignments/' }), { session, enrolment, workstation })
      return data
    },
    async exercises (session) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: 'laboratorio/sessionexercises/', params: { session, page_size: 100 } }))
      return data.results ?? data ?? []
    },
    async addExercise (session, assignment) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: 'laboratorio/sessionexercises/' }), { session, assignment })
      return data
    },
    // {seat, reason, minutes}: the session's teacher, while it runs
    async openRemote (id, body) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/remote_access/` }), body)
      return data
    },
    async endRemote (accessId) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `laboratorio/remoteaccesses/${accessId}/end/` }), {})
      return data
    },
    async mine (enrolment) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/mine/`, params: { enrolment } }))
      return data || []
    },
  },
})
