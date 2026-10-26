// A route change is a safe moment to apply a waiting new version of the app
// (src-pwa/update-policy.js). Harmless outside PWA mode: nothing is waiting.
import { updatePolicy } from 'app/src-pwa/update-state'

export default ({ router }) => {
  router.afterEach(() => updatePolicy.navigated())
}
