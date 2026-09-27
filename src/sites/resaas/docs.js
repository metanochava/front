// The documentation engine of the RESAAS site: every markdown file under ./content,
// the sidebar of each product (in the order of that library's own docs README), link
// resolution and the search index. The markdown is copied from the libraries by
// scripts/sync-docs.mjs - the libraries' docs folders are the source of truth.
import manifest from './content/manifest.js'

const files = import.meta.glob('./content/**/*.md', { query: '?raw', import: 'default', eager: true })

export const products = [
  {
    key: 'guide',
    label: 'Guide',
    subtitle: 'Start here',
    icon: 'rocket_launch',
    repo: null
  },
  {
    key: 'django-resaas',
    label: 'django_resaas',
    subtitle: 'Backend · Django REST',
    icon: 'dns',
    repo: 'https://github.com/metanochava/django_resaas',
    // where this product's docs live inside its repository
    repoDocs: 'docs',
    branch: 'main'
  },
  {
    key: 'quasar-resaas',
    label: 'quasar_resaas',
    subtitle: 'Frontend · Vue 3 + Quasar',
    icon: 'bolt',
    repo: 'https://github.com/metanochava/quasar_resaas',
    repoDocs: 'docs/quasar-resaas',
    branch: 'main'
  }
]

export const productByKey = Object.fromEntries(products.map(p => [p.key, p]))
export const syncedAt = manifest.synced_at
export const versions = manifest.products

// ---------------------------------------------------------------- documents

// "django-resaas/api/search" -> raw markdown
export const docs = {}
for (const [path, raw] of Object.entries(files)) {
  const key = path.replace('./content/', '').replace(/\.md$/, '')
  docs[key] = raw
}

export function docKey (product, slug) {
  return `${product}/${slug || 'README'}`
}

