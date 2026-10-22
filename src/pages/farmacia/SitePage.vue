<template>
  <!-- the site at '/' of the Farmacia EntityType (src/pages/index.js): the
       online pharmacy - nearby pharmacies for everyone, the medicine search
       once signed in. The page around it (q-page, header, footer) is
       quasar_resaas' EntityTypeSitePage. -->
  <div class="farmacia-site q-pa-md" data-test="farmacia-site">
    <!-- the presentation: on large screens (md and up) always; on phones only
         for visitors (signed in, the phone goes straight to the sections).
         Sign in/out lives in the header's user menu -->
    <div v-if="!signedIn || $q.screen.gt.sm" class="farmacia-site__hero q-mb-lg rounded-borders" data-test="site-hero">
      <div class="text-overline text-primary">{{ tdc('Online pharmacy') }}</div>
      <div class="farmacia-site__title text-weight-bold q-mb-sm">{{ tdc('Find your medicine at the nearest pharmacy') }}</div>
      <div class="farmacia-site__lead">
        {{ tdc('Compare prices and stock of the registered pharmacies, reserve online and pay when you collect.') }}
      </div>
    </div>

    <marketplace-layout :signed-in="signedIn">
      <template #signed-out>
        <div class="farmacia-site__locked q-pa-md q-mb-lg rounded-borders" data-test="search-needs-login">
          <q-icon name="lock" class="q-mr-xs" />{{ tdc('Sign in to search medicines and compare prices.') }}
          <div class="q-mt-sm">
            <s-btn color="primary" icon="login" label="Sign In" :to="{ name: 'login' }">
              <s-tooltip>{{ tdc('Sign In') }}</s-tooltip>
            </s-btn>
          </div>
        </div>
      </template>
    </marketplace-layout>
  </div>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import MarketplaceLayout from './marketplace/MarketplaceLayout.vue'

defineProps({
  entityType: { type: Object, default: null },
  entityTypes: { type: Array, default: () => [] },
  signedIn: { type: Boolean, default: false },
  hasEntity: { type: Boolean, default: false },
})
defineEmits(['logout'])
</script>

<style scoped>
.farmacia-site {
  max-width: 1440px;
  margin: 0 auto;
}
/* the Theme's primary, lightly: works in light and dark */
.farmacia-site__hero {
  padding: 24px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--q-primary) 14%, transparent), transparent 70%);
  border: 1px solid rgba(127, 127, 127, 0.2);
}
.farmacia-site__title {
  font-size: 2.125rem;
  line-height: 1.2;
}
.farmacia-site__lead {
  font-size: 1rem;
}
.farmacia-site__locked {
  border: 1px dashed rgba(127, 127, 127, 0.4);
}
/* phones: a short header so the map and the search start above the fold */
@media (max-width: 1023px) {
  .farmacia-site {
    padding: 12px;
  }
  .farmacia-site__hero {
    padding: 16px;
    margin-bottom: 12px;
  }
  .farmacia-site__title {
    font-size: 1.375rem;
  }
  .farmacia-site__lead {
    font-size: 0.875rem;
  }
}
</style>
