

<template>
  <s-pdf-render
    v-model="ExamemedicoStore.showPdf"
    :src="ExamemedicoStore.pdf"
    :title="tdc('Medical exam')"
  />
  <HistoryList
    :title="tdc('Medical exam')"
    :store="ExamemedicoStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

import HistoryList from '../components/HistoryList.vue'
import { useExamemedicoStore } from './examemedicoStore'


const ExamemedicoStore = useExamemedicoStore()



function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      ExamemedicoStore.getPdf(item.id)
      ExamemedicoStore.showPdf = true
    }
  }else{
    ExamemedicoStore.getPdf(item.id)
    ExamemedicoStore.showPdf = true
  }
}
</script>
