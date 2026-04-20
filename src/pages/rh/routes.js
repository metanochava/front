import { funcionario_cargoRoutes } from './funcionario_cargo/funcionario_cargoRoutes'
import { contratoRoutes } from './contrato/contratoRoutes'
import { funcionarioRoutes } from './funcionario/funcionarioRoutes'
import { cargoRoutes } from './cargo/cargoRoutes'
import { departamentoRoutes } from './departamento/departamentoRoutes'

export let rhRoutes = [
  ...departamentoRoutes,
  ...cargoRoutes,
  ...funcionarioRoutes,
  ...contratoRoutes,
  ...funcionario_cargoRoutes,
]
