<template>
  <!-- payment and paper-prescription fields shared by the counter and the
       collection of an online order (the record is written by the backend) -->
  <div class="q-gutter-md" data-test="payment-fields">
    <s-select v-model="model.payment_method" :options="methods" label="Payment method" emit-value map-options />
    <s-input v-model="model.payment_reference" label="Payment reference" :hint="tdc('e.g. the M-Pesa transaction code')" />
    <template v-if="prescriptionRequired">
      <s-checkbox v-model="model.prescription_verified" data-test="prescription-verified"
        label="I verified the paper prescription" />
      <s-input v-model="model.prescription_reference" label="Prescription reference"
        :hint="tdc('Number or prescriber written on the prescription')" />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'
import { PAYMENT_METHODS } from './useCounter'

const model = defineModel({ type: Object, required: true })
defineProps({ prescriptionRequired: { type: Boolean, default: false } })
const methods = computed(() => PAYMENT_METHODS.map((method) => ({ ...method, label: tdc(method.label) })))
</script>
