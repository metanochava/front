// Everything on the MyTech site that is DATA, not text: nav, contact, business
// divisions. The words a visitor reads are English keys passed through tdc()
// in the components (translations live in the backend lang files).
//
// A contact field left empty is not shown.

// real screenshots of the live sites below (captured from the running sites)
import workAmal from './images/work-amal.jpg'
import workDocodela from './images/work-docodela.jpg'

export const profile = {
  name: 'MyTech',
  defaultLanguage: 'pt-pt'
}

// Metano's own contacts (the same as his portfolio) until MyTech has its own mailbox
// on mytech.co.mz. whatsapp: international format, digits only (used as wa.me/<number>).
export const contact = {
  email: 'metanochava@gmail.com',
  phone: '+258 85 733 5500',
  whatsapp: '258857335500',
  address: '',
  linkedin: 'https://www.linkedin.com/in/dias-metano-salvador-chavana-55a246a9/',
  facebook: '',
  instagram: ''
}

// the four business divisions - each keeps one accent colour from the logo,
// named after Quasar's own semantic palette (primary/positive/warning/negative
// - see mytech.css's --q-* overrides) so `color="..."` props and `text-*`/`bg-*`
// utility classes resolve to the right MyTech brand colour automatically.
export const divisions = [
  {
    id: 'management-systems',
    slug: 'management-systems',
    icon: 'hub',
    color: 'primary',
    title: 'Management systems'
  },
  {
    id: 'digital-forensics',
    slug: 'digital-forensics',
    icon: 'fingerprint',
    color: 'negative',
    title: 'Digital forensics'
  },
  {
    id: 'development',
    slug: 'development',
    icon: 'code',
    color: 'positive',
    title: 'Web & software development'
  },
  {
    id: 'equipment',
    slug: 'equipment',
    icon: 'memory',
    color: 'warning',
    title: 'IT equipment'
  }
]

// Recent work: sites MyTech built and runs in production (names and domains are
// proper nouns, not translated; text and tags are English keys for tdc()).
export const work = [
  {
    id: 'amal',
    name: 'Clínica Amal',
    domain: 'clinicaamal.co.mz',
    url: 'https://clinicaamal.co.mz/',
    image: workAmal,
    text: 'Website for a clinic in Maputo: its doctors and specialties, online appointment requests and a map of its branches, in four languages.',
    tags: ['Healthcare', 'Online booking', 'Multilingual']
  },
  {
    id: 'docodela',
    name: 'Docodela 24 Horas',
    domain: 'docodela.mytech.co.mz',
    url: 'https://docodela.mytech.co.mz/',
    image: workDocodela,
    text: 'Website for a healthcare access and financing service: care categories, a loan calculator and guides to financing treatment.',
    tags: ['Healthcare', 'Financing', 'Loan calculator']
  }
]

export const sections = ['solutions', 'training', 'equipment', 'company']
