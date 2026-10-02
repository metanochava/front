<template>
  <q-page class="q-pa-sm">
    <PacienteHeader />

    <div v-if="loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <div v-else-if="!consulta" class="text-caption text-grey-6 q-pa-md text-center">
      {{ errorMsg || tdc('No records') }}
    </div>

    <div v-else class="row q-col-gutter-md q-mt-xs">
      <!-- the consultation: complaint/history, diagnosis, plan, with PDF / edit -->
      <div class="col-12 col-md-8">
        <ConsultationCard :consulta="consulta" standalone />
      </div>

      <!-- everything linked to it (prescriptions, certificates, referrals, reports, exam requests) -->
      <div class="col-12 col-md-4">
        <s-card flat bordered>
          <q-card-section class="row items-center q-py-sm">
            <q-icon name="folder_open" color="primary" class="q-mr-xs" />
            <div class="text-subtitle2 text-weight-medium">{{ tdc('Linked documents') }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <ConsultationDocumentsList :consulta-id="consulta.id" />
          </q-card-section>
        </s-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// A consultation's page: its full content and, beside it, everything linked
// to it - each document with its PDF. Data from GET saude/consultas/{id}/
// (view_consulta, tenant scope) and the linked lists (list_<model> each).
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, errorMessage } from 'quasar_resaas'

import { useConsultaStore } from './consultaStore'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import ConsultationCard from './../components/ConsultationCard.vue'
import ConsultationDocumentsList from './../components/ConsultationDocumentsList.vue'

const route = useRoute()
const Consulta = useConsultaStore()

const consulta = ref(null)
const loading = ref(true)
const errorMsg = ref('')

async function load (id) {
  if (!id) return
  loading.value = true
  errorMsg.value = ''
  try {
    consulta.value = await Consulta.getById(id, { force: true })
  } catch (e) {
    consulta.value = null
    errorMsg.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, load, { immediate: true })
</script>
