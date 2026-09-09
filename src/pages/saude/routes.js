import "./dashboard/dashboard.js"
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
import { medicoRoutes } from './medico/medicoRoutes'

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
  {
    path: '/dashboard_saude_clinica',
    name: 'dashboard_saude_clinica',
    component: () => import('./dashboards/ClinicaDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Clínica'),
      requiresAuth: true,
      icon: 'medical_services',
      requiredRole: 'view_dashboard_saude_clinica',
    },
  },
  {
    path: '/view_dashboard_saude_medicacao',
    name: 'view_dashboard_saude_medicacao',
    component: () => import('./dashboards/MedicacaoDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Medicação'),
      requiresAuth: true,
      icon: 'medication',
      requiredRole: 'view_dashboard_saude_medicacao',
    },
  },
  {
    path: '/view_dashboard_saude_documentos_medicos',
    name: 'view_dashboard_saude_documentos_medicos',
    component: () => import('./dashboards/DocumentosMedicosDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Documentos Médicos'),
      requiresAuth: true,
      icon: 'assignment',
      requiredRole: 'view_dashboard_saude_documentos_medicos',
    },
  },
  {
    path: '/view_dashboard_saude_exames',
    name: 'view_dashboard_saude_exames',
    component: () => import('./dashboards/ExamesDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Exames'),
      requiresAuth: true,
      icon: 'biotech',
      requiredRole: 'view_dashboard_saude_exames',
    },
  },
  {
    path: '/view_dashboard_saude_historico_clinico',
    name: 'view_dashboard_saude_historico_clinico',
    component: () => import('./dashboards/HistoricoClinicoDashboardPage.vue'),
    meta: {
      title: tdc('Dashboard') + ' ' + tdc('Histórico Clínico'),
      requiresAuth: true,
      icon: 'history_edu',
      requiredRole: 'view_dashboard_saude_historico_clinico',
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
  ...medicoRoutes,
]
