<template>
  <s-pdf-render
    v-model="Clinicalsummary.showPdf"
    :src="Clinicalsummary.pdf"
    :title="tdc('Clinical summary')"
  />
  <HistoryList
    :title="tdc('Clinical summary')"
    :store="Clinicalsummary"
    :actions="['Pdf', 'Edit', 'Reprint', 'delete']"
    route-key="clinicalsummary"
    @action="onClick"
  />
</template>

<script setup>
import { tdc } from 'quasar_resaas'

import HistoryList from '../components/HistoryList.vue'
import { useClinicalsummaryStore } from './clinicalsummaryStore'

const Clinicalsummary = useClinicalsummaryStore()

// a click on the row, or its PDF action, shows the PDF
function onClick (item, action) {
  if (!action || action === 'pdf') {
    Clinicalsummary.getPdf(item.id)
    Clinicalsummary.showPdf = true
  }
}
</script>
