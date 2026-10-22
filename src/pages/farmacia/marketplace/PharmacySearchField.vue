<template>
  <!-- the pharmacies' one search field - its text inside (placeholder), no
       label above it - (name, address, neighbourhood, city or
       country - the backend matches every word) with "Use my location" as its
       button, coloured while the position is in use. NearbyPharmacies shows it
       on top of the map, or above the list when there is no map. -->
  <s-input
    :model-value="modelValue"
    type="search"
    placeholder="Nearby pharmacies: name or address"
    :aria-label="tdc('Nearby pharmacies: name or address')"
    clearable
    dense
    hide-bottom-space
    data-test="pharmacy-query"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #append>
      <s-btn
        flat
        round
        dense
        icon="my_location"
        :color="located ? 'primary' : 'grey-7'"
        :loading="locating"
        :aria-label="tdc('Use my location')"
        data-test="use-location"
        @click.stop="$emit('locate')"
      >
        <s-tooltip>{{ tdc('Use my location') }}</s-tooltip>
      </s-btn>
    </template>
  </s-input>
</template>

<script setup>
import { tdc } from 'quasar_resaas'

defineProps({
  modelValue: { type: String, default: '' },
  // the device position is in use
  located: { type: Boolean, default: false },
  locating: { type: Boolean, default: false },
})
defineEmits(['update:modelValue', 'locate'])
</script>
