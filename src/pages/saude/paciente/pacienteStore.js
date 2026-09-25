
import {  HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const usePacienteStore = createBaseStore(
  'paciente',
  { app: 'saude', model: 'Paciente' },
  {
    // The current patient (row) and the patient form survive F5
    // (quasar_resaas base/persistence.js): per user + Entity + Branch, for
    // one working shift, removed at logout. A restored row is only a
    // snapshot for the first paint - getById() always asks the backend for
    // it. personDraft: the Person half of the add_paciente form (usePersonIntake
    // draftState(), no files). Personal/clinical data on the device: keep
    // this list to what the patient pages need.
    persist: {
      include: ['row', 'form', 'personDraft'],
      scope: 'branch',
      ttl: 8 * 60 * 60 * 1000
    },

    state: () => ({
      personDraft: null,
      person: null,
      user: null,
      registering: false
    }),

    getters: {
      actual: (state) => state.row,
    },

    actions: {
      // PacienteAPIView.register (saude/views/paciente.py) - atomic
      // Person(+reuse)/Document/PersonContact/Paciente creation, same
      // multipart shape as EmployeeStore.register(): a JSON `payload`
      // plus the new person's photo and one file per document (a nested
      // per-item list of files can't ride through BaseStore's generic
      // FormData builder, which only flattens plain scalars/arrays).
      async register({ personId, personData, photo, documents, contacts, patientData } = {}) {
        this.registering = true

        try {
          const fd = new FormData()

          const payloadDocuments = (documents || []).map((doc, index) => {
            const hasFile = doc.arquivo instanceof File
            if (hasFile) fd.append(`document_file_${index}`, doc.arquivo)

            // eslint-disable-next-line no-unused-vars
            const { arquivo, ...rest } = doc
            return { ...rest, _file_key: hasFile ? `document_file_${index}` : null }
          })

          fd.append('payload', JSON.stringify({
            person_id: personId || null,
            person: personId ? null : (personData || null),
            documents: payloadDocuments,
            contacts: contacts || [],
            patient: patientData || {}
          }))

          if (!personId && photo instanceof File) {
            fd.append('person_photo', photo)
          }

          const { data } = await HTTPAuth.post(
            url({ type: 'u', url: 'saude/pacientes/register/' }),
            fd,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )

          return data
        } finally {
          this.registering = false
        }
      },

      async getPerson() {
        const rsp = await HTTPAuth.get(url({ type: 'u', url: 'django_resaas/persons/' + this.row?.person_id, params: { } }))
        this.person = rsp.data
        return rsp.data
      },
    },

    hooks: {
      beforeLoad() {

      },

      afterLoad(data) {
        data
      },

      beforeCreate(form) {
        form
      }
    }
  }
)
