<template>
  <!-- "Enter results" for a patient. The patient list calls openLatest(id,
       label): straight to the latest request. The patient header calls
       trigger(id, label) on every click of its button:
       one click  -> the results of the patient's LATEST exam request;
       double click -> this dialog, to pick the exam request.
       Either way the results are the same modal as the results page
       (AddResultadoModal). -->
  <q-dialog v-model="pickerOpen" persistent>
    <!-- the patient is the same for every request: named once, in the title -->
    <s-modal-card :title="title" icon="science" width="640px" @close="pickerOpen = false">

      <div v-if="loading" class="flex flex-center q-pa-lg">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="40px" />
      </div>

      <template v-else>
        <div class="text-caption text-grey-6 q-mb-xs">{{ tdc('Choose the exam request') }}</div>
        <q-list bordered separator data-test="result-entry-requests">
          <q-item
            v-for="request in requests"
            :key="request.id"
            clickable
            :data-test="`result-entry-request-${request.id}`"
            @click="openResults(request)"
          >
            <q-item-section avatar><q-icon name="biotech" color="primary" /></q-item-section>
            <q-item-section>
              <q-item-label>{{ tdc('Exam request') }} · {{ formatDate(request.created_at) }}</q-item-label>
            </q-item-section>
            <q-item-section side><q-icon name="chevron_right" /></q-item-section>
          </q-item>
          <q-item v-if="!requests.length">
            <q-item-section class="text-grey-7">{{ tdc('No exam requests for this patient.') }}</q-item-section>
          </q-item>
        </q-list>
      </template>
    </s-modal-card>
  </q-dialog>

  <AddResultadoModal v-model="showResults" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'

import AddResultadoModal from '../resultadopedidoexamemedico/AddResultadoModal.vue'
import { usePedidoexamemedicoStore } from '../pedidoexamemedico/pedidoexamemedicoStore'

// a second click within this window is a double click
const DOUBLE_CLICK_MS = 300

const Pedidoexamemedico = usePedidoexamemedicoStore()

const pacienteId = ref(null)
const pacienteLabel = ref(null)
const requests = ref([])
const loading = ref(false)
const pickerOpen = ref(false)
const showResults = ref(false)

const title = computed(() => [tdc('Enter results'), pacienteLabel.value].filter(Boolean).join(' · '))

const formatDate = (value) => ds(value)

// the patient's exam requests, newest first (pacientes/{id}/exam_requests/,
// list_pedidoexamemedico)
async function load () {
  requests.value = []
  if (!pacienteId.value) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `saude/pacientes/${pacienteId.value}/exam_requests/` }))
    requests.value = Array.isArray(data) ? data : (data?.results || [])
  } finally {
    loading.value = false
  }
}

async function openResults (request) {
  await Pedidoexamemedico.getItemPedido(request.id)
  pickerOpen.value = false
  showResults.value = true
}

// one click: straight to the latest request (none: the picker says so)
async function openLatest (id = pacienteId.value, label = pacienteLabel.value) {
  pacienteId.value = id
  pacienteLabel.value = label
  await load()
  if (requests.value.length) await openResults(requests.value[0])
  else pickerOpen.value = true
}

// double click: choose the request
async function openPicker () {
  pickerOpen.value = true
  await load()
}

let clickTimer = null

function trigger (id, label = null) {
  pacienteId.value = id
  pacienteLabel.value = label
  if (clickTimer) {
    clearTimeout(clickTimer)
    clickTimer = null
    openPicker()
    return
  }
  clickTimer = setTimeout(() => {
    clickTimer = null
    openLatest()
  }, DOUBLE_CLICK_MS)
}

// trigger: one click latest / double click picker (patient header);
// openLatest: always the latest request (patient list)
defineExpose({ trigger, openLatest })
</script>
