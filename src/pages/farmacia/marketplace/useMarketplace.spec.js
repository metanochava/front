// The reservation cart and the request key (the backend revalidates prices and
// stock; these only keep what the buyer picked and make a retry the same request).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from 'quasar_resaas'
import {
  NEARBY_RADIUS_KM, RADIUS_STEPS_KM, stepRadius, OFF_ROUTE_METERS, REROUTE_INTERVAL_MS, distanceToPathMeters, isOffRoute, useMapRoute,
  formatMoney, isNearby, mapPoints, medicineMedia, medicineThumbnail, requestKey, useCart } from './useMarketplace'

const row = (offerId, pharmacyId = 'p1') => ({
  offer_id: offerId, price: '50.00', currency: 'MZN', available_quantity: null,
  pharmacy: { id: pharmacyId, name: pharmacyId, address: 'Rua 1', distance_km: 0.4 },
  medicine: { name: 'Paracetamol', strength: '500 mg', presentation: 'Box', prescription_required: false,
    image: 'https://media.test/a.png?token=secret', media: [{ url: 'https://media.test/b.png?token=secret', kind: 'image' }] },
})

describe('useCart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds an offer once and sums repeated picks, up to 100', () => {
    const { cart, add } = useCart()
    add(row('a'))
    add(row('a'))
    add(row('b', 'p2'))

    expect(cart.lines.map((line) => [line.row.offer_id, line.quantity])).toEqual([['a', 2], ['b', 1]])
    cart.lines[0].quantity = 100
    add(row('a'))
    expect(cart.lines[0].quantity).toBe(100)
  })

  it('removes a line and clears, shared by every caller', () => {
    useCart().add(row('a'))
    useCart().add(row('b'))
    useCart().remove('a')

    expect(useCart().cart.lines.map((line) => line.row.offer_id)).toEqual(['b'])
    useCart().clear()
    expect(useCart().cart.lines).toEqual([])
  })

  it('keeps only what the cart needs from the search row (no photos or signed URLs)', () => {
    useCart().add({ ...row('a'), available_quantity: 7 })
    const kept = useCart().cart.lines[0].row

    expect(kept).toEqual({
      offer_id: 'a', price: '50.00', currency: 'MZN', available_quantity: 7,
      medicine: { name: 'Paracetamol', strength: '500 mg', presentation: 'Box', prescription_required: false },
      pharmacy: { id: 'p1', name: 'p1' },
    })
  })

  it('survives a reload for the same user, and is not shown to another user', async () => {
    useUserStore().data = { id: 'u1' }
    useCart().add(row('a'))
    useCart().add(row('a'))
    await new Promise((resolve) => setTimeout(resolve, 250)) // the persistence writes debounced

    const saved = Object.keys(localStorage).find((key) => key.includes('user:u1') && key.includes('marketplacecart'))
    expect(saved).toBeTruthy()
    expect(localStorage.getItem(saved)).not.toContain('token=')

    // a reload: a new Pinia, the same user
    setActivePinia(createPinia())
    useUserStore().data = { id: 'u1' }
    expect(useCart().cart.lines.map((line) => [line.row.offer_id, line.quantity])).toEqual([['a', 2]])

    // another user on the same device
    setActivePinia(createPinia())
    useUserStore().data = { id: 'u2' }
    expect(useCart().cart.lines).toEqual([])
  })
})

describe('requestKey / formatMoney', () => {
  it('makes distinct keys the backend accepts (8-64 characters)', () => {
    const first = requestKey()
    expect(first.length).toBeGreaterThanOrEqual(8)
    expect(first.length).toBeLessThanOrEqual(64)
    expect(requestKey()).not.toBe(first)
  })

  it('formats with the currency, or falls back to the code', () => {
    expect(formatMoney('45', 'MZN')).toMatch(/45/)
    expect(formatMoney('45', 'NOT-A-CODE')).toBe('45.00 NOT-A-CODE')
  })
})

describe('mapPoints', () => {
  it('keeps only pharmacies with valid coordinates, as numbers', () => {
    const points = mapPoints([
      { id: 'a', coordinates: { lat: '-25.9655', lng: '32.5832' } },
      { id: 'b', coordinates: null },
      { id: 'c', coordinates: { lat: 'x', lng: 1 } },
      { id: 'd', coordinates: { lat: 120, lng: 30 } },
      { id: 'e' },
    ])
    expect(points.map((point) => [point.id, point.lat, point.lng])).toEqual([['a', -25.9655, 32.5832]])
    expect(points[0].pharmacy.id).toBe('a')
  })
})

