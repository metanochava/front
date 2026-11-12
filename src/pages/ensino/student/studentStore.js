import { createBaseStore, HTTPAuth, url, appendDocumentFiles } from 'quasar_resaas'

// a student is registered with its Person (and guardians) in one call:
// POST ensino/students/register/ (ensino student_service.register_student)
export const useStudentStore = createBaseStore(
  'student',
  { app: 'ensino', model: 'Student' },
  {
    state: () => ({ registering: false }),
    actions: {
      async register ({ personId, personData, photo, documents, contacts, admissionDate, notes, guardians } = {}) {
        this.registering = true
        try {
          const fd = new FormData()
          const payloadDocuments = appendDocumentFiles(fd, documents)
          fd.append('payload', JSON.stringify({
            person_id: personId || null,
            person: personId ? null : (personData || null),
            documents: payloadDocuments,
            contacts: contacts || [],
            admission_date: admissionDate || null,
            notes: notes || '',
            guardians: guardians || []
          }))
          if (!personId && photo instanceof File) fd.append('person_photo', photo)
          const { data } = await HTTPAuth.post(url({ type: 'u', url: 'ensino/students/register/' }), fd,
            { headers: { 'Content-Type': 'multipart/form-data' } })
          return data
        } finally {
          this.registering = false
        }
      }
    }
  }
)
