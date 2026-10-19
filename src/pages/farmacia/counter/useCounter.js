import { HTTPAuth, url } from 'quasar_resaas'

// The pharmacy's own side (current Entity/Branch from the signed context):
//   GET  farmacia/countersales/offers/?q=        add_countersale
//   POST farmacia/countersales/                  add_countersale
//   GET  farmacia/onlineorders/                  list_onlineorder
//   POST farmacia/onlineorders/{id}/collect/     collect_onlineorder
//   POST farmacia/onlineorders/{id}/cancel/      cancel_onlineorder
//   POST farmacia/filafarmacias/lookup_patient/  lookup_patient_filafarmacia (audited)
//   POST farmacia/filafarmacias/enqueue/         enqueue_filafarmacia
// Prices, stock and the prescription rule are decided by the backend; errors
// reach the user through the API client's alert funnel.

const api = (path) => url({ type: 'u', url: `farmacia/${path}` })

// labels are sales' Payment choices (canonical English, translated by tdc)
export const PAYMENT_METHODS = [
  { value: 'numerario', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'emola', label: 'e-Mola' },
  { value: 'mkesh', label: 'mKesh' },
  { value: 'cartao', label: 'Card (Multicaixa/POS)' },
  { value: 'transferencia', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'outro', label: 'Other' },
]

export async function counterOffers (q) {
  const response = await HTTPAuth.get(url({ type: 'u', url: 'farmacia/countersales/offers/', params: { q } }))
  return response.data.results || []
}

export async function sellAtCounter (payload) {
  return (await HTTPAuth.post(api('countersales/'), payload)).data
}

export async function onlineOrders (params = {}) {
  const response = await HTTPAuth.get(url({ type: 'u', url: 'farmacia/onlineorders/', params }))
  return response.data
}

export async function collectOrder (id, payload) {
  return (await HTTPAuth.post(api(`onlineorders/${id}/collect/`), payload)).data
}

export async function cancelOrder (id, reason) {
  return (await HTTPAuth.post(api(`onlineorders/${id}/cancel/`), { reason })).data
}

export async function lookupPatient (code) {
  return (await HTTPAuth.post(api('filafarmacias/lookup_patient/'), { code })).data
}

export async function enqueuePrescription (receitaId) {
  return (await HTTPAuth.post(api('filafarmacias/enqueue/'), { receita_id: receitaId })).data
}
