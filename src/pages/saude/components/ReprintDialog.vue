<template>
  <q-dialog v-model="open" persistent>
    <s-modal-card :title="tdc('Reprint')" icon="print" width="440px" form @close="open = false" @submit="submit">
      <div class="column q-gutter-y-md">
        <template v-for="field in fields" :key="field.name">
          <s-time v-if="field.type === 'time'" v-model="form[field.name]" :label="tdc(field.label)" />
          <s-date v-else v-model="form[field.name]" :label="tdc(field.label)" />
        </template>

        <div v-if="error" class="text-negative">{{ error }}</div>
      </div>

      <template #footer>
        <s-btn flat :label="tdc('Cancel')" :disable="saving" @click="open = false" />
        <s-btn type="submit" color="primary" icon="print" :label="tdc('Reprint')" :loading="saving" />
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { tdc, errorMessage } from 'quasar_resaas'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  store: { type: Object, required: true },
  item: { type: Object, default: null },
  // [{ name, label, type: 'date' | 'time' }] - only the model's editable date fields
  fields: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'done'])

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = reactive({})
const saving = ref(false)
const error = ref('')

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) return
  error.value = ''
  for (const field of props.fields) {
    form[field.name] = props.item?.[field.name] ?? ''
  }
})

// Saves only what changed, then tells the list to print the (updated) record.
async function submit() {
  const changes = {}
  for (const field of props.fields) {
    if ((form[field.name] || null) !== (props.item?.[field.name] || null)) {
      changes[field.name] = form[field.name] || null
    }
  }

  saving.value = true
  error.value = ''

  try {
    const updated = Object.keys(changes).length ? await props.store.patchById(props.item.id, changes) : props.item
    open.value = false
    emit('done', { ...props.item, ...updated })
  } catch (e) {
    error.value = errorMessage(e) || tdc('Could not save the changes.')
  } finally {
    saving.value = false
  }
}
</script>
