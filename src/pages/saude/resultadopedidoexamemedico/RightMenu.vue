


<template>
  <s-pdf-render
    v-model="PedidoexamemedicoStore.showPdf"
    :src="PedidoexamemedicoStore.pdf"
    :title="tdc('Exam request result')"
  />
  <AddResultadoModal
    v-model="PedidoexamemedicoStore.showDialogModal"
  />
  <!-- only the open patient's exam requests (the results page is one patient's) -->
  <HistoryList
    v-if="patientId"
    :key="patientId"
    :params="{ patient: patientId }"
    :title="tdc('Exam request result')"
    :store="PedidoexamemedicoStore"
    :actions="['Pdf', 'Ad. Resultado', 'Edit', 'delete']"
    route-key="pedidoexamemedico"
    @action="onClick"
  />
</template>

<script setup>
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'

import HistoryList from '../components/HistoryList.vue'
import { usePedidoexamemedicoStore } from './../../saude/pedidoexamemedico/pedidoexamemedicoStore'

import  AddResultadoModal  from './AddResultadoModal.vue'
import { useResultadopedidoexamemedicoStore } from './resultadopedidoexamemedicoStore'

const PedidoexamemedicoStore = usePedidoexamemedicoStore()
const Resultadopedidoexamemedico = useResultadopedidoexamemedicoStore()

// the patient the results page shows (route :id)
const patientId = computed(() => Resultadopedidoexamemedico.paciente || null)


function onClick(item, action) {
  if (action){
    if (action == 'pdf'){
      PedidoexamemedicoStore.getPdf(item.id)
      PedidoexamemedicoStore.showPdf = true
    }

    if (action == 'Ad. Resultado'){
      PedidoexamemedicoStore.getItemPedido(item.id)
      PedidoexamemedicoStore.showDialogModal = true
    }
  }else{
    PedidoexamemedicoStore.getPdf(item.id)
    PedidoexamemedicoStore.showPdf = true
  }
}
</script>
