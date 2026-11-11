<template>
  <!-- Reprint: the same document, only the date printed next to the
       signature is the one chosen here (GET <document>/<id>/pdf/?date=...,
       saude/services/reprint.py). Nothing is saved: the record keeps its dates. -->
  <q-dialog v-model="open" persistent>
    <s-modal-card :title="tdc('Reprint')" icon="print" width="440px" form @close="open = false" @submit="submit">
      <div class="column q-gutter-y-md">
        <s-date v-model="date" :label="tdc('Date next to the signature')" data-test="reprint-date" />
        <div class="text-caption text-grey-7">{{ tdc('The document is printed again with this date; nothing is changed.') }}</div>
        <div v-if="error" class="text-negative">{{ error }}</div>
      </div>
      <template #footer>
        <s-btn flat :label="tdc('Cancel')" :disable="printing" @click="open = false">
          <s-tooltip>{{ tdc('Close without printing') }}</s-tooltip>
        </s-btn>
        <s-btn type="submit" color="primary" icon="print" :label="tdc('Reprint')" :loading="printing" :disable="!date" data-test="reprint-submit">
          <s-tooltip>{{ tdc('Print the document with this date') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { tdc, errorMessage } from 'quasar_resaas'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // the list's store: its getPdf(id, params) opens the PDF viewer of the menu
  store: { type: Object, required: true },
  item: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'done'])

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const date = ref('')
const printing = ref(false)
const error = ref('')

// today, in the local calendar (ISO)
function today () {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) return
  error.value = ''
  date.value = today()
})

async function submit () {
  if (!date.value || !props.item?.id) return
  printing.value = true
  error.value = ''
  try {
    await props.store.getPdf(props.item.id, { date: date.value })
    open.value = false
    emit('done', props.item)
  } catch (e) {
    error.value = errorMessage(e) || tdc('Could not print the document.')
  } finally {
    printing.value = false
  }
}
</script>
