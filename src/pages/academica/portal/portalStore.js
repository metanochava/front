import { createBaseStore, HTTPAuth, url } from 'quasar_resaas'

// the student / guardian portal (back academica portal_service): the caller's own
// enrolments and, for one of them, grades, attendance and tuition. The server
// resolves "own" from the signed-in user - nothing here chooses whose data.
const get = async (path, params) => (await HTTPAuth.get(url({ type: 'u', url: path, params }))).data

export const usePortalStore = createBaseStore('academicaPortal', { app: 'academica', model: 'Enrolment' }, {
  state: () => ({ enrolments: [], grades: null, attendance: null, tuition: null, loading: false }),
  actions: {
    async loadEnrolments () {
      this.loading = true
      try {
        this.enrolments = await get('academica/enrolments/mine/')
      } finally {
        this.loading = false
      }
      return this.enrolments
    },
    async loadEnrolment (enrolment, { period } = {}) {
      this.loading = true
      try {
        const [grades, attendance, tuition] = await Promise.all([
          get('academica/grades/mine/', { enrolment, ...(period ? { period } : {}) }),
          get('academica/studentattendances/mine/', { enrolment }),
          get('academica/tuitioncharges/mine/', { enrolment })
        ])
        Object.assign(this, { grades, attendance, tuition })
      } finally {
        this.loading = false
      }
    }
  }
})
