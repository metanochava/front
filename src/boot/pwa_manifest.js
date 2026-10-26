// The installable app takes the name, colour and icon of the domain's
// EntityType (farmacia.<domain> installs as its "Farmacia" EntityType):
// GET django_resaas/entitytypes/manifest/?name=&origin= (public). A host
// without an EntityType (mytech.co.mz, the client sites...) keeps the static
// "Mytech App" manifest of src-pwa/manifest.json.
import { entityTypeKey, url } from 'quasar_resaas'

function setHead (selector, create, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

export async function applyEntityTypeManifest (location = window.location) {
  const name = entityTypeKey(location)
  if (!name) return null

  const manifestUrl = url({
    type: 'u',
    url: 'django_resaas/entitytypes/manifest/',
    params: { name, origin: location.origin },
  })

  let manifest
  try {
    const response = await fetch(manifestUrl, { credentials: 'omit' })
    if (!response.ok) return null
    manifest = await response.json()
  } catch {
    return null
  }

  const link = (rel) => () => Object.assign(document.createElement('link'), { rel })
  const meta = (metaName) => () => Object.assign(document.createElement('meta'), { name: metaName })

  setHead('link[rel="manifest"]', link('manifest'), 'href', manifestUrl)
  setHead('meta[name="theme-color"]', meta('theme-color'), 'content', manifest.theme_color)
  // iPhone (Add to Home Screen) does not read the manifest's name and icons
  setHead('meta[name="apple-mobile-web-app-title"]', meta('apple-mobile-web-app-title'), 'content', manifest.name)

  const icon = (manifest.icons || []).find(item => item.purpose === 'any')
  if (icon) {
    const touchIcon = new URL(icon.src, manifestUrl)
    touchIcon.searchParams.set('size', '180')
    setHead('link[rel="apple-touch-icon"]', link('apple-touch-icon'), 'href', touchIcon.toString())
  }
  return manifest
}

export default () => {
  // not awaited: the app does not wait for its own install metadata
  applyEntityTypeManifest()
}
