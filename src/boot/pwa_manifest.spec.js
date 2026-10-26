// The installable app is named after the domain's EntityType: the manifest
// link points to the backend's manifest of that type; a host without one
// keeps the static manifest.
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('quasar_resaas', () => ({
  entityTypeKey: (location) => location.hostname.split('.')[0],
  url: ({ url, params }) => `https://api.test/api/${url}?${new URLSearchParams(params)}`,
}))

const { applyEntityTypeManifest } = await import('./pwa_manifest')

const FARMACIA = { hostname: 'farmacia.example.com', origin: 'https://farmacia.example.com' }
const MANIFEST = {
  name: 'Farmacia',
  theme_color: '#15803D',
  icons: [
    { src: '../t1/app_icon/?size=192&purpose=any', purpose: 'any' },
    { src: '../t1/app_icon/?size=192&purpose=maskable', purpose: 'maskable' },
  ],
}

describe('EntityType app manifest', () => {
  beforeEach(() => {
    document.head.innerHTML = '<link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#1976d2">'
  })

  it('points the manifest, colour and iPhone title/icon to the EntityType', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => MANIFEST }))

    await applyEntityTypeManifest(FARMACIA)

    const href = document.head.querySelector('link[rel="manifest"]').getAttribute('href')
    expect(href).toBe('https://api.test/api/django_resaas/entitytypes/manifest/?name=farmacia&origin=https%3A%2F%2Ffarmacia.example.com')
    expect(fetch).toHaveBeenCalledWith(href, { credentials: 'omit' })
    expect(document.head.querySelector('meta[name="theme-color"]').content).toBe('#15803D')
    expect(document.head.querySelector('meta[name="apple-mobile-web-app-title"]').content).toBe('Farmacia')
    expect(document.head.querySelector('link[rel="apple-touch-icon"]').getAttribute('href'))
      .toBe('https://api.test/api/django_resaas/entitytypes/t1/app_icon/?size=180&purpose=any')
  })

  it('keeps the static manifest when the host has no EntityType', async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false }))

    expect(await applyEntityTypeManifest(FARMACIA)).toBeNull()
    expect(document.head.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/manifest.json')
  })

  it('keeps the static manifest when the API cannot be reached', async () => {
    globalThis.fetch = vi.fn(async () => { throw new TypeError('offline') })

    expect(await applyEntityTypeManifest(FARMACIA)).toBeNull()
    expect(document.head.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/manifest.json')
  })
})
