// Everything on the portfolio that is DATA, not text: links, contact, the stack, the
// project metadata. The words a visitor reads are English keys passed through tdc()
// in the components (translations live in the backend lang files).
//
// Edit this file to change what the site links to.

export const profile = {
  name: 'Metano Chavana',
  // rotates in the hero (each one is translated with tdc)
  roles: ['Computer engineer', 'Digital forensics', 'Application developer'],
  location: 'Moçambique',
  defaultLanguage: 'pt-pt'
}

// A link left empty is not shown. Add yours here.
export const contact = {
  email: 'metanochava@gmail.com',
  github: '',
  linkedin: '',
  whatsapp: ''
}

// proper nouns: never translated
export const stack = [
  {
    group: 'Backend',
    icon: 'dns',
    items: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'JWT', 'Celery-style jobs', 'pytest']
  },
  {
    group: 'Frontend',
    icon: 'web',
    items: ['Vue 3', 'Quasar', 'Pinia', 'Vite', 'JavaScript', 'Vitest']
  },
  {
    group: 'Security and forensics',
    icon: 'policy',
    items: ['Evidence acquisition', 'Integrity hashing', 'Timeline analysis', 'Log analysis', 'TOTP two-factor', 'RBAC', 'Audit trails']
  },
  {
    group: 'Delivery',
    icon: 'rocket_launch',
    items: ['Linux', 'Nginx', 'Git', 'REST APIs', 'Firebase', 'i18n']
  }
]

// what each project is made of (the description is translated in the component)
export const projects = [
  {
    id: 'resaas',
    featured: true,
    icon: 'hub',
    tags: ['Django', 'DRF', 'Vue 3', 'Quasar', 'PostgreSQL', 'JWT']
  },
  { id: 'health', icon: 'medical_services', tags: ['Django', 'Vue 3', 'PDF', 'HL7-ready'] },
  { id: 'pharmacy', icon: 'medication', tags: ['Django', 'Stock ledger', 'Sales'] },
  { id: 'security', icon: 'shield_lock', tags: ['TOTP', 'RBAC', 'Audit'] },
  { id: 'sites', icon: 'language', tags: ['Vue 3', 'Quasar', 'i18n'] }
]

export const sections = ['about', 'method', 'stack', 'projects', 'contact']
