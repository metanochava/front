import { reactive } from 'vue'
import { HTTPAuth, HTTPClient, url } from 'quasar_resaas'

// The pharmacies' marketplace (backend: farmacia/views/marketplace.py).
//   pharmacies: GET farmacia/marketplace/pharmacies/  PUBLIC  -> HTTPClient
//   medicines:  GET farmacia/marketplace/medicines/   signed in -> HTTPAuth
// Both are paginated ({count, next, previous, results}); "more" asks for the
// next page with the same filters. Distances come only from real coordinates:
// the device position is asked for on demand and never stored.

const clean = (params) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined && value !== false)
)

function paginated (client, path) {
  const state = reactive({ rows: [], count: 0, page: 0, loading: false, error: null, loaded: false, params: {} })

  async function load (params = {}, { more = false } = {}) {
    if (!more) state.params = clean(params)
    const page = more ? state.page + 1 : 1
    state.loading = true
    state.error = null
    try {
      const response = await client.get(url({ type: 'u', url: path, params: { ...state.params, page } }))
      const data = response.data || {}
      state.rows = more ? [...state.rows, ...(data.results || [])] : (data.results || [])
      state.count = data.count || 0
      state.page = page
      state.loaded = true
    } catch (error) {
      // the API client already showed the message; keep the code for the page
      state.error = error?.response?.data?.error || { message: 'Could not load the results.' }
      if (!more) state.rows = []
    } finally {
      state.loading = false
    }
  }

  return { state, load, more: () => load(state.params, { more: true }) }
}

export function usePharmacies () {
  return paginated(HTTPClient, 'farmacia/marketplace/pharmacies/')
}

export function useMedicineSearch () {
  return paginated(HTTPAuth, 'farmacia/marketplace/medicines/')
}

// {lat, lng} of the device, or an error code: 'unsupported' | 'denied' | 'unavailable'
export function currentPosition () {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) return reject(new Error('unsupported'))
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => reject(new Error(error?.code === 1 ? 'denied' : 'unavailable')),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  })
}

// ---------------------------------------------------------------- reservations
// The buyer's cart lives only in this session (module state): prices and stock
// are revalidated by the backend when the reservation is placed, one order per
// pharmacy (POST farmacia/marketplace/orders/).

const cart = reactive({ lines: [] })

export function useCart () {
  function add (row) {
    const line = cart.lines.find((item) => item.row.offer_id === row.offer_id)
    if (line) line.quantity = Math.min(line.quantity + 1, 100)
    else cart.lines.push({ row, quantity: 1 })
  }
  function remove (offerId) {
    cart.lines = cart.lines.filter((item) => item.row.offer_id !== offerId)
  }
  function clear () {
    cart.lines = []
  }
  // the stepper's highest quantity: 100 (backend MAX_QUANTITY), or less when
  // the pharmacy shows its stock
  function maxQuantity (line) {
    const stock = Number(line?.row?.available_quantity)
    return line?.row?.available_quantity != null && Number.isFinite(stock) ? Math.max(1, Math.min(100, Math.floor(stock))) : 100
  }
  function step (offerId, delta) {
    const line = cart.lines.find((item) => item.row.offer_id === offerId)
    if (line) line.quantity = Math.min(Math.max(line.quantity + delta, 1), maxQuantity(line))
  }
  return { cart, add, remove, clear, step, maxQuantity }
}

// a fresh key per attempt: a retried or double-clicked request is not reserved twice
export function requestKey () {
  return globalThis.crypto?.randomUUID?.().replace(/-/g, '') ||
    `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`.padEnd(16, '0')
}

export async function placeOrders ({ contact_name, contact_phone, idempotency_key }) {
  const lines = cart.lines.map((item) => ({ offer_id: item.row.offer_id, quantity: item.quantity }))
  const response = await HTTPAuth.post(url({ type: 'u', url: 'farmacia/marketplace/orders/' }),
    { lines, contact_name, contact_phone, idempotency_key })
  return response.data.results || []
}

export function useMyOrders () {
  return paginated(HTTPAuth, 'farmacia/marketplace/orders/')
}

export async function cancelMyOrder (id) {
  const response = await HTTPAuth.post(url({ type: 'u', url: `farmacia/marketplace/orders/${id}/cancel/` }), {})
  return response.data
}

export function formatMoney (value, currency) {
  const amount = Number(value)
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency || ''}`.trim()
  }
}

// ---------------------------------------------------------------------- media
// A medicine's photos and videos for the viewer: the main photo first, then
// the gallery in its order (backend: marketplace_service._medicine).
export function medicineMedia (medicine) {
  const items = []
  if (medicine?.image) items.push({ src: medicine.image, kind: 'image', caption: null })
  for (const item of medicine?.media || []) {
    if (item?.url) items.push({ src: item.url, kind: item.kind === 'video' ? 'video' : 'image', caption: item.caption || null })
  }
  return items
}

// the search row's thumbnail: the main photo, else the first gallery photo
export function medicineThumbnail (medicine) {
  return medicine?.image || (medicine?.media || []).find((item) => item?.kind !== 'video' && item?.url)?.url || null
}

// ------------------------------------------------------------------------ map
// Pharmacies with real coordinates, as map points. A pharmacy without them is
// left out (it stays in the list): the map never places one at a guessed spot.
export function mapPoints (pharmacies = []) {
  return pharmacies
    .map((pharmacy) => ({
      id: pharmacy.id,
      lat: Number(pharmacy.coordinates?.lat),
      lng: Number(pharmacy.coordinates?.lng),
      pharmacy,
    }))
    .filter((point) => hasCoordinates(point))
}

function hasCoordinates (point) {
  return Number.isFinite(point.lat) && Number.isFinite(point.lng) &&
    Math.abs(point.lat) <= 90 && Math.abs(point.lng) <= 180
}

// The Google Maps JS API, loaded once, only when GOOGLE_MAPS_API_KEY is set
// (same script and callback as quasar_resaas services/googleMaps.js, which the
// package does not export, so both can share one load).
let mapsLoader = null

export function hasMapsKey () {
  return !!process.env.GOOGLE_MAPS_API_KEY
}

export function loadMaps () {
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return Promise.reject(new Error('GOOGLE_MAPS_API_KEY is not configured.'))
  if (window.google?.maps?.places) return Promise.resolve(window.google)
  if (mapsLoader) return mapsLoader
  mapsLoader = new Promise((resolve, reject) => {
    const callbackName = '__resaasGoogleMapsReady'
    window[callbackName] = () => {
      delete window[callbackName]
      resolve(window.google)
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=${callbackName}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      mapsLoader = null
      reject(new Error('Failed to load the Google Maps script.'))
    }
    document.head.appendChild(script)
  })
  return mapsLoader
}
