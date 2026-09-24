

<template>
  <s-pdf-render
    v-model="ConsultaStore.showPdf"
    :src="ConsultaStore.pdf"
    :title="tdc('Medical consultation')"
  />
  <HistoryList
    :title="tdc('Medical consultation')"
    :store="ConsultaStore"
    :actions="['Pdf', 'Edit', 'Reprint', 'delete']"
    route-key="consulta"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

import HistoryList from '../components/HistoryList.vue'
import { useConsultaStore } from './consultaStore'


const ConsultaStore = useConsultaStore()

function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      ConsultaStore.getPdf(item.id)
      ConsultaStore.showPdf = true
    }
  }else{
    ConsultaStore.getPdf(item.id)
    ConsultaStore.showPdf = true
  }
}
</script>
