// The content of the site at '/' of each EntityType of this application.
// Code, not database: quasar_resaas only keeps the registry
// (registerEntityTypeSiteContent); the key is the EntityType name.
import { registerEntityTypeSiteContent } from 'quasar_resaas'
import saas from './saas'
import saude from './saude'
import farmacia from './farmacia'
import seguradora from './seguradora'

export const entityTypeSiteContents = {
  "SaaS": saas,
  "Saude": saude,
  "Farmacia": farmacia,
  "Seguradora": seguradora,
}

export function setupEntityTypeSites () {
  for (const [name, content] of Object.entries(entityTypeSiteContents)) {
    registerEntityTypeSiteContent(name, content)
  }
}
