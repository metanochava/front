<template>
  <!-- The online pharmacy's sections, used by the public site (SitePage) and by
       the page inside the app (MarketplacePage).
       - md and up: two columns, medicines (search, cart, reservations) on the
         left and the pharmacies' map on the right, which stays in view.
       - phones and small tablets: one section at a time, switched by a tab
         bar fixed right above the footer (thumb reach); a reservation in progress is one tap away
         (floating button) from any section. Sections are hidden, not
         destroyed, so a search, the cart or a route survive switching. -->
  <div
    ref="root"
    class="marketplace"
    :class="{ 'marketplace--mobile': mobile }"
    :style="mapHeight ? { '--marketplace-map-height': `${mapHeight}px` } : null"
    data-test="marketplace-layout"
  >
    <!-- fixed at the bottom, glued to the footer: q-page-sticky takes the
         layout's footer height as its offset -->
    <q-page-sticky v-if="mobile" position="bottom" expand class="marketplace__tabs-bar">
      <q-tabs
        v-model="tab"
        class="marketplace__tabs full-width"
        align="justify"
        active-color="primary"
        indicator-color="primary"
        switch-indicator
        no-caps
        dense
        data-test="marketplace-tabs"
      >
        <q-tab name="medicines" icon="medication" :label="tdc('Medicines')" data-test="tab-medicines" />
        <q-tab name="pharmacies" icon="map" :label="tdc('Pharmacies')" data-test="tab-pharmacies" />
        <q-tab v-if="signedIn" name="reservations" icon="shopping_bag" :label="tdc('Reservations')" data-test="tab-reservations">
          <q-badge v-if="cartCount" color="negative" floating rounded data-test="tab-cart-count">{{ cartCount }}</q-badge>
        </q-tab>
      </q-tabs>
    </q-page-sticky>

    <!-- phones show one column at a time: no gutter between columns -->
    <div class="row" :class="{ 'q-col-gutter-lg': !mobile }">
      <div v-show="!mobile || tab !== 'pharmacies'" class="col-12 col-md-7" data-test="marketplace-medicines">
        <template v-if="signedIn">
          <medicine-search
            v-show="!mobile || tab === 'medicines'"
            class="q-mb-lg"
            reservable
            :position="position"
            :pharmacy="pharmacy"
            @clear-pharmacy="pharmacy = null"
          />
          <div v-show="!mobile || tab === 'reservations'">
            <reservation-cart @placed="orders?.reload()" />
            <my-orders ref="orders" class="q-mb-xl" />
          </div>
        </template>
        <slot v-else name="signed-out" />
      </div>

      <div v-show="!mobile || tab === 'pharmacies'" class="col-12 col-md-5 marketplace__map-column" data-test="marketplace-pharmacies">
        <nearby-pharmacies
          ref="nearby"
          :selectable="signedIn"
          @position="position = $event"
          @select="choosePharmacy"
        />
      </div>
    </div>

    <!-- phones: the reservation in progress, reachable from the other sections -->
    <q-page-sticky v-if="mobile && signedIn && cartCount && tab !== 'reservations'" position="bottom" :offset="[0, TABS_HEIGHT + 12]">
      <s-btn
        rounded
        unelevated
        color="primary"
        icon="shopping_bag"
        class="marketplace__cart-fab"
        data-test="cart-fab"
        @click="tab = 'reservations'"
      >
        <span class="q-ml-sm">{{ tdc('View reservation') }}</span>
        <q-badge color="white" text-color="primary" rounded class="q-ml-sm">{{ cartCount }}</q-badge>
        <s-tooltip>{{ tdc('View reservation') }}</s-tooltip>
      </s-btn>
    </q-page-sticky>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { tdc } from 'quasar_resaas'
import { useCart } from './useMarketplace'
import NearbyPharmacies from './NearbyPharmacies.vue'
import MedicineSearch from './MedicineSearch.vue'
import MyOrders from './MyOrders.vue'
import ReservationCart from './ReservationCart.vue'

const props = defineProps({
  // the medicine search, the cart and the reservations need a session
  signedIn: { type: Boolean, default: false },
})

