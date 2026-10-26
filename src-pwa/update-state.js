// The app's single update policy, shared by the service worker registration
// (src-pwa/register-service-worker.js) and the router (src/boot/pwa_update.js).
import { createUpdatePolicy } from './update-policy'

export const updatePolicy = createUpdatePolicy()

document.addEventListener('input', () => updatePolicy.typed(), true)
