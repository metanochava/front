
<template>
  <s-pdf-render
    v-model="AtestadomedicoStore.showPdf"
    :src="AtestadomedicoStore.pdf"
    title="Atestado Medico"
  />
  <HistoryList
    title="Atestado Medico"
    :store="AtestadomedicoStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

import HistoryList from '../components/HistoryList.vue'
import { useAtestadomedicoStore } from './atestadomedicoStore'


const AtestadomedicoStore = useAtestadomedicoStore()



function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      AtestadomedicoStore.getPdf(item.id)
      AtestadomedicoStore.showPdf = true
    }
  }else{
    AtestadomedicoStore.getPdf(item.id)
    AtestadomedicoStore.showPdf = true
  }
}
</script>

