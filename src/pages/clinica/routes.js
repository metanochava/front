import { consultaRoutes } from './consulta/cunsultaRoutes'
import { pacienteRoutes } from './paciente/pacienteRoutes'

export let clinicaRoutes =  [
  ...consultaRoutes,
  ...pacienteRoutes,
]


