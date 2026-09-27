// Everything on the portfolio that is DATA, not text: links, contact, the stack, the
// project metadata. The words a visitor reads are English keys passed through tdc()
// in the components (translations live in the backend lang files).
//
// Edit this file to change what the site links to.

// the headshot: an 800px web copy of images/Foto.png (2.4 MB) - the original stays as is
import photo from './images/foto-web.jpg'
// real screenshots of the public websites (captured from the running sites)
import shotAmal from './images/site-amal.jpg'
import shotDocodela from './images/site-docodela.jpg'

export const profile = {
  name: 'Dias Metano Salvador Chavana',
  // rotates in the hero (each one is translated with tdc)
  roles: ['Computer engineer', 'Digital forensics', 'Application developer'],
  location: 'Moçambique',
  defaultLanguage: 'pt-pt',
  // Headshot shown in the hero, at professional CV-photo proportions (portrait, object-fit
  // cover): the file imported above (images/foto-web.jpg). Set it to '' and the hero
  // shows an initials avatar instead - never a placeholder photo of someone else.
  photo
}

// The CV (real facts; dates, institutions and employers exactly as given). The resume
// section shows them; the hero's highlights are counted from them.
export const education = [
  {
    period: 'In progress',
    title: 'PhD in Computer Science and Digital Forensics',
    place: 'National Forensic Sciences University'
  },
  {
    period: '2020 – 2022',
    title: 'Master in Digital Forensics and Information Security',
    place: 'Gujarat Forensic Sciences University'
  },
  {
    period: '2017 – 2019',
    title: 'Master in Information Systems for Environmental Management',
    place: 'Universidade Pedagógica'
  },
  {
    period: '2012 – 2017',
    title: "Bachelor's degree in Systems Development Engineering",
    place: 'Universidade Pedagógica'
  }
]

export const experience = [
  {
    period: '2017 – 2020',
    title: 'Information systems lecturer',
    place: 'Universidade São Tomás',
    text: 'Helped students build web and desktop applications in Java, C++, PHP, HTML, CSS and JavaScript, set assignments after each module and reported on student performance.'
  },
  {
    period: '2015 – 2017',
    title: 'Project manager',
    place: 'Setma Tic',
    text: 'Analysed and developed information systems, organised development teams per project, and reported weekly progress and results at each development phase.'
  },
  {
    period: '2013 – 2015',
    title: 'Web designer',
    place: 'Universidade Pedagógica',
    text: "Built web applications and helped manage information across the institution's departments, producing weekly reports with suggestions to overcome development issues."
  }
]

export const certifications = [
  'Cyber Security Expert',
  'AWS Academy – Introduction to Cloud',
  'CEH',
  'CISM',
  'CISSP',
  'CCSP – Certified Cloud Security Professional'
]

// The hero's highlights, calculated from the CV above - they stay right as time
// passes (the years of experience count from the first role, 2013).
const firstRoleYear = Math.min(...experience.map(item => parseInt(item.period, 10)))

export const highlights = [
  { value: String(new Date().getFullYear() - firstRoleYear), label: 'Years of professional experience' },
  { value: String(education.filter(item => /\d{4}/.test(item.period)).length), label: 'Academic degrees' },
  { value: String(certifications.length), label: 'Certifications' }
]

// A link left empty is not shown. Add yours here.
export const contact = {
  email: 'metanochava@gmail.com',
  phones: ['+258 85 733 5500', '+258 86 733 5500', '+258 83 733 5500', '+91 74900 60603'],
  github: 'https://github.com/metanochava',
  linkedin: 'https://www.linkedin.com/in/dias-metano-salvador-chavana-55a246a9/',
  // wa.me takes the number in international format, digits only (+258 85 733 5500)
  whatsapp: 'https://wa.me/258857335500'
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
  { id: 'health', icon: 'medical_services', tone: 'cool', tags: ['Django', 'Vue 3', 'PDF', 'HL7-ready'] },
  { id: 'pharmacy', icon: 'medication', tone: 'ok', tags: ['Django', 'Stock ledger', 'Sales'] },
  // 'shield_lock' is a Material Symbols name: the Material Icons font drew it as two icons
  { id: 'security', icon: 'security', tags: ['TOTP', 'RBAC', 'Audit'] },
  {
    id: 'sites',
    icon: 'language',
    tags: ['Vue 3', 'Quasar', 'i18n'],
    // shown in browser frames on the card
    shots: [
      { src: shotAmal, alt: 'Clínica Amal', url: 'clinicaamal.co.mz' },
      { src: shotDocodela, alt: 'Docodela 24 Horas', url: 'docodela.mytech.co.mz' }
    ]
  }
]

export const sections = ['about', 'resume', 'method', 'stack', 'projects', 'contact']
