// Everything on the MyTech site that is DATA, not text: nav, contact, business
// divisions. The words a visitor reads are English keys passed through tdc()
// in the components (translations live in the backend lang files).
//
// Contact fields are intentionally empty: MyTech's real phone/email/address/
// WhatsApp/social links were not provided. A field left empty is not shown -
// fill these in before this site is considered launch-ready.

export const profile = {
  name: 'MyTech',
  defaultLanguage: 'pt-pt'
}

export const contact = {
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  linkedin: '',
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

export const sections = ['solutions', 'training', 'equipment', 'company']
