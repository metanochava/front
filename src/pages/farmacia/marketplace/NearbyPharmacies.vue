<template>
  <section class="marketplace-pharmacies" data-test="nearby-pharmacies">
    <div class="row items-center q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-sm-auto">
        <div class="text-h6">{{ tdc('Nearby pharmacies') }}</div>
      </div>
      <div class="col-12 col-sm-auto q-ml-sm-auto">
        <s-btn
          flat
          icon="my_location"
          label="Use my location"
          :loading="locating"
          data-test="use-location"
          @click="locate"
        />
      </div>
    </div>

    <div v-if="positionMessage" class="text-caption text-grey q-mb-sm" data-test="location-message">
      {{ tdc(positionMessage) }}
    </div>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12">
        <s-input v-model="filters.q" label="Name or address" clearable dense @update:model-value="search" />
      </div>
      <div class="col-6 col-md-4">
        <s-input v-model="filters.city" label="City" clearable dense @update:model-value="search" />
      </div>
      <div class="col-6 col-md-4">
        <s-input v-model="filters.neighborhood" label="Neighbourhood" clearable dense @update:model-value="search" />
      </div>
      <div class="col-12 col-md-4">
        <s-input v-model="filters.country" label="Country" clearable dense @update:model-value="search" />
      </div>
    </div>

    <q-inner-loading :showing="state.loading && !state.rows.length" />

    <div v-if="state.error && !state.rows.length" class="text-negative q-pa-md" data-test="pharmacies-error">
      {{ tdc('Could not load the pharmacies.') }}
      <s-btn flat label="Try again" @click="search" />
    </div>

    <div v-else-if="state.loaded && !state.rows.length" class="text-grey q-pa-md" data-test="pharmacies-empty">
      {{ tdc('No pharmacy found for this search.') }}
    </div>

    <pharmacies-map
      v-if="showMap"
      :pharmacies="state.rows"
      :position="position"
      :selectable="selectable"
      expandable
      @select="$emit('select', $event)"
      @failed="mapFailed = true"
      @expand="expanded = true"
    />

    <!-- the same pharmacies on the whole screen -->
    <q-dialog v-model="expanded" maximized data-test="pharmacies-map-dialog">
      <s-modal-card :title="tdc('Nearby pharmacies')" icon="map" fullscreen flush @close="expanded = false">
        <pharmacies-map
          fill
          :pharmacies="state.rows"
          :position="position"
          :selectable="selectable"
          @select="selectFromMap"
          @failed="expanded = false"
        />
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
            <s-btn flat icon="search" label="Medicines at this pharmacy" @click="$emit('select', pharmacy)" />
          </q-card-actions>
        </s-card>
      </div>
    </div>

    <div v-if="state.rows.length < state.count" class="text-center q-mt-md">
      <s-btn flat label="Show more" :loading="state.loading" @click="more" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { debounce } from 'quasar'
import { tdc } from 'quasar_resaas'
import { currentPosition, hasMapsKey, mapPoints, usePharmacies } from './useMarketplace'
import PharmaciesMap from './PharmaciesMap.vue'

defineProps({
  // show "Medicines at this pharmacy" (only for signed-in users: the search needs a session)
  selectable: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'position'])

const { state, load, more } = usePharmacies()
const filters = reactive({ q: '', city: '', neighborhood: '', country: '' })
const position = ref(null)
const locating = ref(false)
const positionMessage = ref('')
const mapFailed = ref(false)
const expanded = ref(false)
const showMap = computed(() => hasMapsKey() && !mapFailed.value)
const unplaced = computed(() => state.rows.length - mapPoints(state.rows).length)

const POSITION_MESSAGES = {
  denied: 'Location was not allowed: search by city or address instead.',
  unsupported: 'This device cannot share its location: search by city or address instead.',
  unavailable: 'Your location is not available right now: search by city or address instead.',
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

function formatDistance (km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

onMounted(run)
</script>

<style scoped>
.pre-line {
  white-space: pre-line;
}
.marketplace-card {
  backdrop-filter: blur(6px);
}
</style>
