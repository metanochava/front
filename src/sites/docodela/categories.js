// Care categories of the site - one source for the category page
// (pages/CategoryFinancePage.vue, /categoria/:categoria) and the patients page
// (components/UtentesComp.vue). Canonical English, translated with tdc() where shown.
export const categories = {
  'consultas-medicas': {
    icon: 'medical_information',
    label: 'Medical appointments',
    desc: 'Find providers and specialists available in our network and arrange your care more easily.',
    primaryLabel: 'Get in touch',
    primaryRoute: 'contacto'
  },
  'exames-diagnostico': {
    icon: 'biotech',
    label: 'Exams and diagnostics',
    desc: 'Arrange lab work, imaging and other diagnostic procedures available through our network of providers.',
    primaryLabel: 'Get in touch',
    primaryRoute: 'contacto'
  },
  'saude-dentaria': {
    icon: 'health_and_safety',
    label: 'Dental health',
    desc: 'Explore options for eligible dental consultations, treatments and procedures.',
    primaryLabel: 'Get in touch',
    primaryRoute: 'contacto'
  },
  'procedimentos-tratamentos': {
    icon: 'healing',
    label: 'Procedures and treatments',
    desc: 'We make it easier to access different procedures and treatments carried out by partner providers.',
    primaryLabel: 'Get in touch',
    primaryRoute: 'contacto'
  },
  'saude-mulher-homem': {
    icon: 'wc',
    label: "Women's and men's health",
    desc: 'Find specialised care and treatment options suited to your needs.',
    primaryLabel: 'Get in touch',
    primaryRoute: 'contacto'
  },
  'cuidados-especializados': {
    icon: 'volunteer_activism',
    label: 'Specialised care',
    desc: 'For specific needs, we help guide your path through the options available in our network.',
    primaryLabel: 'Get in touch',
    primaryRoute: 'contacto'
  },
  'financiamento-saude': {
    icon: 'payments',
    label: 'Healthcare financing',
    desc: 'When your care is eligible, Docodela24horas can help you look into a solution to organise payment more predictably, suited to your circumstances.',
    primaryLabel: 'Assess financing',
    primaryRoute: 'calculadora'
  },
}
