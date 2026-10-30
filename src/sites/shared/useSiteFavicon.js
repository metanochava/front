import { onMounted, onBeforeUnmount } from 'vue'
import { setFavicon } from 'quasar_resaas'

// A site's browser tab icon is the logo of its institution. setFavicon()
// (quasar_resaas, the same helper the app layouts use for the Entity logo)
// restores the index.html icons when the site layout unmounts.
export function useSiteFavicon (logo) {
  onMounted(() => setFavicon(logo))
  onBeforeUnmount(() => setFavicon(null))
}
