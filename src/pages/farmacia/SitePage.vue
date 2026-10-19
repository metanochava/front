<template>
  <!-- the site at '/' of the Farmacia EntityType (src/pages/index.js): the
       online pharmacy - nearby pharmacies for everyone, the medicine search
       once signed in. The page around it (q-page, header, footer) is
       quasar_resaas' EntityTypeSitePage. -->
  <div class="farmacia-site q-pa-md" data-test="farmacia-site">
    <div class="farmacia-site__hero q-pa-lg q-mb-lg rounded-borders">
      <div class="text-overline text-primary">{{ tdc('Online pharmacy') }}</div>
      <div class="text-h4 text-weight-bold q-mb-sm">{{ tdc('Find your medicine at the nearest pharmacy') }}</div>
      <div class="text-body1 q-mb-md">
        {{ tdc('Compare prices and stock of the registered pharmacies, reserve online and pay when you collect.') }}
      </div>
      <div class="row q-gutter-sm">
        <s-btn v-if="hasEntity" color="primary" icon="dashboard" label="Open dashboard" :to="{ name: 'dashboard' }" />
        <template v-else-if="!signedIn">
          <s-btn color="primary" icon="login" label="Sign In" :to="{ name: 'login' }" data-test="site-login" />
          <s-btn flat icon="person_add" label="Create Account" :to="{ name: 'registarUser' }" />
        </template>
        <s-btn v-else flat icon="logout" label="Sign out" @click="$emit('logout')" />
      </div>
    </div>

    <!-- two columns from md up: medicines on the left, pharmacies' map on the right -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7" data-test="site-medicines">
        <template v-if="signedIn">
          <medicine-search
            class="q-mb-lg"
            reservable
            :position="position"
            :pharmacy="pharmacy"
            @clear-pharmacy="pharmacy = null"
          />
          <reservation-cart @placed="orders?.reload()" />
          <my-orders ref="orders" class="q-mb-xl" />
        </template>
        <div v-else class="text-body2 q-mb-lg" data-test="search-needs-login">
          <q-icon name="lock" class="q-mr-xs" />{{ tdc('Sign in to search medicines and compare prices.') }}
        </div>
      </div>
      <div class="col-12 col-md-5 farmacia-sticky" data-test="site-pharmacies">
        <nearby-pharmacies :selectable="signedIn" @position="position = $event" @select="pharmacy = $event" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { tdc } from 'quasar_resaas'
import NearbyPharmacies from './marketplace/NearbyPharmacies.vue'
import MedicineSearch from './marketplace/MedicineSearch.vue'
import MyOrders from './marketplace/MyOrders.vue'
import ReservationCart from './marketplace/ReservationCart.vue'

defineProps({
  entityType: { type: Object, default: null },
  entityTypes: { type: Array, default: () => [] },
  signedIn: { type: Boolean, default: false },
  hasEntity: { type: Boolean, default: false },
})
defineEmits(['logout'])

const position = ref(null)
const pharmacy = ref(null)
const orders = ref(null)
</script>

<style scoped>
/* the pharmacies' column (map) stays in view while the medicines scroll
   (md and up; same offset as quasar_resaas UserAccountPage's sticky nav) */
@media (min-width: 1024px) {
  .farmacia-sticky {
    position: sticky;
    top: 72px;
    align-self: flex-start;
    max-height: calc(100vh - 88px);
    overflow-y: auto;
  }
}

.farmacia-site {
  max-width: 1440px;
  margin: 0 auto;
}
/* the Theme's primary, lightly: works in light and dark */
.farmacia-site__hero {
  background: linear-gradient(135deg, color-mix(in srgb, var(--q-primary) 14%, transparent), transparent 70%);
  border: 1px solid rgba(127, 127, 127, 0.2);
}
</style>
