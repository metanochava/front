// When a new version of the app (a waiting service worker) is applied.
//
// The new version downloads in the background and waits. It is applied -
// SKIP_WAITING, then one reload when the new worker takes control - only at a
// safe moment, so nobody loses what they are typing:
//   - right after the app opens (the user has not started working yet);
//   - on a route change;
//   - when the app goes to the background (hidden tab / minimised app).
// Never while a dialog is open, a field has the focus, or the user typed
// something since the last route change.

export const OPENING_WINDOW_MS = 15 * 1000
export const CHECK_INTERVAL_MS = 30 * 60 * 1000

const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]'

export function createUpdatePolicy ({
  doc = globalThis.document,
  now = () => Date.now(),
  reload = () => globalThis.location.reload(),
  serviceWorker = globalThis.navigator?.serviceWorker
} = {}) {
  const openedAt = now()
  let waiting = null
  let hasTyped = false
  let applying = false

  function isSafe () {
    if (hasTyped) return false
    if (doc.querySelector('.q-dialog')) return false
    const active = doc.activeElement
    return !(active && active.matches && active.matches(EDITABLE))
  }

  function apply () {
    if (!waiting || applying || !isSafe()) return false
    applying = true
    serviceWorker?.addEventListener('controllerchange', () => reload(), { once: true })
    waiting.postMessage({ type: 'SKIP_WAITING' })
    return true
  }

  return {
    get pending () { return waiting !== null },

    // a new version is installed and waiting
    updated (registration) {
      waiting = registration?.waiting || null
      if (now() - openedAt <= OPENING_WINDOW_MS) apply()
    },

    navigated () {
      hasTyped = false
      return apply()
    },

    hidden () {
      return apply()
    },

    typed () {
      hasTyped = true
    },

    isSafe
  }
}
