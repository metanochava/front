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

function formatDistance (km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

// small DOM builder: text always through textContent (names, addresses and
// phones are tenant data, never HTML)
function el (tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined && text !== null) node.textContent = text
  return node
}
function icon (name) {
  const node = el('i', 'material-icons pharmacy-pin__icon', name)
  node.setAttribute('aria-hidden', 'true')
  return node
}

function infoContent (pharmacy) {
  const card = el('div', 'pharmacy-pin')

  const head = el('div', 'pharmacy-pin__head')
  const avatar = el('div', 'pharmacy-pin__avatar')
  avatar.appendChild(icon('local_pharmacy'))
  const titles = el('div', 'pharmacy-pin__titles')
  titles.appendChild(el('div', 'pharmacy-pin__name', pharmacy.name))
  if (pharmacy.organisation && pharmacy.organisation !== pharmacy.name) {
    titles.appendChild(el('div', 'pharmacy-pin__org', pharmacy.organisation))
  }
  head.append(avatar, titles)
  if (pharmacy.distance_km !== null && pharmacy.distance_km !== undefined) {
    head.appendChild(el('span', 'pharmacy-pin__distance', formatDistance(pharmacy.distance_km)))
  }
  card.appendChild(head)

  const rows = el('div', 'pharmacy-pin__rows')
  const row = (iconName, text, href) => {
    if (!text) return
    const line = el(href ? 'a' : 'div', 'pharmacy-pin__row')
    if (href) line.href = href
    line.append(icon(iconName), el('span', null, text))
    rows.appendChild(line)
  }
  row('place', pharmacy.address)
  row('call', pharmacy.phone, pharmacy.phone ? `tel:${pharmacy.phone.replace(/[^\d+]/g, '')}` : null)
  row('schedule', pharmacy.opening_hours)
  if (rows.childNodes.length) card.appendChild(rows)

  card.appendChild(el(
    'span',
    `pharmacy-pin__badge ${pharmacy.online_orders ? 'pharmacy-pin__badge--online' : ''}`,
    pharmacy.online_orders ? tdc('Online reservation') : tdc('In-store only'),
  ))

  const actions = el('div', 'pharmacy-pin__actions')
  if (props.selectable) {
    const primary = el('button', 'pharmacy-pin__btn pharmacy-pin__btn--primary')
    primary.type = 'button'
    primary.append(icon('search'), el('span', null, tdc('Medicines at this pharmacy')))
    primary.addEventListener('click', () => emit('select', pharmacy))
    actions.appendChild(primary)
  }
  const lat = Number(pharmacy.coordinates?.lat)
  const lng = Number(pharmacy.coordinates?.lng)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const directions = el('a', 'pharmacy-pin__btn pharmacy-pin__btn--ghost')
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    directions.target = '_blank'
    directions.rel = 'noopener noreferrer'
    directions.append(icon('directions'), el('span', null, tdc('Directions')))
    actions.appendChild(directions)
  }
  card.appendChild(actions)
  return card
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

<!-- not scoped: the marker's card lives in Google's InfoWindow, outside this
     component's DOM. Every rule is under .pharmacy-pin. -->
<style>
.pharmacy-pin {
  width: 260px;
  max-width: 72vw;
  font-family: inherit;
  color: #1f2937;
  line-height: 1.35;
}
.pharmacy-pin__head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}
.pharmacy-pin__avatar {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--q-primary), color-mix(in srgb, var(--q-primary) 60%, #000));
  box-shadow: 0 4px 10px color-mix(in srgb, var(--q-primary) 35%, transparent);
}
.pharmacy-pin__avatar .pharmacy-pin__icon {
  font-size: 22px;
  color: #fff;
}
.pharmacy-pin__titles {
  flex: 1 1 auto;
  min-width: 0;
}
.pharmacy-pin__name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}
.pharmacy-pin__org {
  font-size: 12px;
  color: #6b7280;
  margin-top: 1px;
}
.pharmacy-pin__distance {
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--q-primary);
  background: color-mix(in srgb, var(--q-primary) 12%, #fff);
}
.pharmacy-pin__rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0;
  border-top: 1px solid #eef0f3;
  border-bottom: 1px solid #eef0f3;
  margin-bottom: 10px;
}
.pharmacy-pin__row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  text-decoration: none;
  white-space: pre-line;
}
a.pharmacy-pin__row:hover span {
  color: var(--q-primary);
  text-decoration: underline;
}
.pharmacy-pin__icon {
  font-size: 17px;
  color: var(--q-primary);
  line-height: 1.2;
}
.pharmacy-pin__badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  color: #6b7280;
  background: #f3f4f6;
  margin-bottom: 12px;
}
.pharmacy-pin__badge--online {
  color: #047857;
  background: #d1fae5;
}
.pharmacy-pin__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pharmacy-pin__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 9px 14px;
  border-radius: 999px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.pharmacy-pin__btn .pharmacy-pin__icon {
  font-size: 18px;
  color: inherit;
}
.pharmacy-pin__btn--primary {
  border: 0;
  color: #fff;
  background: var(--q-primary);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--q-primary) 35%, transparent);
}
.pharmacy-pin__btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--q-primary) 45%, transparent);
}
.pharmacy-pin__btn--ghost {
  border: 1px solid color-mix(in srgb, var(--q-primary) 40%, transparent);
  color: var(--q-primary);
  background: #fff;
}
.pharmacy-pin__btn--ghost:hover {
  background: color-mix(in srgb, var(--q-primary) 8%, #fff);
}
.pharmacy-pin__btn:focus-visible {
  outline: 2px solid var(--q-primary);
  outline-offset: 2px;
}
</style>
