// Who may edit a clinical document, and until when - UX mirror of the
// backend's saude/services/document_edit_policy.py (which enforces it: 403
// not_document_author / 409 edit_window_expired). Only the author, within
// 24 hours of its creation.
import { rawValue } from 'quasar_resaas'

export const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000

export function canEditDocument (doc, userId, now = Date.now()) {
  if (!doc || !userId) return false
  const author = rawValue(doc.created_by)
  if (!author || String(author) !== String(userId)) return false
  const createdAt = doc.created_at ? new Date(doc.created_at).getTime() : NaN
  return Number.isFinite(createdAt) && now - createdAt <= EDIT_WINDOW_MS
}
