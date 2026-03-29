
import { HTTPAuth, url, createBaseStore} from 'quasar_resaas'

export const PacienteStore = createBaseStore(
  'paciente',
  {
    url: 'ipa/clinica/pacientes',
    app: 'clinica',
    model: 'Paciente'
  },

  // 🔥 EXTENSÃO
  {
    state: () => ({
      linha: null,
      timeline: [],
      consultas: [],
      exames: []
    }),

    getters: {
      actual: (state) => state.linha,
      temInternamento: (state) => !!state.linha?.is_internmet
    },

    actions: {

      // 🔥 MOCK (para desenvolvimento offline)
      loadMock() {
        this.linha = {
          id: 1,
          nome: 'Maria José',
          email: 'maria@gmail.com',
          estado: true,
          idade: 32,
          telefone: '84 000 0000',
          sangue: 'O+',
          medico: 'Dr. Carlos',
          alergia: true,
          diagnostico: 'Hipertensão leve',
          obs: 'Paciente em acompanhamento'
        }

        this.timeline = [
          {
            id: 1,
            titulo: 'Consulta Geral',
            data: '2026-03-20',
            descricao: 'Paciente com dor de cabeça'
          },
          {
            id: 2,
            titulo: 'Exame Raio-X',
            data: '2026-03-22',
            descricao: 'Sem alterações significativas'
          },
          {
            id: 3,
            titulo: 'Retorno',
            data: '2026-03-25',
            descricao: 'Melhora significativa'
          }
        ]

        this.consultas = [
          { id: 1, data: '2026-03-20', medico: 'Dr. Carlos', status: 'Finalizada' },
          { id: 2, data: '2026-03-25', medico: 'Dr. Ana', status: 'Em andamento' }
        ]

        this.exames = [
          { id: 1, nome: 'Raio-X', data: '2026-03-22' },
          { id: 2, nome: 'Hemograma', data: '2026-03-23' }
        ]
      },

      // 🔥 DASHBOARD REAL (API)
      async loadDashboard(id) {
        this.loading = true

        try {
          const { data } = await HTTPAuth.get(
            url({ type: 'u', url: `${this.url}/${id}/dashboard/` })
          )

          this.linha = data.paciente
          this.timeline = data.timeline || []
          this.consultas = data.consultas || []
          this.exames = data.exames || []

        } catch (error) {
          console.warn('⚠️ API falhou, usando MOCK...', error)

          // fallback automático
          this.loadMock()
        } finally {
          this.loading = false
        }
      },

      // 🔥 MARCAR CONSULTA
      async marcarConsulta(payload) {
        return await HTTPAuth.post(
          url({ type: 'u', url: `ipa/clinica/agendamentos` }),
          payload
        )
      },

      // 🔥 OVERRIDE DO BASE
      async getById(id) {
        console.log('🔥 getById custom (dashboard)')
        return await this.loadDashboard(id)
      }
    }
  }
)
