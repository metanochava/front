<template>
  <!-- at the bottom of the map: how many pharmacies are inside the radius, and
       - / + to make the radius smaller or larger (RADIUS_STEPS_KM) -->
  <div class="nearby-radius" data-test="pharmacies-nearby">
    <s-btn
      flat
      round
      dense
      size="sm"
      color="primary"
      icon="remove"
      :disable="modelValue <= minKm"
      :aria-label="tdc('Decrease radius')"
      data-test="radius-decrease"
      @click="$emit('update:modelValue', stepRadius(modelValue, -1))"
    >
      <s-tooltip>{{ tdc('Decrease radius') }}</s-tooltip>
    </s-btn>

    <div class="nearby-radius__text">
      <q-badge :color="count ? 'primary' : 'grey'" rounded class="q-mr-xs">{{ count }}</q-badge>
      <span>{{ count ? tdc('Pharmacies near you are highlighted.') : tdc('No pharmacy near you.') }}</span>
      <span class="nearby-radius__km" data-test="radius-km">(≤ {{ modelValue }} km)</span>
    </div>

    <s-btn
      flat
      round
      dense
      size="sm"
      color="primary"
      icon="add"
      :disable="modelValue >= maxKm"
      :aria-label="tdc('Increase radius')"
      data-test="radius-increase"
      @click="$emit('update:modelValue', stepRadius(modelValue, 1))"
    >
      <s-tooltip>{{ tdc('Increase radius') }}</s-tooltip>
    </s-btn>
  </div>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { RADIUS_STEPS_KM, stepRadius } from './useMarketplace'

defineProps({
  // the radius in km (v-model)
  modelValue: { type: Number, required: true },
  // pharmacies inside it
  count: { type: Number, default: 0 },
})
defineEmits(['update:modelValue'])

const minKm = RADIUS_STEPS_KM[0]
const maxKm = RADIUS_STEPS_KM[RADIUS_STEPS_KM.length - 1]
</script>

<style scoped>
.nearby-radius {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 4px;
  border-radius: 999px;
  background: #fff;
  color: #1f2937;
  font-size: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.body--dark .nearby-radius {
  background: var(--q-dark);
  color: #fff;
}
.nearby-radius__text {
  min-width: 0;
  line-height: 1.3;
  text-align: center;
}
.nearby-radius__km {
  margin-left: 4px;
  color: #6b7280;
  white-space: nowrap;
}
</style>
