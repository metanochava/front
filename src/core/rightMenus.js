// 🔥 aqui você controla TODOS menus do sistema

import ConsultaRightMenu from './../pages/saude/consulta/RightMenu.vue'
import ReceitamendicaRightMenu from './../pages/saude/receitamedica/RightMenu.vue'
import PedidoexamemedicoRightMenu from './../pages/saude/pedidoexamemedico/RightMenu.vue'
import ResultadopedidoexamemedicoRightMenu from './../pages/saude/resultadopedidoexamemedico/RightMenu.vue'
import AtestadomedicoRightMenu from './../pages/saude/atestadomedico/RightMenu.vue'
import GuiatransferenciaRightMenu from './../pages/saude/guiatransferencia/RightMenu.vue'
import RelatoriomedicoRightMenu from './../pages/saude/relatoriomedico/RightMenu.vue'
import ClinicalsummaryRightMenu from './../pages/saude/clinicalsummary/RightMenu.vue'

// import InternamentoRightMenu from './../pages/saude/internamento/RightMenu.vue'



// every document's history also on its change_ page (editing a document
// keeps the patient's list of those documents at hand)
export function setupRightMenus(menu) {

  menu.registerRightMenu('view_consulta', ConsultaRightMenu)
  menu.registerRightMenu('add_consulta', ConsultaRightMenu)
  menu.registerRightMenu('change_consulta', ConsultaRightMenu)
  menu.registerRightMenu('list_consulta', ConsultaRightMenu)

  menu.registerRightMenu('view_receitamedica', ReceitamendicaRightMenu)
  menu.registerRightMenu('add_receitamedica', ReceitamendicaRightMenu)
  menu.registerRightMenu('change_receitamedica', ReceitamendicaRightMenu)
  menu.registerRightMenu('list_receitamedica', ReceitamendicaRightMenu)

  menu.registerRightMenu('view_atestadomedico', AtestadomedicoRightMenu)
  menu.registerRightMenu('add_atestadomedico', AtestadomedicoRightMenu)
  menu.registerRightMenu('change_atestadomedico', AtestadomedicoRightMenu)
  menu.registerRightMenu('list_atestadomedico', AtestadomedicoRightMenu)

  menu.registerRightMenu('view_guiatransferencia', GuiatransferenciaRightMenu)
  menu.registerRightMenu('add_guiatransferencia', GuiatransferenciaRightMenu)
  menu.registerRightMenu('change_guiatransferencia', GuiatransferenciaRightMenu)
  menu.registerRightMenu('list_guiatransferencia', GuiatransferenciaRightMenu)

  menu.registerRightMenu('view_relatoriomedico', RelatoriomedicoRightMenu)
  menu.registerRightMenu('add_relatoriomedico', RelatoriomedicoRightMenu)
  menu.registerRightMenu('change_relatoriomedico', RelatoriomedicoRightMenu)
  menu.registerRightMenu('list_relatoriomedico', RelatoriomedicoRightMenu)

  menu.registerRightMenu('view_clinicalsummary', ClinicalsummaryRightMenu)
  menu.registerRightMenu('add_clinicalsummary', ClinicalsummaryRightMenu)
  menu.registerRightMenu('change_clinicalsummary', ClinicalsummaryRightMenu)
  menu.registerRightMenu('list_clinicalsummary', ClinicalsummaryRightMenu)

  menu.registerRightMenu('view_pedidoexamemedico', PedidoexamemedicoRightMenu)
  menu.registerRightMenu('add_pedidoexamemedico', PedidoexamemedicoRightMenu)
  menu.registerRightMenu('change_pedidoexamemedico', PedidoexamemedicoRightMenu)
  menu.registerRightMenu('list_pedidoexamemedico', PedidoexamemedicoRightMenu)


  menu.registerRightMenu('view_resultadopedidoexamemedico', ResultadopedidoexamemedicoRightMenu)
  menu.registerRightMenu('add_resultadopedidoexamemedico', ResultadopedidoexamemedicoRightMenu)
  menu.registerRightMenu('change_resultadopedidoexamemedico', ResultadopedidoexamemedicoRightMenu)
  menu.registerRightMenu('list_resultadopedidoexamemedico', ResultadopedidoexamemedicoRightMenu)

  // menu.registerRightMenu('view_internamento', InternamentoRightMenu)
  // menu.registerRightMenu('add_internamento', InternamentoRightMenu)
  // menu.registerRightMenu('list_internamento', InternamentoRightMenu)

}
