import { ref, computed, onMounted } from 'vue'
import { useLanguageStore, useUserStore } from 'quasar_resaas'

// Language for the PUBLIC sites (amal, docodela, portfolio).
//
// The translation map (tdc) is normally loaded when someone signs in
// (UserStore.me() -> Language.change). A public visitor never signs in, so without
// this a site written with tdc('English key') would show English to everyone. Here
// the site picks a language on its own and loads its translations through the same
// public endpoints the login screen already uses (languages/ and
// languages/{id}/translations/) - no second translation mechanism.
//
// Order: the language the visitor chose before (this site) > the browser's language >
// the site's own default. The choice is remembered per browser.
const STORAGE_KEY = 'site_language'

const normalise = (code) => String(code || '').toLowerCase().replace('_', '-')

const remembered = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const remember = (code) => {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // private mode: the choice just is not remembered
  }
}

function pick(rows, preferred) {
  const wanted = normalise(preferred)

  return (
    rows.find(row => normalise(row.code) === wanted) ||
    rows.find(row => normalise(row.code).split('-')[0] === wanted.split('-')[0]) ||
    null
  )
}

export function useSiteLanguage({ defaultCode = 'pt-pt' } = {}) {
  const Language = useLanguageStore()
  const User = useUserStore()

  const ready = ref(false)

  const languages = computed(() => Language.rows || [])
  const current = computed(() => Language.current || null)

  async function choose(language) {
    if (!language) return

    Language.change(language)
    User.Language = language
    remember(language.code)
  }

  async function start() {
    try {
      if (!Language.rows?.length) await Language.get()

      const rows = Language.rows || []
      const browser = typeof navigator !== 'undefined' ? navigator.language : ''

      const target = pick(rows, remembered()) || pick(rows, browser) || pick(rows, defaultCode) || rows[0]

      await choose(target)
    } finally {
      ready.value = true
    }
  }

  onMounted(start)

  return { languages, current, ready, choose }
}
