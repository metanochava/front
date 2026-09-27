import { reactive } from 'vue'
import { HTTPClient, url } from 'quasar_resaas'

// Shared by the "Our doctors" section and the booking form: the clinic's
// doctors come once from GET saude/publicbooking/doctors/ (public - the clinic
// is found from this site's Origin), and a doctor chosen in "Our doctors" is
// handed to the booking form.
const state = reactive({
  doctors: [],        // [{ id, name, specialties: [{ id, title }], photo }]
  loaded: false,
  loading: false,
  error: false,
  // { doctor, specialty } asked for by "Book appointment" on a doctor card
  preselect: null,
})

let pending = null

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
  state.preselect = {
    doctor: doctor.id,
    specialty: specialties.length === 1 ? specialties[0].id : null,
  }
  document.getElementById('marcacao')?.scrollIntoView({ behavior: 'smooth' })
}

export function usePublicBooking () {
  return { state, loadDoctors, bookWith }
}
