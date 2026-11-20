import { nextTick, reactive } from 'vue'
import { HTTPClient, url } from 'quasar_resaas'

// The clinic's exams and consultation prices (public saude/publicsite/ - the
// clinic is found from this site's Origin), shared by the home sections and
// the detail pages; the lists are read once.
const state = reactive({
  exams: [],            // [{ id, code, name, type, class, description, sample, result_hours, price }]
  consultations: [],    // [{ key, title, general, description, price }]
  loaded: { exams: false, consultations: false },
  loading: { exams: false, consultations: false },
  error: { exams: false, consultations: false },
})

const pending = {}

function loadList (name, path) {
  if (state.loaded[name]) return Promise.resolve(state[name])
  if (pending[name]) return pending[name]
  state.loading[name] = true
  pending[name] = HTTPClient.get(url({ type: 'u', url: path }))
    .then(({ data }) => {
      state.error[name] = !Array.isArray(data)
      state[name] = Array.isArray(data) ? data : []
      state.loaded[name] = !state.error[name]
      return state[name]
    })
    .catch(() => {
      state.error[name] = true
      return []
    })
    .finally(() => {
      state.loading[name] = false
      pending[name] = null
    })
  return pending[name]
}

const loadExams = () => loadList('exams', 'saude/publicsite/exams/')
const loadConsultations = () => loadList('consultations', 'saude/publicsite/consultations/')

const getExam = async (id) => (await HTTPClient.get(url({ type: 'u', url: `saude/publicsite/exams/${id}/` }))).data
const getConsultation = async (key) =>
  (await HTTPClient.get(url({ type: 'u', url: `saude/publicsite/consultations/${key}/` }))).data

// a price as the site shows it (the clinic's currency is MZN)
function formatPrice (value) {
  if (value === null || value === undefined || value === '') return null
  return `${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MZN`
}

// a section of the home page (#marcacao, #exames, ...) from any page of the
// site: back to /home when needed, then scroll to it once it is rendered
async function goToSection (router, hash) {
  if (router.currentRoute.value.name !== 'home') await router.push({ name: 'home' })
  for (let attempt = 0; attempt < 20; attempt++) {
    await nextTick()
    const el = document.querySelector(hash)
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); return true }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  return false
}

export function usePublicSite () {
  return { state, loadExams, loadConsultations, getExam, getConsultation, formatPrice, goToSection }
}
