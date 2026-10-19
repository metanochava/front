<template>
  <section class="marketplace-search" data-test="medicine-search">
    <div class="text-h6 q-mb-sm">{{ tdc('Find a medicine') }}</div>

    <!-- the query on its own line, the four filters aligned below it (In stock first) -->
    <div class="row q-col-gutter-sm items-center">
      <div class="col-12">
        <s-input
          v-model="filters.q"
          label="Medicine, active substance, brand or strength"
          clearable
          dense
          data-test="medicine-query"
          @update:model-value="search"
        />
      </div>
      <div class="col-6 col-lg-3">
        <div class="marketplace-search__toggle">
          <s-toggle v-model="filters.available" label="In stock" @update:model-value="search" />
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <s-input v-model="filters.min_price" type="number" label="Minimum price" dense clearable @update:model-value="search" />
      </div>
      <div class="col-6 col-lg-3">
        <s-input v-model="filters.max_price" type="number" label="Maximum price" dense clearable @update:model-value="search" />
      </div>
      <div class="col-6 col-lg-3">
        <s-select v-model="filters.sort" :options="sortOptions" label="Sort by" dense emit-value map-options @update:model-value="search" />
      </div>
    </div>

    <div v-if="pharmacy" class="q-mt-sm">
      <q-chip removable color="primary" text-color="white" icon="local_pharmacy" @remove="$emit('clear-pharmacy')">
        {{ pharmacy.name }}
      </q-chip>
    </div>

    <div v-if="hint" class="text-caption text-grey q-mt-sm">{{ tdc(hint) }}</div>

    <q-inner-loading :showing="state.loading && !state.rows.length" />

    <div v-if="state.error && !state.rows.length" class="text-negative q-pa-md" data-test="search-error">
      {{ state.error.code === 'search_too_broad' ? tdc('Too many results: add more words or choose a pharmacy.') : tdc('The search could not be completed.') }}
    </div>
    <div v-else-if="state.loaded && !state.rows.length" class="text-grey q-pa-md" data-test="search-empty">
      {{ tdc('No pharmacy has this medicine for these filters.') }}
    </div>

    <q-list v-if="state.rows.length" separator bordered class="rounded-borders q-mt-md">
      <q-item v-for="row in state.rows" :key="row.offer_id" data-test="offer-row">
        <q-item-section avatar top>
          <q-avatar
            v-if="medicineMedia(row.medicine).length"
            rounded
            size="56px"
            class="cursor-pointer"
            :color="medicineThumbnail(row.medicine) ? undefined : 'grey-3'"
            :text-color="medicineThumbnail(row.medicine) ? undefined : 'primary'"
            :icon="medicineThumbnail(row.medicine) ? undefined : 'play_circle'"
            data-test="offer-photo"
            @click="showMedia(row.medicine)"
          >
            <img v-if="medicineThumbnail(row.medicine)" :src="medicineThumbnail(row.medicine)" :alt="row.medicine.name">
            <q-tooltip>{{ tdc('Photos and videos') }}</q-tooltip>
          </q-avatar>
          <q-avatar v-else rounded size="56px" color="grey-3" text-color="grey-7" icon="medication" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ row.medicine.name }} {{ row.medicine.strength }}
            <q-badge v-if="row.medicine.prescription_required" color="warning" text-color="dark" class="q-ml-xs">
              {{ tdc('Prescription required') }}
            </q-badge>
          </q-item-label>
          <q-item-label caption>
            {{ row.medicine.active_substance }} · {{ row.medicine.dosage_form }} · {{ row.medicine.presentation }}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="local_pharmacy" size="xs" /> {{ row.pharmacy.name }}
            <span v-if="row.pharmacy.distance_km !== null"> · {{ formatDistance(row.pharmacy.distance_km) }}</span>
            <span v-if="row.pharmacy.address"> · {{ row.pharmacy.address }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side top class="text-right">
          <q-item-label class="text-h6 text-primary" data-test="offer-price">{{ formatPrice(row) }}</q-item-label>
          <q-item-label>
            <q-badge :color="row.available ? 'positive' : 'grey'" data-test="offer-availability">
              {{ row.available ? tdc('Available') : tdc('Out of stock') }}
              <span v-if="row.available && row.available_quantity !== null">&nbsp;({{ row.available_quantity }})</span>
            </q-badge>
          </q-item-label>
          <q-item-label caption>{{ row.online_sale ? tdc('Reserve online, pay at the pharmacy') : tdc('In-store only') }}</q-item-label>
          <q-item-label v-if="reservable && row.online_sale && row.available">
            <s-btn dense flat color="primary" icon="add_shopping_cart" label="Reserve" data-test="offer-reserve" @click="cartAdd(row)" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="state.rows.length < state.count" class="text-center q-mt-md">
      <s-btn flat label="Show more" :loading="state.loading" @click="more" />
    </div>

    <medicine-media-viewer v-model="viewer.open" :medicine="viewer.medicine" />
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { debounce } from 'quasar'
import { tdc } from 'quasar_resaas'
import { formatMoney, medicineMedia, medicineThumbnail, useCart, useMedicineSearch } from './useMarketplace'
import MedicineMediaViewer from './MedicineMediaViewer.vue'

const props = defineProps({
  // {lat, lng} of the device, when the user shared it
  position: { type: Object, default: null },
  // a pharmacy chosen in the list: search only there
  pharmacy: { type: Object, default: null },
  // show "Reserve" on offers that can be reserved online
  reservable: { type: Boolean, default: false },
})
const { add: cartAdd } = useCart()
const viewer = reactive({ open: false, medicine: null })

function showMedia (medicine) {
  viewer.medicine = medicine
  viewer.open = true
}
defineEmits(['clear-pharmacy'])

const { state, load, more } = useMedicineSearch()
const filters = reactive({ q: '', min_price: '', max_price: '', sort: 'price', available: false })

const sortOptions = computed(() => [
  { label: tdc('Lowest price'), value: 'price' },
  ...(props.position ? [{ label: tdc('Nearest'), value: 'distance' }] : []),
])

// the backend asks for a word, a medicine or a pharmacy
const ready = computed(() => (filters.q || '').trim().length >= 2 || Boolean(props.pharmacy))
const hint = computed(() => (ready.value ? '' : 'Type at least two letters of a medicine.'))

function run () {
  if (!ready.value) {
    state.rows = []
    state.loaded = false
    return
  }
  load({
    q: filters.q,
    min_price: filters.min_price,
    max_price: filters.max_price,
    sort: filters.sort === 'distance' && !props.position ? 'price' : filters.sort,
    available: filters.available ? '1' : '',
    pharmacy: props.pharmacy?.id,
    ...(props.position || {}),
  })
}
const search = debounce(run, 400)

watch(() => [props.position, props.pharmacy], run)

function formatDistance (km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

function formatPrice (row) {
  return formatMoney(row.price, row.currency)
}
</script>

<style scoped>
/* same height as the dense fields beside it, so the row lines up */
.marketplace-search__toggle {
  display: flex;
  align-items: center;
  min-height: 40px;
}
</style>
