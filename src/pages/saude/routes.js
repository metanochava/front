import { tdc } from 'quasar_resaas'

import { alergiacorrenteRoutes } from './alergiacorrente/alergiacorrenteRoutes'
import { doencacorrenteRoutes } from './doencacorrente/doencacorrenteRoutes'
import { medicacaocorrenteRoutes } from './medicacaocorrente/medicacaocorrenteRoutes'
import { medicamentoRoutes } from './medicamento/medicamentoRoutes'
import { tipoexamemedicoRoutes } from './tipoexamemedico/tipoexamemedicoRoutes'
import { classeexamemedicoRoutes } from './classeexamemedico/classeexamemedicoRoutes'
import { examemedicoRoutes } from './examemedico/examemedicoRoutes'
import { dadovitalRoutes } from './dadovital/dadovitalRoutes'
import { pedidoexamemedicoRoutes } from './pedidoexamemedico/pedidoexamemedicoRoutes'
import { itempedidoexamemedicoRoutes } from './itempedidoexamemedico/itempedidoexamemedicoRoutes'
import { resultadopedidoexamemedicoRoutes } from './resultadopedidoexamemedico/resultadopedidoexamemedicoRoutes'
import { guiatransferenciaRoutes } from './guiatransferencia/guiatransferenciaRoutes'
import { relatoriomedicoRoutes } from './relatoriomedico/relatoriomedicoRoutes'
import { atestadomedicoRoutes } from './atestadomedico/atestadomedicoRoutes'
import { receitamedicaRoutes } from './receitamedica/receitamedicaRoutes'
import { consultaRoutes } from './consulta/consultaRoutes'
import { pacienteRoutes } from './paciente/pacienteRoutes'
import { horariomedicoRoutes } from './horariomedico/horariomedicoRoutes'

export let saudeRoutes = [
  {
    path: '/view_saude_dashboard',
    name: 'view_saude_dashboard',
    component: () => import('./DashBoarde.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Saúde'),
      requiresAuth: true,
      icon: 'dashboard',
      requiredRole: 'view_saude_dashboard',
    },
  },
  ...pacienteRoutes,
  ...consultaRoutes,
  ...receitamedicaRoutes,
  ...atestadomedicoRoutes,
  ...relatoriomedicoRoutes,
  ...guiatransferenciaRoutes,
  ...pedidoexamemedicoRoutes,
  ...itempedidoexamemedicoRoutes,
  ...resultadopedidoexamemedicoRoutes,
  ...dadovitalRoutes,
  ...examemedicoRoutes,
  ...classeexamemedicoRoutes,
  ...tipoexamemedicoRoutes,
  ...medicamentoRoutes,
  ...medicacaocorrenteRoutes,
  ...doencacorrenteRoutes,
  ...alergiacorrenteRoutes,
  ...horariomedicoRoutes,
]
