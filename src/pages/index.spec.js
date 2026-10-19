// The EntityType sites of this application are registered in quasar_resaas'
// registry under the EntityType name (the key the backend sends).
import { describe, it, expect } from 'vitest'
import { getEntityTypeSite, getEntityTypeSiteContent } from 'quasar_resaas'
import { entityTypeSiteContents, entityTypeSites, setupEntityTypeSites } from './index.js'

describe('setupEntityTypeSites', () => {
  it('registers every EntityType site content by name', () => {
    setupEntityTypeSites()

    for (const [name, content] of Object.entries(entityTypeSiteContents)) {
      expect(getEntityTypeSiteContent(name)).toBe(content)
    }
  })

  // src/pages/<type>/SitePage.vue replaces the generic body; without one the
  // generic body stays (no site registered for the type)
  it('registers each type\'s own SitePage.vue and nothing for the others', async () => {
    setupEntityTypeSites()

    for (const [name, loader] of Object.entries(entityTypeSites)) {
      expect(getEntityTypeSite(name)).toBe(loader)
      expect((await loader()).default, name).toBeTruthy()
    }
    for (const name of Object.keys(entityTypeSiteContents)) {
      if (!(name.toLowerCase() in entityTypeSites)) expect(getEntityTypeSite(name), name).toBeNull()
    }
  })

  it('Farmacia loads its own site, Saude the generic one', () => {
    setupEntityTypeSites()

    expect(Object.keys(entityTypeSiteContents).sort()).toEqual(['farmacia', 'saas', 'saude', 'seguradora'])

    expect(getEntityTypeSite('Farmacia')).toBe(entityTypeSites.farmacia)
    expect(getEntityTypeSite('Saude')).toBeNull()
  })

  it('every site has a hero and a call to action', () => {
    for (const [name, content] of Object.entries(entityTypeSiteContents)) {
      expect(content.hero, name).toBeTruthy()
      expect(content.cta?.title, name).toBeTruthy()
    }
  })
})
