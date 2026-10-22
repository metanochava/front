import { getCurrentScope, markRaw, onScopeDispose, reactive } from 'vue'
import { HTTPAuth, HTTPClient, url } from 'quasar_resaas'
import { cartRow, useMarketplaceCartStore } from './cartStore'

// The pharmacies' marketplace (backend: farmacia/views/marketplace.py).
//   pharmacies: GET farmacia/marketplace/pharmacies/  PUBLIC  -> HTTPClient
//   medicines:  GET farmacia/marketplace/medicines/   signed in -> HTTPAuth
// Both are paginated ({count, next, previous, results}); "more" asks for the
// next page with the same filters. Distances come only from real coordinates:
// the device position is asked for when the pharmacies section opens (and on
// "Use my location"), and never stored.

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
// The buyer's cart is the Pinia store useMarketplaceCartStore (cartStore.js,
// persisted per user): prices and stock are revalidated by the backend when
// the reservation is placed, one order per pharmacy
// (POST farmacia/marketplace/orders/).

export function useCart () {
  const cart = useMarketplaceCartStore()
  function add (row) {
    const line = cart.lines.find((item) => item.row.offer_id === row.offer_id)
    if (line) line.quantity = Math.min(line.quantity + 1, 100)
    else cart.lines.push({ row: cartRow(row), quantity: 1 })
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
  const lines = useMarketplaceCartStore().lines.map((item) => ({ offer_id: item.row.offer_id, quantity: item.quantity }))
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

// Pharmacies this close to the device are highlighted on the map. Only the
// backend's distance counts (it exists only with real coordinates on both
// sides): without the device position nothing is "nearby".
// 3 km: about 35-40 minutes on foot or a short ride in town; 5 km covers most of
// Maputo and highlights almost everything
export const NEARBY_RADIUS_KM = 3

// the radius the user can choose on the map (- / +), NEARBY_RADIUS_KM first
export const RADIUS_STEPS_KM = [1, 2, 3, 5, 10, 20]

// the next step down (-1) or up (+1); the ends stay where they are
export function stepRadius (radiusKm, direction) {
  const index = RADIUS_STEPS_KM.indexOf(radiusKm)
  const at = index === -1 ? RADIUS_STEPS_KM.indexOf(NEARBY_RADIUS_KM) : index
  return RADIUS_STEPS_KM[Math.min(RADIUS_STEPS_KM.length - 1, Math.max(0, at + direction))]
}

export function isNearby (pharmacy, radiusKm = NEARBY_RADIUS_KM) {
  const km = pharmacy?.distance_km
  return typeof km === 'number' && Number.isFinite(km) && km <= radiusKm
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

// ---------------------------------------------------------------------- route
// The route to one pharmacy (Google Directions), shared by the page's map and
// its full-screen copy, so opening or closing the full screen keeps it. While
// a route is open the device position is followed (watchPosition: only while
// the route is open, never stored or sent to the backend): the blue dot moves
// and, when the user is more than OFF_ROUTE_METERS away from the drawn path,
// the route is asked again from where they are - at most once every
// REROUTE_INTERVAL_MS, so a jumpy GPS fix does not flood Google Directions.
export const OFF_ROUTE_METERS = 50
export const REROUTE_INTERVAL_MS = 15000

const EARTH_RADIUS_M = 6371000

// metres from a point to a path ([{lat, lng}]), on a local flat projection
// around the point (accurate enough at city scale)
export function distanceToPathMeters (point, path = []) {
  if (!point || !path.length) return Infinity
  const rad = Math.PI / 180
  const cos = Math.cos(point.lat * rad)
  const xy = (p) => ({ x: (p.lng - point.lng) * rad * cos * EARTH_RADIUS_M, y: (p.lat - point.lat) * rad * EARTH_RADIUS_M })
  let best = Infinity
  for (let i = 0; i < path.length; i++) {
    const a = xy(path[i])
    const b = xy(path[i + 1] || path[i])
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = dx * dx + dy * dy
    const t = length ? Math.max(0, Math.min(1, -(a.x * dx + a.y * dy) / length)) : 0
    best = Math.min(best, Math.hypot(a.x + t * dx, a.y + t * dy))
  }
  return best
}

// a fix counts as off the route only beyond its own accuracy too, and only
// when the last request is old enough
export function isOffRoute (fix, path, { now = Date.now(), lastAsked = 0 } = {}) {
  if (!fix || !path?.length || now - lastAsked < REROUTE_INTERVAL_MS) return false
  return distanceToPathMeters(fix, path) > Math.max(OFF_ROUTE_METERS, fix.accuracy || 0)
}

export function useMapRoute () {
  let watchId = null
  let lastAsked = 0
  let requests = 0

  const route = reactive({
    pharmacy: null,
    mode: 'DRIVING',
    loading: false,
    summary: '',
    result: null, // the DirectionsResult (raw: Google objects are not made reactive)
    path: [], // its overview path as [{lat, lng}]
    live: null, // the followed device position {lat, lng, accuracy}
    show,
    clear,
  })

  function pharmacyPoint (pharmacy) {
    return { lat: Number(pharmacy.coordinates.lat), lng: Number(pharmacy.coordinates.lng) }
  }

  // throws when Google has no route (the map then opens Google Maps); a failed
  // re-route keeps the route already drawn
  async function show (pharmacy, { origin, mode = route.mode, reroute = false } = {}) {
    const { maps } = window.google
    const request = ++requests
    lastAsked = Date.now()
    route.pharmacy = pharmacy
    route.mode = mode
    route.loading = true
    if (!reroute) route.summary = ''
    try {
      const result = await new maps.DirectionsService().route({
        origin,
        destination: pharmacyPoint(pharmacy),
        travelMode: maps.TravelMode[mode],
      })
      if (request !== requests) return // another route was asked meanwhile
      route.result = markRaw(result)
      route.path = (result.routes?.[0]?.overview_path || []).map((point) => ({ lat: point.lat(), lng: point.lng() }))
      const leg = result.routes?.[0]?.legs?.[0]
      route.summary = leg ? `${leg.duration?.text || ''} · ${leg.distance?.text || ''}` : ''
      follow()
    } catch (error) {
      if (request !== requests || reroute) return
      clear()
      throw error
    } finally {
      if (request === requests) route.loading = false
    }
  }

  function onFix (position) {
    if (!route.pharmacy) return
    route.live = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy }
    if (!route.loading && isOffRoute(route.live, route.path, { lastAsked })) {
      show(route.pharmacy, { origin: { lat: route.live.lat, lng: route.live.lng }, reroute: true })
    }
  }

  function follow () {
    if (watchId !== null || !navigator?.geolocation?.watchPosition) return
    // a lost fix keeps the last dot and the route; nothing to tell the user
    watchId = navigator.geolocation.watchPosition(onFix, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 })
  }

  function clear () {
    requests++
    if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    watchId = null
    Object.assign(route, { pharmacy: null, loading: false, summary: '', result: null, path: [], live: null })
  }

  if (getCurrentScope()) onScopeDispose(clear)
  return route
}
