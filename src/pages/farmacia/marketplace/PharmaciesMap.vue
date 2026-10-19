<template>
  <div
    v-if="points.length && !failed"
    class="pharmacies-map"
    :class="fill ? 'pharmacies-map--fill' : 'q-mb-md'"
    data-test="pharmacies-map"
  >
    <div ref="mapEl" class="pharmacies-map__surface" />
    <s-btn
      v-if="expandable"
      round
      dense
      color="primary"
      icon="fullscreen"
      class="pharmacies-map__expand"
      data-test="pharmacies-map-expand"
      @click="$emit('expand')"
    >
      <q-tooltip>{{ tdc('Expand map') }}</q-tooltip>
    </s-btn>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { tdc } from 'quasar_resaas'
import { hasMapsKey, loadMaps, mapPoints } from './useMarketplace'

// The listed pharmacies on one map (Google Maps). Nothing is rendered without
// GOOGLE_MAPS_API_KEY or without a pharmacy that has coordinates; a failed
// script load emits "failed" so the page can fall back to its list. The
// device position, when shared, is a blue dot.
const props = defineProps({
  pharmacies: { type: Array, default: () => [] },
  position: { type: Object, default: null },
  // show the "Medicines at this pharmacy" button in the marker's window
  selectable: { type: Boolean, default: false },
  // an "Expand map" button (emits "expand"; the page opens the full-screen map)
  expandable: { type: Boolean, default: false },
  // fill the parent (a full-screen dialog body) instead of the fixed height
  fill: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'failed', 'expand'])

const points = computed(() => (hasMapsKey() ? mapPoints(props.pharmacies) : []))
const mapEl = ref(null)
const failed = ref(false)

let map = null
let info = null
let markers = []
let here = null

function infoContent (pharmacy) {
  // text nodes only: names and addresses are tenant data, never HTML
  const box = document.createElement('div')
  const line = (text, bold = false) => {
    if (!text) return
    const el = document.createElement('div')
    el.textContent = text
    if (bold) el.style.fontWeight = '600'
    box.appendChild(el)
  }
  line(pharmacy.name, true)
  line(pharmacy.organisation)
  line(pharmacy.address)
  line(pharmacy.phone)
  line(pharmacy.opening_hours)
  if (pharmacy.distance_km !== null && pharmacy.distance_km !== undefined) {
    line(pharmacy.distance_km < 1 ? `${Math.round(pharmacy.distance_km * 1000)} m` : `${pharmacy.distance_km.toFixed(1)} km`)
  }
  if (props.selectable) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = tdc('Medicines at this pharmacy')
    button.style.marginTop = '6px'
    button.addEventListener('click', () => emit('select', pharmacy))
    box.appendChild(button)
  }
  return box
}

async function render () {
  if (!points.value.length) return
  try {
    await loadMaps()
  } catch {
    failed.value = true
    emit('failed')
    return
  }
  if (!mapEl.value) return
  const { maps } = window.google
  if (!map) {
    map = new maps.Map(mapEl.value, { zoom: 13, center: points.value[0], gestureHandling: 'cooperative', mapTypeControl: false, streetViewControl: false })
    info = new maps.InfoWindow()
  }
  markers.forEach((marker) => marker.setMap(null))
  markers = points.value.map((point) => {
    const marker = new maps.Marker({ map, position: { lat: point.lat, lng: point.lng }, title: point.pharmacy.name })
    marker.addListener('click', () => {
      info.setContent(infoContent(point.pharmacy))
      info.open({ map, anchor: marker })
    })
    return marker
  })
  here?.setMap(null)
  here = null
  const bounds = new maps.LatLngBounds()
  points.value.forEach((point) => bounds.extend(point))
  if (props.position) {
    here = new maps.Marker({
      map,
      position: props.position,
      title: tdc('Your location'),
      icon: { path: maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#1976d2', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
    })
    bounds.extend(props.position)
  }
  if (points.value.length === 1 && !props.position) {
    map.setCenter(points.value[0])
    map.setZoom(15)
  } else {
    map.fitBounds(bounds, 40)
  }
}

onMounted(() => {
  render()
  // a full-screen dialog is still opening: fit the pharmacies again at its final size
  if (props.fill) setTimeout(render, 350)
})
watch([points, () => props.position], () => setTimeout(render)) // after the surface exists

onBeforeUnmount(() => {
  markers.forEach((marker) => marker.setMap(null))
  here?.setMap(null)
  markers = []
  map = null
})
</script>

<style scoped>
.pharmacies-map {
  height: 480px;
  max-height: 70vh;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, .25);
}
.pharmacies-map--fill {
  flex: 1 1 auto;
  height: auto;
  max-height: none;
  min-height: 0;
  border-radius: 0;
  border: 0;
}
.pharmacies-map {
  position: relative;
}
.pharmacies-map__surface {
  width: 100%;
  height: 100%;
}
.pharmacies-map__expand {
  position: absolute;
  bottom: 24px;
  left: 10px;
  z-index: 1;
}
</style>
