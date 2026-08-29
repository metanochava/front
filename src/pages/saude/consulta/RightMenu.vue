

<template>
  <s-pdf-render
    v-model="ConsultaStore.showPdf"
    :src="ConsultaStore.pdf"
    title="Consulta Medica"
  />
  <HistoryList
    title="Consulta Medica"
    :store="ConsultaStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

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
