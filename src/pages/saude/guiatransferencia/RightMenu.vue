
<template>
  <s-pdf-render
    v-model="GuiatransferenciaStore.showPdf"
    :src="GuiatransferenciaStore.pdf"
    :title="tdc('Transfer form')"
  />
  <HistoryList
    :title="tdc('Transfer form')"
    :store="GuiatransferenciaStore"
    :actions="['pdf', 'Accao B', 'Accao C']"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

import HistoryList from '../components/HistoryList.vue'
import { useGuiatransferenciaStore } from './guiatransferenciaStore'


const GuiatransferenciaStore = useGuiatransferenciaStore()



function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      GuiatransferenciaStore.getPdf(item.id)
      GuiatransferenciaStore.showPdf = true
    }

  }else{
    GuiatransferenciaStore.getPdf(item.id)
    GuiatransferenciaStore.showPdf = true
  }
}
</script>
