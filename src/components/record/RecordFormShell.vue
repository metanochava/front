<template>
  <!-- the frame of a manual add_/change_ page: title, the form's card, the
       general error and Cancel / Save. The page fills the default slot with
       its own fields (useRecordForm does the rest). -->
  <q-page class="q-pa-sm" :data-test="testId">
    <div class="row items-center q-mb-sm">
      <q-icon :name="icon" size="24px" class="q-mr-sm" />
      <div class="text-h6" data-test="record-form-title">{{ title }}</div>
    </div>

    <div v-if="!ready" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <s-card v-else flat bordered class="q-pa-md">
      <slot />

      <div v-if="error" class="text-negative q-mt-sm" data-test="record-form-error">{{ error }}</div>

      <div class="row justify-end q-gutter-sm q-mt-md">
        <s-btn flat :label="tdc('Cancel')" data-test="record-form-cancel" @click="emit('cancel')">
          <s-tooltip>{{ tdc('Leave without saving') }}</s-tooltip>
        </s-btn>
        <s-btn unelevated color="primary" icon="save" :label="tdc('Save')" :loading="saving" :disable="!canSave"
               data-test="record-form-save" @click="emit('save')">
          <s-tooltip>{{ saveTooltip || tdc('Save the record') }}</s-tooltip>
        </s-btn>
      </div>
    </s-card>
  </q-page>
</template>

<script setup>
import { tdc } from 'quasar_resaas'

defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'edit_note' },
  ready: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  canSave: { type: Boolean, default: false },
  error: { type: String, default: '' },
  saveTooltip: { type: String, default: '' },
  testId: { type: String, default: 'record-form' }
})
const emit = defineEmits(['save', 'cancel'])
</script>