describe('medicineMedia', () => {
  it('puts the main photo first, then photos and videos in order, skipping empty ones', () => {
    const medicine = {
      image: 'main.png',
      media: [
        { url: 'video.mp4', kind: 'video', caption: 'How to use' },
        { url: null, kind: 'image' },
        { url: 'box.png', kind: 'image', caption: '' },
      ],
    }
    expect(medicineMedia(medicine)).toEqual([
      { src: 'main.png', kind: 'image', caption: null },
      { src: 'video.mp4', kind: 'video', caption: 'How to use' },
      { src: 'box.png', kind: 'image', caption: null },
    ])
    expect(medicineMedia({ image: null, media: [] })).toEqual([])
    expect(medicineMedia(null)).toEqual([])
  })

  it('uses the main photo as thumbnail, else the first photo, never a video', () => {
    expect(medicineThumbnail({ image: 'main.png', media: [] })).toBe('main.png')
    expect(medicineThumbnail({ image: null, media: [{ url: 'v.mp4', kind: 'video' }, { url: 'b.png', kind: 'image' }] })).toBe('b.png')
    expect(medicineThumbnail({ image: null, media: [{ url: 'v.mp4', kind: 'video' }] })).toBeNull()
  })
})

describe('useCart step', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('keeps the quantity between 1 and 100, or the shown stock', () => {
    const { cart, add, step, maxQuantity } = useCart()
    add(row('a'))
    step('a', -1)
    expect(cart.lines[0].quantity).toBe(1)
    step('a', 1)
    expect(cart.lines[0].quantity).toBe(2)
    cart.lines[0].quantity = 100
    step('a', 1)
    expect(cart.lines[0].quantity).toBe(100)

    add({ ...row('b'), available_quantity: '3' })
    const line = cart.lines[1]
    expect(maxQuantity(line)).toBe(3)
    step('b', 5)
    expect(line.quantity).toBe(3)
    expect(maxQuantity(cart.lines[0])).toBe(100)
  })
})

describe('stepRadius', () => {
  it('moves one step down or up from the radius, and stops at the ends', () => {
    expect(RADIUS_STEPS_KM[RADIUS_STEPS_KM.indexOf(NEARBY_RADIUS_KM)]).toBe(3)
    expect(stepRadius(3, -1)).toBe(2)
    expect(stepRadius(3, 1)).toBe(5)
    expect(stepRadius(1, -1)).toBe(1)
    expect(stepRadius(20, 1)).toBe(20)
    expect(stepRadius(7, 1)).toBe(5) // not a step: from the default
  })
})

describe('isNearby', () => {
  it('is true only with a real distance within 3 km', () => {
    expect(NEARBY_RADIUS_KM).toBe(3)
    expect(isNearby({ distance_km: 0.4 })).toBe(true)
    expect(isNearby({ distance_km: 3 })).toBe(true)
    expect(isNearby({ distance_km: 3.01 })).toBe(false)
    expect(isNearby({ distance_km: null })).toBe(false)
    expect(isNearby({})).toBe(false)
    expect(isNearby(null)).toBe(false)
    expect(isNearby({ distance_km: 8 }, 10)).toBe(true)
  })
})

// a straight north-south street in Chandkheda (Ahmedabad); 0.001° of latitude ≈ 111 m
const street = [{ lat: 23.1000, lng: 72.5850 }, { lat: 23.1100, lng: 72.5850 }]
const east = (metres) => 72.5850 + metres / (111320 * Math.cos(23.105 * Math.PI / 180))

