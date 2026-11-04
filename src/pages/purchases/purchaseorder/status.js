import { statusColor as statusTone } from 'quasar_resaas'
// Read shape of a choice is {value, label}; older payloads send the value.
export function statusOf(row) {
  return row?.status?.value ?? row?.status ?? null
}

export function statusColor(status) {
  return statusTone(status)
}
