<template>
  <q-page class="q-pa-sm">
    <!-- top: the request's PDF in the shared PDF modal (pdf_pedidoexamemedico) -->
    <div v-if="User.can('pdf_pedidoexamemedico')" class="row justify-end q-mb-sm">
      <s-btn
        unelevated
        no-caps
        color="primary"
        icon="picture_as_pdf"
        :label="tdc('PDF')"
        data-test="exam-request-pdf"
        @click="openPdf"
      >
        <s-tooltip>{{ tdc('Show the request PDF') }}</s-tooltip>
      </s-btn>
    </div>

    <s-pdf-render
      v-model="Pedidoexamemedico.showPdf"
      :src="Pedidoexamemedico.pdf"
      :title="tdc('Exam request')"
    />

    <!-- the request's patient (patient_id: its own or its consultation's) -
         the route :id is the request, not the patient -->
    <PacienteHeader v-if="patientId" :patient-id="patientId" />
    <!-- FORM -->
    <div v-if="Pedidoexamemedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <s-form
      :store="Pedidoexamemedico"
      :ignore-fields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    >
    </s-form>

    <!-- the requested exams (items action, view_pedidoexamemedico) -->
    <s-card flat bordered class="q-mt-md" data-test="exam-request-items">
      <q-card-section class="text-subtitle1 text-weight-medium">
        {{ tdc('Requested exams') }}
      </q-card-section>
      <q-separator />
      <q-list separator>
        <q-item v-for="item in Pedidoexamemedico.requestItems" :key="item.id">
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ item.exame?.label }}</q-item-label>
            <q-item-label v-if="item.instrucoes" caption>
              <b>{{ tdc('Instructions') }}:</b> <span v-html="sanitizeClinicalHtml(item.instrucoes)"></span>
            </q-item-label>
            <q-item-label v-if="item.observacao" caption>
              <b>{{ tdc('Observation') }}:</b> <span v-html="sanitizeClinicalHtml(item.observacao)"></span>
            </q-item-label>
          </q-item-section>
          <q-item-section side class="column items-end q-gutter-xs">
            <q-badge
              outline
              :color="valueOf(item.prioridade) === 'urgente' ? 'negative' : 'grey-7'"
              :label="tdc(item.prioridade?.label || 'Normal')"
            />
            <span class="text-caption text-grey-7">{{ tdc(item.estado_exame?.label || '') }}</span>
          </q-item-section>
        </q-item>
        <q-item v-if="!Pedidoexamemedico.requestItems?.length">
          <q-item-section class="text-grey-7">{{ tdc('No exam requested.') }}</q-item-section>
        </q-item>
      </q-list>
    </s-card>
  </q-page>
</template>


<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, useUserStore } from 'quasar_resaas'

import { usePedidoexamemedicoStore } from './pedidoexamemedicoStore'
import PacienteHeader from './../paciente/PacienteHeaderPage.vue'
import { sanitizeClinicalHtml } from '../components/clinicalHtml'

const route = useRoute()
const User = useUserStore()
const Pedidoexamemedico = usePedidoexamemedicoStore()

const patientId = computed(() => Pedidoexamemedico.row?.patient_id || Pedidoexamemedico.form?.patient_id || null)

// a choice comes as {id, value, label} when read
const valueOf = (choice) => (choice && typeof choice === 'object' ? choice.value : choice)

function openPdf () {
  Pedidoexamemedico.getPdf(route.params.id)
  Pedidoexamemedico.showPdf = true
}

watch(
  () => route.params.id,
  (id) => {
    Pedidoexamemedico.requestItems = []
    if (id) Pedidoexamemedico.loadItems(id)
  },
  { immediate: true }
)
</script>
