// Where the "Login" link of a PUBLIC site (amal, docodela, ...) sends the visitor.
//
// Each Entity type has its own front on its own sub-domain of the API host:
//
//   API (process.env.API)          https://app.dev.mytech.co.mz
//   Entity type "Saude"       ->   https://saude.dev.mytech.co.mz
//   Entity type "Seguradora"  ->   https://seguradora.dev.mytech.co.mz
//
// The type comes from the site's Entity (User.Entity, filled by
// EntityStore.getSettings() from the public site/ endpoint, where entity_type is
// serialized as {id, value, label}). Its label is turned into a sub-domain:
// lower case, accents and anything that is not a letter or digit removed. With no
// Entity type the generic front (the API host itself) is used.

export function entityTypeSubdomain (entity) {
  const label = entity?.entity_type?.label || ''

  return label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function siteLoginUrl (entity, api = process.env.API) {
  const target = new URL(api)
  const subdomain = entityTypeSubdomain(entity)

  if (subdomain) {
    const labels = target.hostname.split('.')
    labels[0] = subdomain
    target.hostname = labels.join('.')
  }

  const query = entity?.id ? `?entity=${encodeURIComponent(entity.id)}` : ''

  return `${target.origin}/#/auth/login${query}`
}
