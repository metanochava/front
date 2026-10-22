<template>
  <section class="marketplace-search" data-test="medicine-search">
    <!-- phones: the "Medicines" tab already names the section -->
    <div v-if="!mobile" class="text-h6 q-mb-sm">{{ tdc('Find a medicine') }}</div>

    <!-- large screens: the query with "In stock" on its line, the order and the
         price range below. Phones: only the query; In stock, the order and the
         price range are in a menu opened from the button inside the field -->
    <!-- phones: the field stays in place (sticky under the app header) while
         the results scroll -->
    <div
      class="row no-wrap items-start"
      :class="mobile ? 'marketplace-search__bar' : 'q-col-gutter-sm'"
      :style="mobile ? { top: `${headerOffset + STUCK_GAP}px` } : null"
    >
      <div ref="queryBox" class="col">
        <s-input
          v-model="filters.q"
          type="search"
          label="Medicine, active substance, brand or strength"
          clearable
          dense
          :hint="mobile ? undefined : hint"
          :hide-bottom-space="mobile"
          data-test="medicine-query"
          @update:model-value="search"
        >
          <template v-if="mobile" #append>
            <s-btn
              flat
              round
              dense
              icon="tune"
              :color="activeFilters ? 'primary' : 'grey-7'"
              :aria-label="tdc('Filters')"
              data-test="medicine-filters"
              @click.stop="filtersOpen = !filtersOpen"
            >
              <q-badge v-if="activeFilters" color="primary" floating rounded>{{ activeFilters }}</q-badge>
              <s-tooltip>{{ tdc('Filters') }}</s-tooltip>
              <!-- centred under the whole field and as wide as it (not under the button) -->
              <q-menu
                v-model="filtersOpen"
                :target="queryBox"
                no-parent-event
                fit
                anchor="bottom middle"
                self="top middle"
                :offset="[0, 8]"
                class="marketplace-search__menu"
              >
                <div class="marketplace-search__filters q-pa-md column q-gutter-y-sm" data-test="medicine-filters-menu">
                  <s-toggle dense v-model="filters.available" label="In stock" @update:model-value="search" />
                  <s-select v-model="filters.sort" :options="sortOptions" label="Sort by" dense emit-value map-options @update:model-value="search" />
                  <div class="row no-wrap q-gutter-x-sm">
                    <s-input v-model="filters.min_price" class="col" type="number" inputmode="decimal" label="Minimum price" dense clearable @update:model-value="search" />
                    <s-input v-model="filters.max_price" class="col" type="number" inputmode="decimal" label="Maximum price" dense clearable @update:model-value="search" />
                  </div>
                </div>
              </q-menu>
            </s-btn>
          </template>
        </s-input>
      </div>
      <div v-if="!mobile" class="col-auto">
        <div class="marketplace-search__toggle">
          <s-toggle dense v-model="filters.available" label="In stock" data-test="in-stock" @update:model-value="search" />
        </div>
      </div>
    </div>
    <div v-if="!mobile" class="row q-col-gutter-x-sm q-col-gutter-y-xs items-center q-mt-xs">
      <div class="col-md-4">
        <s-select v-model="filters.sort" :options="sortOptions" label="Sort by" dense emit-value map-options @update:model-value="search" />
      </div>
      <div class="col-md-4">
        <s-input v-model="filters.min_price" type="number" inputmode="decimal" label="Minimum price" dense clearable @update:model-value="search" />
      </div>
      <div class="col-md-4">
        <s-input v-model="filters.max_price" type="number" inputmode="decimal" label="Maximum price" dense clearable @update:model-value="search" />
      </div>
    </div>

    <div v-if="pharmacy" class="q-mt-sm">
      <q-chip removable color="primary" text-color="white" icon="local_pharmacy" @remove="$emit('clear-pharmacy')">
        {{ pharmacy.name }}
      </q-chip>
    </div>


    <q-inner-loading :showing="state.loading && !state.rows.length" />

    <div v-if="state.error && !state.rows.length" class="text-negative q-pa-md" data-test="search-error">
      {{ state.error.code === 'search_too_broad' ? tdc('Too many results: add more words or choose a pharmacy.') : tdc('The search could not be completed.') }}
    </div>
    <div v-else-if="state.loaded && !state.rows.length" class="text-grey q-pa-md" data-test="search-empty">
      {{ tdc('No pharmacy has this medicine for these filters.') }}
    </div>

    <!-- one card per offer: photo, medicine and pharmacy; price, stock and
         "Reserve" beside it, or below it on phones -->
    <div v-if="state.rows.length" class="offer-list q-mt-md">
      <s-card v-for="row in state.rows" :key="row.offer_id" flat bordered class="offer" data-test="offer-row">
        <div class="offer__photo">
          <q-avatar
            v-if="medicineMedia(row.medicine).length"
            rounded
            size="64px"
            class="cursor-pointer"
            :color="medicineThumbnail(row.medicine) ? undefined : 'grey-3'"
            :text-color="medicineThumbnail(row.medicine) ? undefined : 'primary'"
            :icon="medicineThumbnail(row.medicine) ? undefined : 'play_circle'"
            role="button"
            :aria-label="tdc('Photos and videos')"
            data-test="offer-photo"
            @click="showMedia(row.medicine)"
          >
            <img v-if="medicineThumbnail(row.medicine)" :src="medicineThumbnail(row.medicine)" :alt="row.medicine.name">
            <q-tooltip>{{ tdc('Photos and videos') }}</q-tooltip>
          </q-avatar>
          <q-avatar v-else rounded size="64px" color="grey-3" text-color="grey-7" icon="medication" />
        </div>

        <div class="offer__info">
          <div class="text-weight-bold offer__name">{{ row.medicine.name }} {{ row.medicine.strength }}</div>
          <div class="text-caption text-grey-7">
            {{ row.medicine.active_substance }} · {{ row.medicine.dosage_form }} · {{ row.medicine.presentation }}
          </div>
          <q-badge v-if="row.medicine.prescription_required" color="warning" text-color="dark" class="q-mt-xs">
            {{ tdc('Prescription required') }}
          </q-badge>
          <div class="text-caption q-mt-xs offer__pharmacy">
            <q-icon name="local_pharmacy" size="16px" color="primary" />
            <span class="text-weight-medium">{{ row.pharmacy.name }}</span>
            <span v-if="row.pharmacy.distance_km !== null" class="text-grey-7"> · {{ formatDistance(row.pharmacy.distance_km) }}</span>
          </div>
          <div v-if="row.pharmacy.address" class="text-caption text-grey-7 ellipsis">{{ row.pharmacy.address }}</div>
        </div>

        <div class="offer__buy">
          <div class="offer__price text-primary" data-test="offer-price">{{ formatPrice(row) }}</div>
          <q-badge :color="row.available ? 'positive' : 'grey'" data-test="offer-availability">
            {{ row.available ? tdc('Available') : tdc('Out of stock') }}
            <span v-if="row.available && row.available_quantity !== null">&nbsp;({{ row.available_quantity }})</span>
          </q-badge>
          <div class="text-caption text-grey-7 offer__mode">
            {{ row.online_sale ? tdc('Reserve online, pay at the pharmacy') : tdc('In-store only') }}
          </div>
          <s-btn
            v-if="reservable && row.online_sale && row.available"
            unelevated
            color="primary"
            icon="add_shopping_cart"
            label="Reserve"
            class="offer__reserve"
            data-test="offer-reserve"
            @click="reserve(row)">
            <s-tooltip>{{ tdc('Reserve') }}</s-tooltip>
          </s-btn>
        </div>
      </s-card>
    </div>

    <div v-if="state.rows.length < state.count" class="text-center q-mt-md">
      <s-btn flat label="Show more" :loading="state.loading" @click="more">
        <s-tooltip>{{ tdc('Show more') }}</s-tooltip>
      </s-btn>
    </div>

    <medicine-media-viewer v-model="viewer.open" :medicine="viewer.medicine" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { debounce, useQuasar } from 'quasar'
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
const $q = useQuasar()
// phones (below md) get the compact search: filters in the field's menu
const mobile = computed(() => $q.screen.lt.md)
const filtersOpen = ref(false)
const queryBox = ref(null)
// the app header's height (AuthLayout or MainLayout): where the sticky field
// stops, sm (8px) below it while the page scrolls
const headerOffset = ref(0)
const STUCK_GAP = 8
onMounted(() => {
  headerOffset.value = document.querySelector('.q-layout .q-header')?.offsetHeight || 0
})
// filters away from their defaults (the badge on the phone's filter button)
const activeFilters = computed(() => [
  filters.available,
  filters.sort !== 'price',
  filters.min_price !== '' && filters.min_price !== null,
  filters.max_price !== '' && filters.max_price !== null,
].filter(Boolean).length)

