


<template>
  <s-pdf-render
    v-model="PedidoexamemedicoStore.showPdf"
    :src="PedidoexamemedicoStore.pdf"
    title="Resul. Ped. Exame Medico"
  />
  <AddResultadoModal
    v-model="PedidoexamemedicoStore.showDialogModal"
  />
  <HistoryList
    title="Resul. Ped. Exame Medico"
    :store="PedidoexamemedicoStore"
    :actions="['pdf', 'Ad. Resultado', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

import HistoryList from '../components/HistoryList.vue'
import { usePedidoexamemedicoStore } from './../../saude/pedidoexamemedico/pedidoexamemedicoStore'

import  AddResultadoModal  from './AddResultadoModal.vue'

const PedidoexamemedicoStore = usePedidoexamemedicoStore()


function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      PedidoexamemedicoStore.getPdf(item.id)
      PedidoexamemedicoStore.showPdf = true
    }

    if (action == 'Ad. Resultado'){
      PedidoexamemedicoStore.getItemPedido(item.id)
      PedidoexamemedicoStore.showDialogModal = true
    }
  }else{
    PedidoexamemedicoStore.getPdf(item.id)
    PedidoexamemedicoStore.showPdf = true
  }
}
</script>
