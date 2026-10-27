// Portfolio's scroll-reveal now lives in shared/useReveal.js (generalised to serve
// every public site, e.g. mytech's .mt-reveal too). Re-exported here, defaulted to
// the 'pf' prefix, so existing imports (`from '../useReveal'`) keep working unchanged.
import { useReveal as useSharedReveal } from '../shared/useReveal'

export function useReveal(rootRef) {
  return useSharedReveal(rootRef, 'pf')
}
