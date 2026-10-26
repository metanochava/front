import { register } from 'register-service-worker'

import { updatePolicy } from './update-state'
import { CHECK_INTERVAL_MS } from './update-policy'

// Registers the service worker and applies new versions by themselves at a
// safe moment (src-pwa/update-policy.js). Updates are looked for on every
// opening, every 30 minutes and whenever the app comes back to the screen.

register(process.env.SERVICE_WORKER_FILE, {
  registered (registration) {
    setInterval(() => registration.update().catch(() => {}), CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update().catch(() => {})
      }
      else {
        updatePolicy.hidden()
      }
    })
  },

  updated (registration) {
    updatePolicy.updated(registration)
  },

  error (err) {
    console.error('Service worker registration failed:', err)
  }
})
