import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const useWorkflowInstanceStore = createBaseStore(
  'workflowinstance',
  { app: 'workflow', model: 'WorkflowInstance', url: 'workflow/instances' },
  {
    state: () => ({ inbox: [] }),
    getters: { actual: (state) => state.row },
    actions: {
      async loadInbox() {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/inbox/` }))
        this.inbox = data
        return data
      },
      async decide(id, decision, comment) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/decide/` }), { decision, comment })
        this.row = data
        return data
      },
      async cancel(id) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/cancel/` }))
        this.row = data
        return data
      },
    },
  }
)