// a short confirmation: on phones the cart is in another section
function reserve (row) {
  cartAdd(row)
  $q.notify({ message: tdc('Added to the reservation.'), icon: 'shopping_bag', timeout: 1200, position: 'top', group: false })
}
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
// under the search field on large screens only (phones keep the space)
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
/* phones: the field stays under the app header; no padding around it - the
   field itself is the card (white background and a shadow) */
.marketplace-search__bar {
  position: sticky;
  z-index: 3;
  margin-bottom: 8px;
  padding: 0;
}
.marketplace-search__bar :deep(.q-field__control) {
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
}
.body--dark .marketplace-search__bar :deep(.q-field__control) {
  background: var(--q-dark);
}
/* same height as the dense fields beside it, so the row lines up */
.marketplace-search__toggle {
  display: flex;
  align-items: center;
  min-height: 40px;
}

.offer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.offer {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto;
  grid-template-areas: "photo info buy";
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
}
.offer__photo { grid-area: photo; }
.offer__info { grid-area: info; min-width: 0; }
.offer__buy {
  grid-area: buy;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right;
  max-width: 200px;
}
.offer__name {
  font-size: 1rem;
  line-height: 1.3;
}
.offer__pharmacy {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.offer__price {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
}
/* medium (Quasar's md button height), not large */
.offer__reserve {
  margin-top: 4px;
  min-height: 36px;
}

/* phones: price, stock and a full-width "Reserve" under the medicine */
@media (max-width: 599px) {
  .offer {
    grid-template-columns: 64px minmax(0, 1fr);
    grid-template-areas:
      "photo info"
      "buy buy";
  }
  .offer__buy {
    max-width: none;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "price stock"
      "mode mode"
      "reserve reserve";
    align-items: center;
    text-align: left;
    padding-top: 10px;
    border-top: 1px solid rgba(127, 127, 127, 0.18);
  }
  .offer__price { grid-area: price; }
  .offer__buy > .q-badge { grid-area: stock; justify-self: end; }
  .offer__mode { grid-area: mode; }
  .offer__reserve {
    grid-area: reserve;
    width: 100%;
  }
}
</style>
