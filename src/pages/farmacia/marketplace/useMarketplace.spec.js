// The reservation cart and the request key (the backend revalidates prices and
// stock; these only keep what the buyer picked and make a retry the same request).
import { beforeEach, describe, expect, it } from 'vitest'
import { formatMoney, mapPoints, medicineMedia, medicineThumbnail, requestKey, useCart } from './useMarketplace'

const row = (offerId, pharmacyId = 'p1') => ({
  offer_id: offerId, price: '50.00', currency: 'MZN', pharmacy: { id: pharmacyId, name: pharmacyId },
  medicine: { name: 'Paracetamol', strength: '500 mg', prescription_required: false },
})

describe('useCart', () => {
  beforeEach(() => useCart().clear())

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
  beforeEach(() => useCart().clear())

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
