import { onMounted, onBeforeUnmount } from 'vue'

// Adds `is-in` to every `.<prefix>-reveal` inside `root` once it scrolls into view.
// Without IntersectionObserver (or with reduced motion) everything is simply shown.
// Shared by every public site (portfolio, mytech, ...) that uses this same
// pf-reveal/mt-reveal scroll-in pattern - see their own *.css token file for
// the paired `.<prefix>-js .reveal:not(.is-in)` rule.
export function useReveal(rootRef, prefix = 'pf') {
  let observer = null

  onMounted(() => {
    const root = rootRef.value
    if (!root) return

    const selector = `.${prefix}-reveal`
    const items = root.querySelectorAll(selector)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (!('IntersectionObserver' in window) || reduce) {
      items.forEach(item => item.classList.add('is-in'))
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

    items.forEach(item => observer.observe(item))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
