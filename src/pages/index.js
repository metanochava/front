// The site at '/' of each EntityType of this application: one folder of
// src/pages per type, named after the EntityType (case-insensitive; the
// registry is quasar_resaas'). Code, not database.
//
//   src/pages/farmacia/site.js       content of the generic body (texts,
//                                    layout, icons) - registerEntityTypeSiteContent
//   src/pages/farmacia/SitePage.vue  the type's own site, loaded instead of
//                                    the generic body - registerEntityTypeSite
//
// A type without a SitePage.vue gets the generic body with its site.js.
import { registerEntityTypeSite, registerEntityTypeSiteContent } from 'quasar_resaas'

const typeOf = (path) => path.split('/').at(-2).toLowerCase()

// { farmacia: { hero: ..., cta: ... }, ... }
export const entityTypeSiteContents = Object.fromEntries(
  Object.entries(import.meta.glob('./*/site.js', { import: 'default', eager: true })).map(([path, content]) => [typeOf(path), content])
)

// lazy: a site costs nothing until its host opens '/'
// { farmacia: () => import('./farmacia/SitePage.vue'), ... }
export const entityTypeSites = Object.fromEntries(
  Object.entries(import.meta.glob('./*/SitePage.vue')).map(([path, loader]) => [typeOf(path), loader])
)

export function setupEntityTypeSites () {
  for (const [name, content] of Object.entries(entityTypeSiteContents)) {
    registerEntityTypeSiteContent(name, content)
  }
  for (const [name, loader] of Object.entries(entityTypeSites)) {
    registerEntityTypeSite(name, loader)
  }
}
