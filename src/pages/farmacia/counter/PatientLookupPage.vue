<template>
  <q-page class="q-pa-md" data-test="patient-lookup-page">
    <s-page-title :title="tdc('Find patient')" />

    <s-card class="q-pa-md q-mb-md">
      <form class="row q-col-gutter-sm items-start" @submit.prevent="find">
        <div class="col-12 col-sm-8">
          <s-input dense v-model="code" label="Patient code" :hint="tdc('NID or another identifier of the patient')"
            data-test="patient-code" autocomplete="off" />
        </div>
        <div class="col-12 col-sm-4">
          <s-btn type="submit" color="primary" icon="person_search" label="Find" :loading="loading" class="full-width">
            <s-tooltip>{{ tdc('Find') }}</s-tooltip>
          </s-btn>
        </div>
      </form>
      <div class="text-caption text-grey q-mt-sm">
        {{ tdc('The code finds the patient; records of another organisation are shown only with the patient\'s consent. Every search is recorded.') }}
      </div>
    </s-card>

    <div v-if="notFound" class="text-grey q-pa-md" data-test="patient-not-found">
      {{ tdc('No patient with this code can be shown here.') }}
    </div>

    <template v-if="record">
      <s-card class="q-pa-md q-mb-md" data-test="patient-record">
        <div class="text-h6">{{ record.patient.name }}</div>
        <div v-if="record.patient.date_of_birth" class="text-caption">
          {{ tdc('Date of birth') }}: {{ record.patient.date_of_birth }}
        </div>
        <div class="q-mt-xs">
          <q-chip v-for="id in record.patient.identifiers" :key="id.nid + id.source_entity" dense
            :color="id.is_external ? 'orange-2' : 'grey-3'">
            {{ id.nid }} · {{ id.source_entity }}
          </q-chip>
        </div>
      </s-card>

      <s-card v-if="record.allergies.length" class="q-pa-md q-mb-md bg-red-1" data-test="patient-allergies">
        <div class="text-subtitle1 text-negative"><q-icon name="warning" /> {{ tdc('Medication allergies') }}</div>
        <div v-for="(allergy, index) in record.allergies" :key="index">
          {{ allergy.medicine }} · {{ tdc(severityLabel[allergy.severity] || allergy.severity) }}
          <span v-if="allergy.reaction"> · {{ allergy.reaction }}</span>
          <span v-if="allergy.is_external" class="text-caption"> ({{ allergy.source_entity }})</span>
        </div>
      </s-card>

      <div class="text-subtitle1 q-mb-sm">{{ tdc('Prescriptions') }}</div>
      <div v-if="!record.prescriptions.length" class="text-grey q-pa-md">{{ tdc('No prescriptions.') }}</div>
      <q-list v-else bordered separator class="rounded-borders">
        <q-item v-for="prescription in record.prescriptions" :key="prescription.id" data-test="patient-prescription">
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ prescription.date || '—' }} · {{ prescription.prescriber || tdc('Prescriber not recorded') }}
              <q-badge v-if="prescription.is_external" color="orange" class="q-ml-xs">
                {{ tdc('Other organisation') }}: {{ prescription.source_entity }}
              </q-badge>
            </q-item-label>
            <q-item-label v-for="(item, index) in prescription.items" :key="index" caption>
              {{ item.medicine }} {{ item.strength }} · {{ item.quantity }} · {{ item.dosage }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge v-if="prescription.queue_status" color="primary">{{ tdc(queueLabel[prescription.queue_status] || prescription.queue_status) }}</q-badge>
            <s-btn v-else dense color="primary" icon="playlist_add" label="Add to queue" :loading="adding === prescription.id"
              @click="enqueue(prescription)">
              <s-tooltip>{{ tdc('Add to queue') }}</s-tooltip>
            </s-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { AlertSuccess, tdc } from 'quasar_resaas'
import { enqueuePrescription, lookupPatient } from './useCounter'

const code = ref('')
const record = ref(null)
const notFound = ref(false)
const loading = ref(false)
const adding = ref(null)

// saude / farmacia choice labels (canonical English)
const severityLabel = { leve: 'Mild', moderada: 'Moderate', grave: 'Severe', anafilaxia: 'Anaphylaxis' }
const queueLabel = {
  pendente: 'Pending', em_revisao: 'Under Review', aprovada: 'Approved', rejeitada: 'Rejected',
  dispensada_parcial: 'Partially Dispensed', dispensada: 'Dispensed', cancelada: 'Cancelled',
}

async function find () {
  loading.value = true
  record.value = null
  notFound.value = false
  try {
    record.value = await lookupPatient(code.value.trim())
  } catch (error) {
    notFound.value = error?.response?.status === 404
  } finally {
    loading.value = false
  }
}

async function enqueue (prescription) {
  adding.value = prescription.id
  try {
    const fila = await enqueuePrescription(prescription.id)
    prescription.queue_status = fila.estado?.value ?? fila.estado
    AlertSuccess(tdc('Prescription added to the pharmacy queue.'))
  } catch {
    // shown by the API client
  } finally {
    adding.value = null
  }
}
</script>
