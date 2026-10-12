import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

const post = (store, id, action, payload = {}) =>
  HTTPAuth.post(url({ type: 'u', url: `${store.safeUrl}/${id}/${action}/` }), payload).then(({ data }) => data)

export const useLeadStore = createBaseStore(
  'lead',
  { app: 'crm', model: 'Lead' },
  {
    state: () => ({}),
    getters: { actual: (state) => state.row },
    actions: {
      disqualify(id, reason) { return post(this, id, 'disqualify', { reason }) },
      // answers the new Opportunity
      convert(id, payload) { return post(this, id, 'convert', payload) },
    },
  }
)

export const useOpportunityStore = createBaseStore(
  'opportunity',
  { app: 'crm', model: 'Opportunity' },
  {
    state: () => ({ pipeline: null }),
    getters: { actual: (state) => state.row },
    actions: {
      async move(id, stage, lostReason) {
        this.row = await post(this, id, 'move', { stage, lost_reason: lostReason })
        return this.row
      },
      async loadPipeline(params = {}) {
        const { data } = await HTTPAuth.get(url({ type: 'u', url: `${this.safeUrl}/pipeline/`, params }))
        this.pipeline = data
        return data
      },
    },
  }
)

export const useStageStore = createBaseStore(
  'stage',
  { app: 'crm', model: 'Stage' },
  { state: () => ({}), getters: { actual: (state) => state.row }, actions: {} }
)

export const useActivityStore = createBaseStore(
  'activity',
  { app: 'crm', model: 'Activity' },
  {
    state: () => ({}),
    getters: { actual: (state) => state.row },
    actions: {
      complete(id) { return post(this, id, 'complete') },
    },
  }
)
