

<template>
  <s-pdf-render
    v-model="ExamemedicoStore.showPdf"
    :src="ExamemedicoStore.pdf"
    title="Exame Medico"
  />
  <HistoryList
    title="Exame Medico"
    :store="ExamemedicoStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

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
