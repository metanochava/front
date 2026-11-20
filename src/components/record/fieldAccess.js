// The schema's per-field permissions (RESAAS.fields[<name>].permissions) on
// the UX side, with the same rules as quasar_resaas utils/fieldAccess.js
// (not exported by the package): cannot view nor change -> removed; cannot
// change -> read_only; cannot view -> write_only. The backend enforces it.
export function applyFieldAccess (fields, can) {
  const out = []
  for (const field of fields || []) {
    const perms = field?.permissions
    if (!perms?.view) { out.push(field); continue }
    const view = !!can(perms.view)
    const change = !!can(perms.change || perms.view)
    if (!view && !change) continue
    if (!change) out.push({ ...field, read_only: true, props: { ...(field.props || {}), readonly: true, rules: [] } })
    else if (!view) out.push({ ...field, write_only: true })
    else out.push(field)
  }
  return out
}
