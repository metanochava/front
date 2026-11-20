<template>
  <q-dialog :model-value="modelValue" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="tdc('New tab')" icon="table_bar" width="400px">
      <div class="q-gutter-md">
        <s-input
          v-model="label"
          autofocus
          maxlength="60"
          :label="tdc('Table or name')"
          :hint="tdc('For example: Table 4, João, Counter 2')"
          data-test="new-tab-label"
          @keyup.enter="submit"
        />
        <s-select
          v-model="customer"
          :api="customerSelectUrl"
          option-label="label" option-value="value"
          emit-value map-options clearable
          :label="tdc('Customer') + ' (' + tdc('optional') + ')'"
          :hint="tdc('Their price list is used')"
        />
        <div v-if="error" class="text-negative text-caption" data-test="new-tab-error">{{ error }}</div>
      </div>

      <template #footer>
        <s-btn flat :label="tdc('Cancel')" @click="emit('update:modelValue', false)">
          <s-tooltip>{{ tdc('Close without opening a tab') }}</s-tooltip>
        </s-btn>
        <s-btn unelevated color="primary" icon="add" :label="tdc('Open tab')" :loading="saving"
               :disable="!label.trim()" data-test="new-tab-submit" @click="submit">
          <s-tooltip>{{ tdc('Open the tab and start ordering') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { tdc, url } from 'quasar_resaas'

// Asks the new tab's name (a table or a person) and, optionally, the
// customer. The page opens it (Sale.openTab) and reports errors back.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const customerSelectUrl = url({ type: 'u', url: 'sales/customers', params: { select: 'true' } })
const label = ref('')
const customer = ref(null)

watch(() => props.modelValue, (open) => {
  if (open) {
    label.value = ''
    customer.value = null
  }
})

function submit () {
  if (!label.value.trim()) return
  emit('submit', { tab_label: label.value.trim(), customer: customer.value })
}
</script>
