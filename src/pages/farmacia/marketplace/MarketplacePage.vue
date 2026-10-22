<template>
  <q-page class="marketplace-page">
    <s-page-title :title="tdc('Online pharmacy')" />
    <marketplace-layout signed-in />
  </q-page>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import MarketplaceLayout from './MarketplaceLayout.vue'

// the marketplace inside the app: any signed-in user, whatever Entity they
// work in (the search spans every published pharmacy)
</script>

<style scoped>
.marketplace-page {
  padding: 16px;
}
@media (max-width: 1023px) {
  .marketplace-page {
    padding: 12px;
  }
}
</style>
