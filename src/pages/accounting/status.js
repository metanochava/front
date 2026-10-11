export function statusColor(status) {
  return { draft: 'grey', posted: 'positive', reversed: 'warning' }[status] || 'grey'
}
