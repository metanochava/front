// 🔥 aqui você controla TODOS menus do sistema

import ConsultaRightMenu from './../pages/clinica/consulta/RightMenu.vue'
import ReceitamendicaRightMenu from './../pages/clinica/receita/RightMenu.vue'
import InternamentoRightMenu from './../pages/clinica/internamento/RightMenu.vue'

import PedidoexamemedicoRightMenu from './../pages/clinica/pedido_exame/RightMenu.vue'
import AtestadomedicoRightMenu from './../pages/clinica/atestado/RightMenu.vue'
import GuiatransferenciaRightMenu from './../pages/clinica/guia_transferencia/RightMenu.vue'
import RelatoriomedicoRightMenu from './../pages/clinica/relatorio/RightMenu.vue'


export function setupRightMenus(menu) {

  menu.registerRightMenu('view_consulta', ConsultaRightMenu)
  menu.registerRightMenu('add_consulta', ConsultaRightMenu)
  menu.registerRightMenu('list_consulta', ConsultaRightMenu)

  menu.registerRightMenu('view_receitamendica', ReceitamendicaRightMenu)
  menu.registerRightMenu('add_receitamendica', ReceitamendicaRightMenu)
  menu.registerRightMenu('list_receitamendica', ReceitamendicaRightMenu)

  menu.registerRightMenu('view_atestadomedico', AtestadomedicoRightMenu)
  menu.registerRightMenu('add_atestadomedico', AtestadomedicoRightMenu)
  menu.registerRightMenu('list_atestadomedico', AtestadomedicoRightMenu)

  menu.registerRightMenu('view_guiatransferencia', GuiatransferenciaRightMenu)
  menu.registerRightMenu('add_guiatransferencia', GuiatransferenciaRightMenu)
  menu.registerRightMenu('list_guiatransferencia', GuiatransferenciaRightMenu)

  menu.registerRightMenu('view_relatoriomedico', RelatoriomedicoRightMenu)
  menu.registerRightMenu('add_relatoriomedico', RelatoriomedicoRightMenu)
  menu.registerRightMenu('list_relatoriomedico', RelatoriomedicoRightMenu)

  menu.registerRightMenu('view_internamento', InternamentoRightMenu)
  menu.registerRightMenu('add_internamento', InternamentoRightMenu)
  menu.registerRightMenu('list_internamento', InternamentoRightMenu)

  menu.registerRightMenu('view_pedidoexamemedico', PedidoexamemedicoRightMenu)
  menu.registerRightMenu('add_pedidoexamemedico', PedidoexamemedicoRightMenu)
  menu.registerRightMenu('list_pedidoexamemedico', PedidoexamemedicoRightMenu)


}
