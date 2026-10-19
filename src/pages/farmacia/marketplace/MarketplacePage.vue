<template>
  <q-page class="q-pa-md">
    <s-page-title :title="tdc('Online pharmacy')" />
    <!-- two columns from md up: medicines on the left, pharmacies' map on the right -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-7" data-test="marketplace-medicines">
        <medicine-search class="q-mb-lg" reservable :position="position" :pharmacy="pharmacy" @clear-pharmacy="pharmacy = null" />
        <reservation-cart @placed="orders?.reload()" />
        <my-orders ref="orders" class="q-mb-xl" />
      </div>
      <div class="col-12 col-md-5 farmacia-sticky" data-test="marketplace-pharmacies">
        <nearby-pharmacies selectable @position="position = $event" @select="pharmacy = $event" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { tdc } from 'quasar_resaas'
import NearbyPharmacies from './NearbyPharmacies.vue'
import MedicineSearch from './MedicineSearch.vue'
import MyOrders from './MyOrders.vue'
import ReservationCart from './ReservationCart.vue'

// the marketplace inside the app: any signed-in user, whatever Entity they
// work in (the search spans every published pharmacy)
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
</style>
