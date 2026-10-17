// Navigation of the application: which route table a host gets (the
// EntityType sites by domain, or the authenticated app), that every table
// ends in a catch-all, that route names are unique, and that every lazily
// loaded page of the app really resolves (a broken import inside a page is
// found here, not by a user opening it).
import { describe, it, expect, vi, beforeEach } from 'vitest'

async function routesFor (url) {
  window.happyDOM.setURL(url)
  vi.resetModules()
  return (await import('./routes.js')).default
}

function walk (records, out = []) {
  for (const record of records) {
    out.push(record)
    if (record.children) walk(record.children, out)
  }
  return out
}

const SITE_HOSTS = [
  ['clinicaamal.co.mz', 'amal'],
  ['amal.dev.mytech.co.mz', 'amal'],
  ['docodela.mytech.co.mz', 'docodela'],
  ['metano.mytech.co.mz', 'portfolio'],
  ['mytech.co.mz', 'mytech'],
  ['dev.mytech.co.mz', 'mytech'],
  ['resaas.mytech.co.mz', 'resaas'],
]

describe('route table by host', () => {
  beforeEach(() => vi.resetModules())

  it.each(SITE_HOSTS)('%s serves the %s site, not the app', async (host, site) => {
    const routes = await routesFor(`https://${host}/`)
    const { [`${site}SiteRoutes`]: siteRoutes } = await import(`../sites/${site}/routes.js`)

    expect(routes.slice(0, siteRoutes.length).map(r => r.path)).toEqual(siteRoutes.map(r => r.path))
    expect(routes.at(-1).path).toBe('/:catchAll(.*)*')
    expect(walk(routes).some(r => r.path === '/dashboard')).toBe(false)
  })

  it('an unknown host gets the authenticated app', async () => {
    const routes = await routesFor('https://app.example.test/')
    const all = walk(routes)
    const names = all.map(r => r.name).filter(Boolean)

    expect(names).toEqual(expect.arrayContaining(['dashboard', 'welcome', 'crud_state', 'crud_route']))
    expect(all.find(r => r.path === 'authwelcome').redirect).toEqual({ name: 'welcome' })
    expect(routes.at(-1).path).toBe('/:catchAll(.*)*')
  })

  it('route names are unique in the app table', async () => {
    const names = walk(await routesFor('https://app.example.test/')).map(r => r.name).filter(Boolean)
    const repeated = names.filter((name, i) => names.indexOf(name) !== i)

    expect(repeated).toEqual([])
  })
})

describe('every lazy page of the app resolves', () => {
  it('imports each route component', async () => {
    const all = walk(await routesFor('https://app.example.test/'))
    const lazy = all.filter(r => typeof r.component === 'function' && !r.component.render && !r.component.setup)
    const broken = []

    for (const record of lazy) {
      try {
        const mod = await record.component()
        if (!mod?.default) broken.push(`${record.path}: no default export`)
      } catch (error) {
        broken.push(`${record.path}: ${error.message}`)
      }
    }

    expect(lazy.length).toBeGreaterThan(10)
    expect(broken).toEqual([])
  })
})
