<template>
  <!-- a machine's password, shown once: it is never stored -->
  <s-modal-card :title="tdc('Machine password')" icon="key" width="min(460px, 94vw)" @close="emit('close')">
    <div class="text-body2 q-mb-sm">{{ username }}</div>
    <div class="row items-center no-wrap pw-box">
      <code class="col text-h6" data-test="vm-password">{{ password }}</code>
      <s-btn flat round dense icon="content_copy" @click="copy"><s-tooltip>{{ tdc('Copy the password') }}</s-tooltip></s-btn>
    </div>
    <div class="text-caption text-negative q-mt-sm">{{ tdc('Write it down now: it is shown only once and is not stored.') }}</div>
    <template #footer>
      <s-btn color="primary" :label="tdc('Done')" @click="emit('close')"><s-tooltip>{{ tdc('Close') }}</s-tooltip></s-btn>
    </template>
  </s-modal-card>
</template>

<script setup>
import { copyToClipboard } from 'quasar'
import { tdc } from 'quasar_resaas'

const props = defineProps({ password: { type: String, required: true }, username: { type: String, default: '' } })
const emit = defineEmits(['close'])
const copy = () => copyToClipboard(props.password)
</script>

<style scoped>
.pw-box { padding: 10px 12px; border-radius: 10px; background: rgba(128, 128, 128, 0.1); }
</style>
