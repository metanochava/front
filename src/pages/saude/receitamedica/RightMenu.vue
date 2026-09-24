<template>
  <s-pdf-render
    v-model="ReceitamedicaStore.showPdf"
    :src="ReceitamedicaStore.pdf"
    :title="tdc('Medical report')"
  />
  <HistoryList
    :title="tdc('Medical report')"
    :store="ReceitamedicaStore"
    :actions="['Pdf', 'Edit', 'Reprint', 'delete']"
    route-key="receitamedica"
    :date-fields="[{ name: 'data', label: 'Date', type: 'date' }, { name: 'hora', label: 'Time', type: 'time' }]"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

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
