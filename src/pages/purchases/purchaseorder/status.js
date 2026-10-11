// Read shape of a choice is {value, label}; older payloads send the value.
export function statusOf(row) {
  return row?.status?.value ?? row?.status ?? null
}

export function statusColor(status) {
  return {
    draft: 'grey',
    submitted: 'info',
    approved: 'primary',
    partially_received: 'warning',
    received: 'positive',
    cancelled: 'negative',
  }[status] || 'grey'
}
