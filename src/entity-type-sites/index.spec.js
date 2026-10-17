// The EntityType sites of this application are registered in quasar_resaas'
// registry under the EntityType name (the key the backend sends).
import { describe, it, expect } from 'vitest'
import { getEntityTypeSiteContent } from 'quasar_resaas'
import { entityTypeSiteContents, setupEntityTypeSites } from './index.js'

describe('setupEntityTypeSites', () => {
  it('registers every EntityType site content by name', () => {
    setupEntityTypeSites()

    for (const [name, content] of Object.entries(entityTypeSiteContents)) {
      expect(getEntityTypeSiteContent(name)).toBe(content)
    }
  })

  it('every site has a hero and a call to action', () => {
    for (const [name, content] of Object.entries(entityTypeSiteContents)) {
      expect(content.hero, name).toBeTruthy()
      expect(content.cta?.title, name).toBeTruthy()
    }
  })
})
