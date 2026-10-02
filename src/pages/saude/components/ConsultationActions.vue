<template>
  <!-- .stop.prevent: these buttons sit inside a clickable row - neither the row's
       click nor its link may follow (the row opens the consultation) -->
  <div class="row no-wrap items-center q-gutter-x-xs" @click.stop.prevent>
    <s-btn
      v-if="canPdf"
      flat round dense color="primary" icon="picture_as_pdf"
      :loading="loadingPdf" data-test="consultation-pdf"
      @click="openPdf"
    >
      <s-tooltip>{{ tdc('Consultation PDF') }}</s-tooltip>
    </s-btn>
    <s-btn
      v-if="canEdit"
      flat round dense color="primary" icon="edit" data-test="consultation-edit"
      @click="router.push({ name: 'change_consulta', params: { id: consulta.id } })"
    >
      <s-tooltip>{{ tdc('Edit consultation') }}</s-tooltip>
    </s-btn>
    <s-btn
      v-if="canSeeDocuments && !hideDocuments"
      flat round dense color="primary" icon="folder_open" data-test="consultation-documents"
      @click="showDocuments = true"
    >
      <s-tooltip>{{ tdc('Linked documents') }}</s-tooltip>
    </s-btn>
  </div>

  <s-pdf-render v-model="showPdf" :src="pdfSrc" :title="tdc('Medical consultation')" />
  <ConsultationDocumentsDialog v-model="showDocuments" :consulta-id="showDocuments ? consulta.id : null" />
</template>

<script setup>
// Actions of a consultation in a list: its PDF, edit (only the author within
// the edit window, with change_consulta - the backend enforces both:
// 403 not_document_author / 409 edit_window_expired) and the documents linked
// to it.
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, useUserStore } from 'quasar_resaas'

import { useConsultaStore } from '../consulta/consultaStore'
import { canEditDocument } from './documentEditPolicy'
import ConsultationDocumentsDialog from './ConsultationDocumentsDialog.vue'

const props = defineProps({
  consulta: { type: Object, required: true },
  hideDocuments: { type: Boolean, default: false },
})

const User = useUserStore()
const Consulta = useConsultaStore()
const router = useRouter()

// UX only - the backend checks each permission again
const DOCUMENT_MODELS = ['receitamedica', 'atestadomedico', 'guiatransferencia', 'relatoriomedico', 'pedidoexamemedico']
const canPdf = computed(() => User.can('pdf_consulta'))
const canSeeDocuments = computed(() => DOCUMENT_MODELS.some(model => User.can(`list_${model}`)))
const canEdit = computed(() => User.can('change_consulta') && canEditDocument(props.consulta, User.data?.id))

const loadingPdf = ref(false)
const showPdf = ref(false)
const pdfSrc = ref(null)
const showDocuments = ref(false)

async function openPdf () {
  loadingPdf.value = true
  try {
    await Consulta.getPdf(props.consulta.id)
    Consulta.showPdf = false
    pdfSrc.value = Consulta.pdf
    showPdf.value = true
  } finally {
    loadingPdf.value = false
  }
}
</script>