const $q = useQuasar()
const mobile = computed(() => $q.screen.lt.md)
const tab = ref(props.signedIn ? 'medicines' : 'pharmacies')
const position = ref(null)
const pharmacy = ref(null)
const orders = ref(null)
const nearby = ref(null)
const root = ref(null)
// the bottom tab bar's height (see .q-tab min-height); the floating
// reservation button sits above it
const TABS_HEIGHT = 56
// the app header's height (AuthLayout or MainLayout): where a section starts
const headerOffset = ref(0)
onMounted(() => {
  headerOffset.value = document.querySelector('.q-layout .q-header')?.offsetHeight || 0
})

const { cart } = useCart()
const cartCount = computed(() => cart.lines.reduce((total, line) => total + Number(line.quantity || 0), 0))

// "Medicines at this pharmacy" on the map: search there
function choosePharmacy (chosen) {
  pharmacy.value = chosen
  tab.value = 'medicines'
}

// phones: the map fills the screen from where it starts down to the tab bar
// (the site's hero, the nearby count... move its top), at least 240px (a
// very short screen scrolls instead)
const MAP_MIN_HEIGHT = 240
const mapHeight = ref(0)
function fitMapHeight () {
  const map = root.value?.querySelector('[data-test=pharmacies-map]:not(.pharmacies-map--fill)')
  if (!mobile.value || tab.value !== 'pharmacies' || !map || !map.offsetParent) return
  const top = map.getBoundingClientRect().top + window.scrollY
  const footer = document.querySelector('.q-layout .q-footer')?.offsetHeight || 0
  const height = Math.max(MAP_MIN_HEIGHT, Math.floor(window.innerHeight - top - footer - TABS_HEIGHT))
  if (Math.abs(height - mapHeight.value) > 1) {
    mapHeight.value = height
    nextTick(() => nearby.value?.refreshMap()) // frame the pharmacies at the new size
  }
}
// what is above the map changes its top: follow the column's size
let resizeObserver = null
onMounted(() => {
  window.addEventListener('resize', fitMapHeight)
  const column = root.value?.querySelector('[data-test=marketplace-pharmacies]')
  if (column && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => fitMapHeight())
    resizeObserver.observe(column)
  }
  setTimeout(fitMapHeight, 300)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', fitMapHeight)
  resizeObserver?.disconnect()
})

// back on the map (hidden while another section was shown): fit it to its size again
watch(tab, async (name) => {
  if (name !== 'pharmacies') return
  await nextTick()
  fitMapHeight()
  nearby.value?.refreshMap()
})
// the chosen section starts under the tabs (not halfway down the previous one)
watch(tab, () => {
  const top = (root.value?.getBoundingClientRect().top || 0) + window.scrollY - headerOffset.value
  if (window.scrollY > top) window.scrollTo({ top })
})
</script>

<style scoped>
.marketplace--mobile {
  padding-bottom: 136px; /* room for the tab bar and the floating reservation button */
}
.marketplace__tabs-bar {
  z-index: 3000; /* over the page's scroll-to-top button */
}
.marketplace__tabs :deep(.q-tab) {
  min-height: 56px; /* TABS_HEIGHT - icon above the label: three sections fit a 360px phone */
  padding: 0 4px;
}
.marketplace__tabs {
  background: var(--marketplace-surface, #fff);
  border-top: 1px solid rgba(127, 127, 127, 0.2);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
.body--dark .marketplace__tabs {
  background: var(--q-dark);
}
.marketplace__cart-fab {
  min-height: 48px;
  padding: 0 20px;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--q-primary) 40%, transparent);
}

/* phones: the map goes edge to edge, over the page's 12px side padding
   (SitePage, MarketplacePage) - no border or rounded corners there */
.marketplace--mobile :deep(.pharmacies-map:not(.pharmacies-map--fill)) {
  margin-left: -12px;
  margin-right: -12px;
  border-radius: 0;
  border-left: 0;
  border-right: 0;
}

/* phones: 16px text in fields (smaller makes iOS zoom in on focus) and
   buttons big enough for a thumb */
.marketplace--mobile :deep(.q-field__native),
.marketplace--mobile :deep(.q-field__input) {
  font-size: 16px;
}

/* md and up: the map column stays in view while the medicines scroll (same
   offset as quasar_resaas UserAccountPage's sticky nav) */
@media (min-width: 1024px) {
  .marketplace__map-column {
    position: sticky;
    top: 72px;
    align-self: flex-start;
    max-height: calc(100vh - 140px); /* header offset + the site's fixed footer */
    overflow-y: auto;
  }
}
</style>
