<template>
  <q-dialog v-model="open">
    <s-modal-card :title="tdc('Exam trail')" icon="history" width="640px" data-test="exam-trail-dialog" @close="open = false">
      <div v-if="loading" class="flex flex-center q-pa-lg"><q-spinner size="40px" /></div>

      <div v-else-if="!events.length" class="text-grey-7 q-pa-md">{{ tdc('Nothing recorded for this exam yet.') }}</div>

      <q-timeline v-else layout="dense" color="primary" class="q-px-md">
        <q-timeline-entry
          v-for="(e, index) in events" :key="index"
          :title="tdc(ACTION_LABELS[e.action] || e.action)"
          :subtitle="`${formatDate(e.at)}${e.by ? ' · ' + e.by : ''}`"
        >
          <div v-if="e.details.reason">{{ tdc('Reason') }}: {{ e.details.reason }}</div>
          <div v-if="e.details.from && e.details.to" class="text-caption text-grey-7">
            {{ tdc(stateLabel(e.details.from)) }} → {{ tdc(stateLabel(e.details.to)) }}
          </div>
          <div v-if="e.details.revision" class="text-caption text-grey-7">
            {{ tdc('Revision') }} {{ e.details.revision }}
          </div>
        </q-timeline-entry>
      </q-timeline>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// Read-only audit trail of one exam item (GET itempedidoexamemedicos/{id}/trail/,
// view_itempedidoexamemedico): arrival, collections, rejections with their
// reasons, processing, cancellation and the result's lifecycle.
import { computed, ref, watch } from 'vue'
import { HTTPAuth, url, tdc } from 'quasar_resaas'

const props = defineProps({
  modelValue: Boolean,
  itemId: { type: [String, Number], default: null }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const ACTION_LABELS = {
  LAB_CHECKED_IN: 'Patient arrived at the laboratory',
  LAB_SAMPLE_COLLECTED: 'Sample collected',
  LAB_SAMPLE_REJECTED: 'Sample rejected',
  LAB_PROCESSING_STARTED: 'Processing started',
  LAB_EXAM_CANCELLED: 'Exam cancelled',
  LAB_RESULT_RECORDED: 'Result recorded',
  LAB_RESULT_VALIDATED: 'Result validated',
  LAB_RESULT_RELEASED: 'Result released',
  LAB_RESULT_AMENDED: 'Result amended'
}
const STATES = {
  pendente: 'Pending', agendado: 'Scheduled', colhido: 'Collected', processamento: 'Processing',
  concluido: 'Completed', cancelado: 'Cancelled', recolha_necessaria: 'Recollection Required'
}
function stateLabel (value) { return STATES[value] || value }

const events = ref([])
const loading = ref(false)

function formatDate (value) {
  return value ? new Date(value).toLocaleString() : '-'
}

async function load () {
  if (!props.itemId) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `saude/itempedidoexamemedicos/${props.itemId}/trail/` }))
    events.value = data || []
  } finally {
    loading.value = false
  }
}

watch(() => [props.modelValue, props.itemId], ([isOpen]) => { if (isOpen) load() }, { immediate: true })
</script>
