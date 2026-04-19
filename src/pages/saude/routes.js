import { alergiacorrenteRoutes } from './alergiacorrente/alergiacorrenteRoutes'
import { doencacorrenteRoutes } from './doencacorrente/doencacorrenteRoutes'
import { medicacaocorrenteRoutes } from './medicacaocorrente/medicacaocorrenteRoutes'
import { medicamentoRoutes } from './medicamento/medicamentoRoutes'
import { tipoexamemedicoRoutes } from './tipoexamemedico/tipoexamemedicoRoutes'
import { classeexamemedicoRoutes } from './classeexamemedico/classeexamemedicoRoutes'
import { examemedicoRoutes } from './examemedico/examemedicoRoutes'
import { dadovitalRoutes } from './dadovital/dadovitalRoutes'
import { pedidoexamemedicoRoutes } from './pedidoexamemedico/pedidoexamemedicoRoutes'
import { guiatransferenciaRoutes } from './guiatransferencia/guiatransferenciaRoutes'
import { relatoriomedicoRoutes } from './relatoriomedico/relatoriomedicoRoutes'
import { atestadomedicoRoutes } from './atestadomedico/atestadomedicoRoutes'
import { receitamedicaRoutes } from './receitamedica/receitamedicaRoutes'
import { consultaRoutes } from './consulta/consultaRoutes'
import { pacienteRoutes } from './paciente/pacienteRoutes'

export let saudeRoutes = [
  ...pacienteRoutes,
  ...consultaRoutes,
  ...receitamedicaRoutes,
  ...atestadomedicoRoutes,
  ...relatoriomedicoRoutes,
  ...guiatransferenciaRoutes,
  ...pedidoexamemedicoRoutes,
  ...dadovitalRoutes,
  ...examemedicoRoutes,
  ...classeexamemedicoRoutes,
  ...tipoexamemedicoRoutes,
  ...medicamentoRoutes,
  ...medicacaocorrenteRoutes,
  ...doencacorrenteRoutes,
  ...alergiacorrenteRoutes,
]
