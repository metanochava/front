
<template>
  <s-pdf-render
    v-model="AtestadomedicoStore.showPdf"
    :src="AtestadomedicoStore.pdf"
    :title="tdc('Medical certificate')"
  />
  <HistoryList
    :title="tdc('Medical certificate')"
    :store="AtestadomedicoStore"
    :actions="['Pdf', 'Edit', 'Reprint', 'delete']"
    route-key="atestadomedico"
    :date-fields="[{ name: 'data_criacao', label: 'Issue date', type: 'date' }, { name: 'data_limite', label: 'Valid until', type: 'date' }]"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

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

