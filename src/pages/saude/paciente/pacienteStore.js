
import {  HTTPAuth, url, createBaseStore } from 'quasar_resaas'

export const usePacienteStore = createBaseStore(
  'paciente',
  { app: 'saude', model: 'Paciente' },
  {
    state: () => ({
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
