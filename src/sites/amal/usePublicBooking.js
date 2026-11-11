import { reactive } from 'vue'
import { HTTPClient, url } from 'quasar_resaas'

// Shared by the "Our doctors" section and the booking form: the clinic's
// doctors come once from GET saude/publicbooking/doctors/ (public - the clinic
// is found from this site's Origin), and a doctor chosen in "Our doctors" is
// handed to the booking form.
const state = reactive({
  doctors: [],        // [{ id, name, category, specialties: [{ id, title }], photo, branches: [id] }]
  branches: [],       // the clinic's branches [{ id, name }]
  loaded: false,
  loading: false,
  error: false,
  // { doctor, specialty } asked for by "Book appointment" on a doctor card
  preselect: null,
})

let pending = null
let pendingBranches = null

// the clinic's branches (GET saude/publicbooking/branches/), once
function loadBranches () {
  if (state.branches.length) return Promise.resolve(state.branches)
  if (pendingBranches) return pendingBranches
  pendingBranches = HTTPClient.get(url({ type: 'u', url: 'saude/publicbooking/branches/' }))
    .then(response => {
      state.branches = Array.isArray(response.data) ? response.data : []
      return state.branches
    })
    .catch(() => [])
    .finally(() => { pendingBranches = null })
  return pendingBranches
}

function loadDoctors () {
  if (state.loaded) return Promise.resolve(state.doctors)
  if (pending) return pending

  state.loading = true
  pending = HTTPClient.get(url({ type: 'u', url: 'saude/publicbooking/doctors/' }))
    .then(response => {
      state.error = !Array.isArray(response.data)
      state.doctors = Array.isArray(response.data) ? response.data : []
      state.loaded = !state.error
      return state.doctors
    })
    .catch(() => {
      state.error = true
      return []
    })
    .finally(() => {
      state.loading = false
      pending = null
    })

  return pending
}

// "Book appointment" on a doctor card: preselect the doctor (and, when the
// doctor has only one, the specialty) and bring the booking form into view.
function bookWith (doctor) {
  const specialties = doctor?.specialties || []
  const branches = doctor?.branches || []
  state.preselect = {
    doctor: doctor.id,
    specialty: specialties.length === 1 ? specialties[0].id : null,
    branch: branches.length === 1 ? branches[0] : null,
  }
  document.getElementById('marcacao')?.scrollIntoView({ behavior: 'smooth' })
}

// A specialty card (Specialties section): preselect only the specialty - the
// booking form then offers that specialty's doctors.
function bookSpecialty (specialty) {
  state.preselect = { doctor: null, specialty: specialty.id }
  document.getElementById('marcacao')?.scrollIntoView({ behavior: 'smooth' })
}

export function usePublicBooking () {
  return { state, loadDoctors, loadBranches, bookWith, bookSpecialty }
}
