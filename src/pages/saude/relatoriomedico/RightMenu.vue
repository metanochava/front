<template>
  <s-pdf-render
    v-model="RelatoriomedicoStore.showPdf"
    :src="RelatoriomedicoStore.pdf"
    :title="tdc('Medical report')"
  />
  <HistoryList
    :title="tdc('Medical report')"
    :store="RelatoriomedicoStore"
    :actions="['Pdf', 'Edit', 'Reprint', 'delete']"
    route-key="relatoriomedico"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

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
