<template>
  <s-pdf-render
    v-model="RelatoriomedicoStore.showPdf"
    :src="RelatoriomedicoStore.pdf"
    title="Relatorio Medico"
  />
  <HistoryList
    title="Relatorio Medico"
    :store="RelatoriomedicoStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

import HistoryList from '../components/HistoryList.vue'
import { useRelatoriomedicoStore } from './relatoriomedicoStore'

const RelatoriomedicoStore = useRelatoriomedicoStore()



function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      RelatoriomedicoStore.getPdf(item.id)
      RelatoriomedicoStore.showPdf = true
    }
  }else{
    RelatoriomedicoStore.getPdf(item.id)
    RelatoriomedicoStore.showPdf = true
  }
}
</script>