describe('off-route check', () => {
  it('measures the distance to the nearest point of the path, segments included', () => {
    expect(distanceToPathMeters({ lat: 23.1050, lng: 72.5850 }, street)).toBeLessThan(1)
    expect(distanceToPathMeters({ lat: 23.1050, lng: east(80) }, street)).toBeCloseTo(80, 0)
    expect(distanceToPathMeters({ lat: 23.1110, lng: 72.5850 }, street)).toBeCloseTo(111, -1) // past the end
    expect(distanceToPathMeters({ lat: 23.1, lng: 72.5 }, [])).toBe(Infinity)
  })

  it('is off the route beyond OFF_ROUTE_METERS and the fix accuracy, not more often than the interval', () => {
    const now = 100000
    const lastAsked = now - REROUTE_INTERVAL_MS
    expect(isOffRoute({ lat: 23.105, lng: east(OFF_ROUTE_METERS - 10) }, street, { now, lastAsked })).toBe(false)
    expect(isOffRoute({ lat: 23.105, lng: east(OFF_ROUTE_METERS + 30) }, street, { now, lastAsked })).toBe(true)
    // a poor fix (±150 m) is not taken as leaving the route
    expect(isOffRoute({ lat: 23.105, lng: east(100), accuracy: 150 }, street, { now, lastAsked })).toBe(false)
    // asked a moment ago: wait
    expect(isOffRoute({ lat: 23.105, lng: east(300) }, street, { now, lastAsked: now - 1000 })).toBe(false)
  })
})

describe('useMapRoute', () => {
  let routeCalls
  let fix

  const pharmacy = { id: 'p1', name: 'Demo', coordinates: { lat: '23.1100', lng: '72.5850' } }
  const latLng = (point) => ({ lat: () => point.lat, lng: () => point.lng })

  beforeEach(() => {
    routeCalls = []
    window.google = {
      maps: {
        TravelMode: { DRIVING: 'DRIVING', WALKING: 'WALKING' },
        DirectionsService: class {
          route (request) {
            routeCalls.push(request)
            if (request.origin.fail) return Promise.reject(new Error('ZERO_RESULTS'))
            return Promise.resolve({ routes: [{ overview_path: [latLng(request.origin), latLng(street[1])], legs: [{ duration: { text: '5 min' }, distance: { text: '1 km' } }] }] })
          }
        },
      },
    }
    fix = null
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { watchPosition: vi.fn((onFix) => { fix = onFix; return 7 }), clearWatch: vi.fn() },
    })
  })
  afterEach(() => {
    vi.useRealTimers()
    delete window.google
  })

  const move = (lat, lng, accuracy = 10) => fix({ coords: { latitude: lat, longitude: lng, accuracy } })

  it('draws once, follows the device and re-routes from where it is when it leaves the route', async () => {
    vi.useFakeTimers({ now: 1000000 })
    const route = useMapRoute()
    await route.show(pharmacy, { origin: street[0] })

    expect(route.summary).toBe('5 min · 1 km')
    expect(route.path).toHaveLength(2)
    expect(navigator.geolocation.watchPosition).toHaveBeenCalledTimes(1)

    move(23.1050, 72.5850) // on the street
    expect(route.live).toMatchObject({ lat: 23.1050, lng: 72.5850 })
    expect(routeCalls).toHaveLength(1)

    vi.setSystemTime(1000000 + REROUTE_INTERVAL_MS)
    move(23.1050, east(200)) // 200 m off
    await vi.runAllTimersAsync()
    expect(routeCalls).toHaveLength(2)
    expect(routeCalls[1].origin).toEqual({ lat: 23.1050, lng: east(200) })
    expect(navigator.geolocation.watchPosition).toHaveBeenCalledTimes(1) // still the same watch
  })

  it('keeps the drawn route when a re-route fails, and stops following on clear', async () => {
    vi.useFakeTimers({ now: 1000000 })
    const route = useMapRoute()
    await route.show(pharmacy, { origin: street[0] })
    await route.show(pharmacy, { origin: { fail: true }, reroute: true })
    expect(route.pharmacy).toEqual(pharmacy) // (a reactive proxy of it)
    expect(route.summary).toBe('5 min · 1 km')

    route.clear()
    expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(7)
    expect([route.pharmacy, route.result, route.live]).toEqual([null, null, null])
  })

  it('a first request without a route clears and throws (the map opens Google Maps)', async () => {
    const route = useMapRoute()
    await expect(route.show(pharmacy, { origin: { fail: true } })).rejects.toThrow()
    expect(route.pharmacy).toBe(null)
    expect(navigator.geolocation.watchPosition).not.toHaveBeenCalled()
  })
})
