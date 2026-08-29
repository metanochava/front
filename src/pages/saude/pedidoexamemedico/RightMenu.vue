
<template>
  <s-pdf-render
    v-model="PedidoexamemedicoStore.showPdf"
    :src="PedidoexamemedicoStore.pdf"
    title="Ped. Exame Medico"
  />
  <HistoryList
    title="Ped. Exame Medico"
    :store="PedidoexamemedicoStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

import HistoryList from '../components/HistoryList.vue'
import { usePedidoexamemedicoStore } from './pedidoexamemedicoStore.js'

const PedidoexamemedicoStore = usePedidoexamemedicoStore()



function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      PedidoexamemedicoStore.getPdf(item.id)
      PedidoexamemedicoStore.showPdf = true
    }
  }else{
    PedidoexamemedicoStore.getPdf(item.id)
    PedidoexamemedicoStore.showPdf = true
  }
}
</script>
