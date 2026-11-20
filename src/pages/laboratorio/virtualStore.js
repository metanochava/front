import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

// Virtual labs and their machines (laboratorio/virtuallabs/, virtualmachines/):
// the former Lab Manager. A password comes back once (create / renew) and is
// never stored.
export const useVirtualLabStore = createBaseStore('virtuallab', { app: 'laboratorio', model: 'VirtualLab' }, {
  actions: {
    async labs () {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/`, params: { page_size: 100 } }))
      return data.results ?? data ?? []
    },
    async createLab (body) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/` }), body)
      return data
    },
    // network_mode {mode} / create_machines / start_machines / stop_machines / restart_machines / sync
    async labAction (id, action, body = {}) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/${action}/` }), body)
      return data
    },
    async machines (lab) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: 'laboratorio/virtualmachines/', params: { lab, page_size: 200 } }))
      return data.results ?? data ?? []
    },
    async createMachine (body) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: 'laboratorio/virtualmachines/' }), body)
      return data
    },
    // start / stop / restart / renew_password / backup
    async machineAction (id, action, body = {}) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `laboratorio/virtualmachines/${id}/${action}/` }), body)
      return data
    },
    async deleteMachine (id) {
      await HTTPAuth.delete(url({ type: 'u', url: `laboratorio/virtualmachines/${id}/` }))
    },
    async mine (enrolment) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: 'laboratorio/virtualmachines/mine/', params: { enrolment } }))
      return data || []
    },
    async renewOwn (id, enrolment) {
      const { data } = await HTTPAuth.post(url({ type: 'u', url: `laboratorio/virtualmachines/${id}/renew_own_password/` }), { enrolment })
      return data
    },
  },
})
