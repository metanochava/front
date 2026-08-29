<template>
  <s-pdf-render
    v-model="ReceitamedicaStore.showPdf"
    :src="ReceitamedicaStore.pdf"
    title="Relatorio Medico"
  />
  <HistoryList
    title="Relatorio Medico"
    :store="ReceitamedicaStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>

import HistoryList from '../components/HistoryList.vue'
import { useReceitamedicaStore } from './receitamedicaStore'


const ReceitamedicaStore = useReceitamedicaStore()



function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      ReceitamedicaStore.getPdf(item.id)
      ReceitamedicaStore.showPdf = true
    }
  }else{
    ReceitamedicaStore.getPdf(item.id)
    ReceitamedicaStore.showPdf = true
  }
}
</script>
