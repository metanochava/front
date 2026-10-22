<template>
  <section class="marketplace-pharmacies" data-test="nearby-pharmacies">
    <!-- no map (no key, or it failed): the field above the list -->
    <template v-if="!showMap">
      <pharmacy-search-field
        v-model="filters.q"
        class="q-mb-sm"
        :located="Boolean(position)"
        :locating="locating"
        @update:model-value="search"
        @locate="locate"
      />
    </template>

    <div v-if="positionMessage" class="text-caption text-grey q-mb-sm" data-test="location-message">
      {{ tdc(positionMessage) }}
    </div>

    <q-inner-loading :showing="state.loading && !state.rows.length" />

    <div v-if="state.error && !state.rows.length" class="text-negative q-pa-md" data-test="pharmacies-error">
      {{ tdc('Could not load the pharmacies.') }}
      <s-btn flat label="Try again" @click="search">
        <s-tooltip>{{ tdc('Try again') }}</s-tooltip>
      </s-btn>
    </div>

    <div v-else-if="state.loaded && !state.rows.length" class="text-grey q-pa-md" data-test="pharmacies-empty">
      {{ tdc('No pharmacy found for this search.') }}
    </div>

    <pharmacies-map
      v-if="showMap"
      ref="map"
      :pharmacies="state.rows"
      :position="position"
      :selectable="selectable"
      :route="route"
      :radius-km="radiusKm"
      expandable
      @select="$emit('select', $event)"
      @failed="mapFailed = true"
      @expand="expanded = true"
    >
      <!-- on top of the map, centred: the field (its text names the section) -->
      <template #top>
        <pharmacy-search-field
          v-model="filters.q"
          :located="Boolean(position)"
          :locating="locating"
          @update:model-value="search"
          @locate="locate"
        />
      </template>
      <!-- at the bottom of the map: the pharmacies inside the radius, - / + -->
      <template v-if="position" #bottom>
        <nearby-radius v-model="radiusKm" :count="nearbyCount" />
      </template>
    </pharmacies-map>

    <!-- the same pharmacies on the whole screen -->
    <q-dialog v-model="expanded" maximized data-test="pharmacies-map-dialog">
      <s-modal-card :title="tdc('Nearby pharmacies')" icon="map" fullscreen flush @close="expanded = false">
        <pharmacies-map
          fill
          :pharmacies="state.rows"
          :position="position"
          :selectable="selectable"
          :route="route"
          :radius-km="radiusKm"
          @select="selectFromMap"
          @failed="expanded = false"
        >
          <template #top>
            <pharmacy-search-field
              v-model="filters.q"
              :located="Boolean(position)"
              :locating="locating"
              @update:model-value="search"
              @locate="locate"
            />
          </template>
          <template v-if="position" #bottom>
            <nearby-radius v-model="radiusKm" :count="nearbyCount" />
          </template>
        </pharmacies-map>
      </s-modal-card>
    </q-dialog>

    <div v-if="showMap && unplaced" class="text-caption text-grey q-mb-sm" data-test="pharmacies-unplaced">
      {{ tdc('Pharmacies without a location are not shown on the map:') }} {{ unplaced }}
    </div>

    <!-- the list only when the map cannot be shown (no key, script failed) -->
    <div v-if="!showMap" class="row q-col-gutter-md">
      <div v-for="pharmacy in state.rows" :key="pharmacy.id" class="col-12 col-sm-6">
        <s-card flat bordered class="full-height marketplace-card" data-test="pharmacy-card">
          <q-card-section>
            <div class="row items-start no-wrap">
              <q-icon name="local_pharmacy" color="primary" size="sm" class="q-mr-sm q-mt-xs" />
              <div class="col">
                <div class="text-subtitle1 text-weight-medium">{{ pharmacy.name }}</div>
                <div class="text-caption text-grey">{{ pharmacy.organisation }}</div>
              </div>
              <q-badge v-if="pharmacy.distance_km !== null" color="primary" outline data-test="pharmacy-distance">
                {{ formatDistance(pharmacy.distance_km) }}
              </q-badge>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none text-body2">
            <div v-if="pharmacy.address"><q-icon name="place" size="xs" class="q-mr-xs" />{{ pharmacy.address }}</div>
            <div v-else class="text-grey">{{ tdc('Address not provided') }}</div>
            <div v-if="pharmacy.phone"><q-icon name="call" size="xs" class="q-mr-xs" />{{ pharmacy.phone }}</div>
            <div v-if="pharmacy.opening_hours" class="pre-line">
              <q-icon name="schedule" size="xs" class="q-mr-xs" />{{ pharmacy.opening_hours }}
            </div>
            <div v-else class="text-grey">{{ tdc('Opening hours not provided') }}</div>
          </q-card-section>
          <q-card-actions v-if="selectable" align="right">
            <s-btn flat icon="search" label="Medicines at this pharmacy" @click="$emit('select', pharmacy)">
              <s-tooltip>{{ tdc('Medicines at this pharmacy') }}</s-tooltip>
            </s-btn>
          </q-card-actions>
        </s-card>
      </div>
    </div>

    <div v-if="state.rows.length < state.count" class="text-center q-mt-md">
      <s-btn flat label="Show more" :loading="state.loading" @click="more">
        <s-tooltip>{{ tdc('Show more') }}</s-tooltip>
      </s-btn>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { debounce } from 'quasar'
