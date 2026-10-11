import { HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const useJournalEntryStore = createBaseStore(
  'journalentry',
  { app: 'accounting', model: 'JournalEntry' },
  {
    state: () => ({}),
    getters: { actual: (state) => state.row },
    actions: {
      async runAction(id, action, payload = {}) {
        const { data } = await HTTPAuth.post(url({ type: 'u', url: `${this.safeUrl}/${id}/${action}/` }), payload)
        return data
      },
      async post(id) {
        this.row = await this.runAction(id, 'post')
        return this.row
      },
      // answers the NEW reversal entry; the original becomes 'reversed'
      reverse(id, payload = {}) { return this.runAction(id, 'reverse', payload) },
    },
  }
)

export const useJournalEntryLineStore = createBaseStore(
  'journalentryline',
  { app: 'accounting', model: 'JournalEntryLine' },
  { state: () => ({}), getters: { actual: (state) => state.row }, actions: {} }
)