export function titleOf (raw, fallback) {
  const match = raw?.match(/^#\s+(.+)$/m)
  return match ? match[1].replace(/`/g, '').trim() : fallback
}

// ---------------------------------------------------------------- navigation

// The sidebar follows each library's docs README ("## Navigation"): the order the
// library's authors chose, kept in sync with no second list to maintain here.
function navFromReadme (product) {
  const readme = docs[`${product}/README`] || ''
  const nav = []
  const seen = new Set()
  let section = 'Overview'

  for (const line of readme.split('\n')) {
    // "-   **Getting started** — [Installation](x.md), [Quick start](y.md)"
    const bold = line.match(/^\s*[-*]\s+\*\*(.+?)\*\*/)
    if (bold) section = bold[1]
    for (const [, label, target] of line.matchAll(/\[([^\]]+)\]\(([^)#]+\.md)(?:#[^)]*)?\)/g)) {
      const slug = resolveSlug(product, 'README', target)
      if (!slug || seen.has(slug.key) || !docs[slug.key]) continue
      seen.add(slug.key)
      const folder = slug.slug.includes('/') ? slug.slug.split('/')[0] : section
      nav.push({ product: slug.product, slug: slug.slug, title: label, section: bold ? section : humanise(folder) })
    }
  }

  // anything the README does not list still gets a place, at the end
  for (const key of Object.keys(docs).sort()) {
    if (!key.startsWith(`${product}/`) || seen.has(key) || key.endsWith('/README')) continue
    const slug = key.slice(product.length + 1)
    nav.push({ product, slug, title: titleOf(docs[key], slug), section: humanise(slug.split('/')[0]) })
  }
  return nav
}

function humanise (folder) {
  const names = {
    'getting-started': 'Getting started', api: 'API', hr: 'Modules', 'example-app': 'Examples'
  }
  return names[folder] || folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, ' ')
}

export const nav = {
  guide: [{ product: 'guide', slug: 'start-here', title: 'Start here', section: 'Guide' }],
  'django-resaas': navFromReadme('django-resaas'),
  'quasar-resaas': navFromReadme('quasar-resaas')
}

export function groupedNav (product) {
  const groups = []
  for (const item of nav[product] || []) {
    let group = groups.find(g => g.section === item.section)
    if (!group) groups.push(group = { section: item.section, items: [] })
    group.items.push(item)
  }
  return groups
}

// previous / next page, in sidebar order
export function neighbours (product, slug) {
  const list = nav[product] || []
  const i = list.findIndex(item => item.slug === slug)
  return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null }
}

// ---------------------------------------------------------------- links

function normalise (parts) {
  const out = []
  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') out.pop()
    else out.push(part)
  }
  return out
}

// A relative link written inside a library's docs, resolved against the content tree.
// Returns { product, slug, key } for a document of this site, or null.
export function resolveSlug (product, fromSlug, target) {
  const base = `${product}/${fromSlug}`.split('/').slice(0, -1)
  const parts = normalise([...base, ...target.replace(/\.md$/, '').split('/')])
  let [p, ...rest] = parts

  // "../src/dev/README.md" from the django docs index = the example app page
  if (product === 'django-resaas' && parts.join('/') === 'src/dev/README') {
    return { product: 'django-resaas', slug: 'example-app', key: 'django-resaas/example-app' }
  }
  if (!productByKey[p]) return null
  const slug = rest.join('/') || 'README'
  return { product: p, slug, key: `${p}/${slug}` }
}

// Where a link that leaves the docs (source files, tests, ...) points on GitHub.
export function githubUrl (product, fromSlug, target) {
  const info = productByKey[product]
  if (!info?.repo) return null
  const inRepo = `${info.repoDocs}/${fromSlug}`.split('/').slice(0, -1)
  const path = normalise([...inRepo, ...target.split('/')]).join('/')
  return `${info.repo}/blob/${info.branch}/${path}`
}

// "https://github.com/metanochava/quasar_resaas/blob/main/docs/quasar-resaas/x.md#y"
// -> { product: 'quasar-resaas', slug: 'x', hash: 'y' } when that page is on this site
export function docOfGithubUrl (href) {
  for (const info of products) {
    if (!info.repo) continue
    const prefix = `${info.repo}/blob/${info.branch}/${info.repoDocs}/`
    if (!href.startsWith(prefix)) continue
    const [file, hash] = href.slice(prefix.length).split('#')
    const slug = file.replace(/\.md$/, '')
    if (file.endsWith('.md') && docs[`${info.key}/${slug}`] !== undefined) return { product: info.key, slug, hash: hash || '' }
  }
  return null
}

export function editUrl (product, slug) {
  const info = productByKey[product]
  if (!info?.repo) return null
  const file = slug === 'example-app' ? 'src/dev/README.md' : `${info.repoDocs}/${slug}.md`
  return `${info.repo}/blob/${info.branch}/${file}`
}

// ---------------------------------------------------------------- search

function plain (raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_|-]+/g, ' ')
    .replace(/\s+/g, ' ')
}

const index = Object.entries(nav).flatMap(([, items]) => items.map((item) => {
  const raw = docs[`${item.product}/${item.slug}`] || ''
  const headings = [...raw.matchAll(/^#{2,3}\s+(.+)$/gm)].map(m => m[1].replace(/`/g, ''))
  return { ...item, headings, text: plain(raw).toLowerCase() }
}))

export function search (query, limit = 12) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1)
  if (!words.length) return []

  return index
    .map((doc) => {
      let score = 0
      let heading = null
      for (const word of words) {
        if (doc.title.toLowerCase().includes(word)) score += 10
        const h = doc.headings.find(x => x.toLowerCase().includes(word))
        if (h) { score += 5; heading = heading || h }
        if (doc.text.includes(word)) score += 1
        else score -= 4
      }
      const at = doc.text.indexOf(words[0])
      const excerpt = at >= 0 ? doc.text.slice(Math.max(0, at - 40), at + 100).trim() : ''
      return { ...doc, score, heading, excerpt }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
