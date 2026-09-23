import { onMounted } from 'vue'
import { useMeta } from 'quasar'
import { tdc } from 'quasar_resaas'

// Per-page SEO: title, meta description, canonical URL and Open Graph/Twitter
// tags, reactive to whatever {siteName, title, description, path} the caller
// passes in. Built on Quasar's own useMeta() (quasar/dist/quasar.client.js) -
// no new meta-tag mechanism, this project had none yet.
//
// `title`/`description` are English canonical strings, translated with tdc()
// here so a language switch updates the tab title/meta the same way it
// updates the page body - not pre-translated by the caller.
export function useSeo(getData) {
  useMeta(() => {
    const { siteName, title, description, path = '' } = typeof getData === 'function' ? getData() : getData
    const translatedTitle = tdc(title)
    const translatedDescription = description ? tdc(description) : ''
    const fullTitle = siteName ? `${translatedTitle} — ${siteName}` : translatedTitle
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const canonical = `${origin}${path}`

    return {
      title: fullTitle,
      titleTemplate: null,
      meta: {
        description: { name: 'description', content: translatedDescription },
        ogTitle: { property: 'og:title', content: fullTitle },
        ogDescription: { property: 'og:description', content: translatedDescription },
        ogType: { property: 'og:type', content: 'website' },
        ogUrl: { property: 'og:url', content: canonical },
        twitterCard: { name: 'twitter:card', content: 'summary' },
        twitterTitle: { name: 'twitter:title', content: fullTitle },
        twitterDescription: { name: 'twitter:description', content: translatedDescription },
      },
      link: {
        canonical: { rel: 'canonical', href: canonical },
      },
    }
  })

  // index.html ships a static <meta name="description"> (Quasar's own
  // productDescription placeholder, shared by every site this SPA serves).
  // useMeta() only manages the tags it creates (marked data-qmeta), so that
  // static one is never replaced and, being first in <head>, is what most
  // crawlers/social previews would read instead of the one above. Remove it
  // once a page here actually sets its own description.
  onMounted(() => {
    document.querySelector('meta[name="description"]:not([data-qmeta])')?.remove()
  })
}