import { tdc } from 'quasar_resaas'
import { NEARBY_RADIUS_KM, currentPosition, hasMapsKey, isNearby, mapPoints, useMapRoute, usePharmacies } from './useMarketplace'
import PharmaciesMap from './PharmaciesMap.vue'
import PharmacySearchField from './PharmacySearchField.vue'
import NearbyRadius from './NearbyRadius.vue'

defineProps({
  // show "Medicines at this pharmacy" (only for signed-in users: the search needs a session)
  selectable: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'position'])

const { state, load, more } = usePharmacies()
const filters = reactive({ q: '' })
const position = ref(null)
const locating = ref(false)
const positionMessage = ref('')
const mapFailed = ref(false)
const expanded = ref(false)
const map = ref(null)
// one route for the page's map and the full-screen map (kept when the full screen opens or closes)
const route = useMapRoute()
const showMap = computed(() => hasMapsKey() && !mapFailed.value)
const unplaced = computed(() => state.rows.length - mapPoints(state.rows).length)
// the "near you" radius, changed with - / + on the map (both maps share it)
const radiusKm = ref(NEARBY_RADIUS_KM)
const nearbyCount = computed(() => state.rows.filter((pharmacy) => isNearby(pharmacy, radiusKm.value)).length)

const POSITION_MESSAGES = {
  denied: 'Location was not allowed: search by name or address instead.',
  unsupported: 'This device cannot share its location: search by name or address instead.',
  unavailable: 'Your location is not available right now: search by name or address instead.',
}

function run () {
  load({ ...filters, ...(position.value || {}) })
}
const search = debounce(run, 350)

async function locate () {
  locating.value = true
  positionMessage.value = ''
  try {
    position.value = await currentPosition()
    emit('position', position.value)
    run()
  } catch (error) {
    positionMessage.value = POSITION_MESSAGES[error.message] || POSITION_MESSAGES.unavailable
  } finally {
    locating.value = false
  }
}

// choosing a pharmacy on the full-screen map goes back to the page's search
function selectFromMap (pharmacy) {
  expanded.value = false
  emit('select', pharmacy)
}

// the page shows the map again after hiding it (phone tabs): fit it to its size
defineExpose({ refreshMap: () => map.value?.refresh() })

function formatDistance (km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

// the list at once, then the device position by default (the browser asks
// the first time); a refused or unavailable position leaves the list as it
// is, with the usual message, and the button tries again
onMounted(() => {
  run()
  locate()
})
</script>

<style scoped>
.pre-line {
  white-space: pre-line;
}
.marketplace-card {
  backdrop-filter: blur(6px);
}
/* phones: the map is the section's main content */
@media (max-width: 1023px) {
  /* MarketplaceLayout sets --marketplace-map-height so the map ends where
     the tab bar starts; 62vh without it */
  .marketplace-pharmacies :deep(.pharmacies-map:not(.pharmacies-map--fill)) {
    height: var(--marketplace-map-height, 62vh);
    max-height: none;
  }
}
</style>
