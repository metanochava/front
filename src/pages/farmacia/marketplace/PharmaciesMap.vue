<template>
  <div
    v-if="hasMapsKey() && !failed"
    class="pharmacies-map"
    :class="fill ? 'pharmacies-map--fill' : 'q-mb-md'"
    data-test="pharmacies-map"
  >
    <div ref="mapEl" class="pharmacies-map__surface" />

    <!-- on top of the map, centred: the page's own content (slot "top", e.g.
         the search field) and, under it, the route drawn on this map -->
    <div class="pharmacies-map__top">
      <div v-if="$slots.top" class="pharmacies-map__search" data-test="pharmacies-map-top">
        <slot name="top" />
      </div>

      <!-- the route drawn on this map: time, distance, car/foot and clear -->
      <div v-if="route.pharmacy" class="pharmacies-map__route" data-test="pharmacies-map-route">
        <q-icon :name="route.mode === 'WALKING' ? 'directions_walk' : 'directions_car'" size="20px" color="primary" />
        <div class="pharmacies-map__route-text">
          <div class="text-weight-bold ellipsis">{{ route.pharmacy.name }}</div>
          <div v-if="route.loading" class="text-caption text-grey-7">{{ tdc('Calculating route...') }}</div>
          <div v-else-if="route.summary" class="text-caption" data-test="route-summary">{{ route.summary }}</div>
        </div>
        <s-btn
          flat
          round
          dense
          size="sm"
          color="primary"
          :icon="route.mode === 'WALKING' ? 'directions_car' : 'directions_walk'"
          :aria-label="route.mode === 'WALKING' ? tdc('By car') : tdc('On foot')"
          data-test="route-mode"
          @click="showRoute(route.pharmacy, route.mode === 'WALKING' ? 'DRIVING' : 'WALKING')"
        >
          <q-tooltip>{{ route.mode === 'WALKING' ? tdc('By car') : tdc('On foot') }}</q-tooltip>
        </s-btn>
        <s-btn flat round dense size="sm" icon="close" :aria-label="tdc('Clear route')" data-test="route-clear" @click="clearRoute">
          <q-tooltip>{{ tdc('Clear route') }}</q-tooltip>
        </s-btn>
      </div>
    </div>

    <!-- at the bottom of the map, centred: the page's own content (slot "bottom",
         e.g. how many pharmacies are inside the radius) -->
    <div v-if="$slots.bottom" class="pharmacies-map__bottom" data-test="pharmacies-map-bottom">
      <slot name="bottom" />
    </div>

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
import { NEARBY_RADIUS_KM, hasMapsKey, isNearby, loadMaps, mapPoints, useMapRoute } from './useMarketplace'

// The listed pharmacies on one map (Google Maps). Nothing is rendered without
// GOOGLE_MAPS_API_KEY or without a pharmacy that has coordinates; a failed
// script load emits "failed" so the page can fall back to its list. The
// device position, when shared, is a blue dot; while a route is open it
// follows the device (useMapRoute).
const props = defineProps({
  pharmacies: { type: Array, default: () => [] },
  position: { type: Object, default: null },
  // show the "Medicines at this pharmacy" button in the marker's window
  selectable: { type: Boolean, default: false },
  // an "Expand map" button (emits "expand"; the page opens the full-screen map)
  expandable: { type: Boolean, default: false },
  // fill the parent (a full-screen dialog body) instead of the fixed height
  fill: { type: Boolean, default: false },
  // the route, from useMapRoute(): the page passes one to both of its maps so
  // the full-screen map shows the same route; without it the map keeps its own
  route: { type: Object, default: null },
  // the "near you" radius (circle and highlighted pins), chosen on the page
  radiusKm: { type: Number, default: NEARBY_RADIUS_KM },
})
const emit = defineEmits(['select', 'failed', 'expand'])

const points = computed(() => (hasMapsKey() ? mapPoints(props.pharmacies) : []))
const mapEl = ref(null)
const failed = ref(false)

let map = null
let info = null
let markers = []
let here = null
let radius = null
let directionsRenderer = null

// the route on the map (Google Directions): from the device position to one pharmacy
const route = props.route || useMapRoute()

// a map pin (material "place" shape) in the theme's colour for nearby
// pharmacies, smaller and grey for the others
const PIN_PATH = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z'

function themeColour () {
  return getComputedStyle(document.body).getPropertyValue('--q-primary').trim() || '#1976d2'
}

function pinIcon (maps, nearby) {
  return {
    path: PIN_PATH,
    fillColor: nearby ? themeColour() : '#9e9e9e',
    fillOpacity: nearby ? 1 : 0.85,
    strokeColor: '#ffffff',
    strokeWeight: 1.5,
    scale: nearby ? 2 : 1.4,
    anchor: new maps.Point(12, 22),
  }
}

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
function withTitle (node) {
  node.title = node.textContent
  return node
}
function icon (name) {
  const node = el('i', 'material-icons pharmacy-pin__icon', name)
  node.setAttribute('aria-hidden', 'true')
  return node
}

// the distance sits in the InfoWindow's own header, on the close button's line,
// so the name keeps the card's whole width
function infoHeader (pharmacy) {
  const header = el('div', 'pharmacy-pin__header')
  if (pharmacy.distance_km !== null && pharmacy.distance_km !== undefined) {
    header.appendChild(el('span', 'pharmacy-pin__distance', formatDistance(pharmacy.distance_km)))
  }
  return header
}

function infoContent (pharmacy) {
  const card = el('div', 'pharmacy-pin')

  const head = el('div', 'pharmacy-pin__head')
  const avatar = el('div', 'pharmacy-pin__avatar')
  avatar.appendChild(icon('local_pharmacy'))
  const titles = el('div', 'pharmacy-pin__titles')
  // long texts end in "..." (CSS); the whole text stays in the tooltip
  titles.appendChild(withTitle(el('div', 'pharmacy-pin__name', pharmacy.name)))
  if (pharmacy.organisation && pharmacy.organisation !== pharmacy.name) {
    titles.appendChild(withTitle(el('div', 'pharmacy-pin__org', pharmacy.organisation)))
  }
  head.append(avatar, titles)
  card.appendChild(head)

  const rows = el('div', 'pharmacy-pin__rows')
  const row = (iconName, text, href) => {
    if (!text) return
    const line = el(href ? 'a' : 'div', 'pharmacy-pin__row')
    if (href) line.href = href
    line.append(icon(iconName), withTitle(el('span', 'pharmacy-pin__text', text)))
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
    primary.append(icon('search'), withTitle(el('span', 'pharmacy-pin__label', tdc('Medicines at this pharmacy'))))
    primary.addEventListener('click', () => emit('select', pharmacy))
    actions.appendChild(primary)
  }
  const lat = Number(pharmacy.coordinates?.lat)
  const lng = Number(pharmacy.coordinates?.lng)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    // with the device position the route is drawn here; otherwise Google Maps
    // (it asks the user where they start from)
    const directions = el('a', 'pharmacy-pin__btn pharmacy-pin__btn--ghost')
    directions.href = googleMapsRoute(pharmacy)
    directions.target = '_blank'
    directions.rel = 'noopener noreferrer'
    directions.dataset.test = 'pharmacy-pin-route'
    directions.append(icon('directions'), withTitle(el('span', 'pharmacy-pin__label', props.position ? tdc('Show route') : tdc('Directions'))))
    if (props.position) {
      directions.addEventListener('click', (event) => {
        event.preventDefault()
        info.close()
        showRoute(pharmacy)
      })
    }
    actions.appendChild(directions)
  }
  card.appendChild(actions)
  return card
}

function googleMapsRoute (pharmacy, mode = 'driving') {
  const { lat, lng } = pharmacy.coordinates || {}
  const origin = props.position ? `&origin=${props.position.lat},${props.position.lng}` : ''
  return `https://www.google.com/maps/dir/?api=1${origin}&destination=${lat},${lng}&travelmode=${mode}`
}

function clearRoute () {
  route.clear()
}

// from where the device is now (followed while a route is open), or from the
// position used for the search
function origin () {
  return route.live ? { lat: route.live.lat, lng: route.live.lng } : props.position
}

async function showRoute (pharmacy, mode = route.mode) {
  if (!props.position || !map) return
  try {
    await route.show(pharmacy, { origin: origin(), mode })
  } catch {
    // Directions not enabled for the key, or no route: Google Maps does it
    window.open(googleMapsRoute(pharmacy, mode.toLowerCase()), '_blank', 'noopener')
  }
}

// draws route.result on this map (each map has its own renderer; the result is shared)
function drawRoute () {
  if (!map) return
  if (!route.result) {
    directionsRenderer?.setMap(null)
    directionsRenderer = null
    return
  }
  if (!directionsRenderer) {
    directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, // our pins and the blue dot stay
      preserveViewport: false,
      polylineOptions: { strokeColor: themeColour(), strokeOpacity: 0.9, strokeWeight: 6 },
    })
  }
  directionsRenderer.setDirections(route.result)
}

// the blue dot follows the device; the map pans when it leaves the view
function moveHere () {
  if (!map || !here) return
  const point = route.live ? { lat: route.live.lat, lng: route.live.lng } : props.position
  if (!point) return
  here.setPosition(point)
  if (route.live && !map.getBounds()?.contains(point)) map.panTo(point)
}

async function render () {
  // rendered even with no pharmacy (a search with no result): the field on
  // top of the map must stay where the user is typing
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
    map = new maps.Map(mapEl.value, {
      zoom: 13,
      center: points.value[0] || props.position || { lat: 0, lng: 0 },
      ...(points.value.length || props.position ? {} : { zoom: 2 }),
      // on the page one finger scrolls the page; full screen, one finger moves the map
      gestureHandling: props.fill ? 'greedy' : 'cooperative',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false, // "Expand map" opens our full-screen dialog
    })
    info = new maps.InfoWindow()
  }
  markers.forEach((marker) => marker.setMap(null))
  const highlight = Boolean(props.position)
  markers = points.value.map((point) => {
    const nearby = highlight && isNearby(point.pharmacy, props.radiusKm)
    const marker = new maps.Marker({
      map,
      position: { lat: point.lat, lng: point.lng },
      title: point.pharmacy.name,
      // without the device position every pharmacy keeps the plain pin
      ...(highlight ? { icon: pinIcon(maps, nearby), zIndex: nearby ? 2 : 1 } : {}),
    })
    marker.addListener('click', () => {
      info.setHeaderContent(infoHeader(point.pharmacy))
      info.setContent(infoContent(point.pharmacy))
      info.open({ map, anchor: marker })
    })
    return marker
  })
  here?.setMap(null)
  here = null
  radius?.setMap(null)
  radius = null
  const bounds = new maps.LatLngBounds()
  const nearbyPoints = highlight ? points.value.filter((point) => isNearby(point.pharmacy, props.radiusKm)) : []
  // with nearby pharmacies the view frames the radius circle; otherwise all of them
  ;(nearbyPoints.length ? nearbyPoints : points.value).forEach((point) => bounds.extend(point))
  if (props.position) {
    radius = new maps.Circle({
      map,
      center: props.position,
      radius: props.radiusKm * 1000,
      strokeColor: themeColour(),
      strokeOpacity: 0.6,
      strokeWeight: 1.5,
      fillColor: themeColour(),
      fillOpacity: 0.08,
      clickable: false,
    })
    if (nearbyPoints.length) bounds.union(radius.getBounds())
    here = new maps.Marker({
      map,
      position: route.live ? { lat: route.live.lat, lng: route.live.lng } : props.position,
      title: tdc('Your location'),
      icon: { path: maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#1976d2', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
    })
    bounds.extend(props.position)
  }
  if (!points.value.length) {
    // nothing to frame: around the device, or the view stays as it is
    if (props.position) {
      map.setCenter(props.position)
      map.setZoom(13)
    }
  } else if (points.value.length === 1 && !props.position) {
    map.setCenter(points.value[0])
    map.setZoom(15)
  } else {
    map.fitBounds(bounds, 40)
  }
  // an open route (e.g. drawn before the full screen was opened) frames the view
  if (route.result) {
    directionsRenderer?.setMap(null)
    directionsRenderer = null
    drawRoute()
  }
}

defineExpose({ refresh: render })

onMounted(() => {
  render()
  // a full-screen dialog is still opening: fit the pharmacies again at its final size
  if (props.fill) setTimeout(render, 350)
})
watch([points, () => props.position, () => props.radiusKm], () => setTimeout(render)) // after the surface exists

watch(() => route.result, drawRoute)
watch(() => route.live, moveHere)

onBeforeUnmount(() => {
  // only this map's drawing: the route itself stays (the other map still shows it)
  directionsRenderer?.setMap(null)
  directionsRenderer = null
  markers.forEach((marker) => marker.setMap(null))
  here?.setMap(null)
  radius?.setMap(null)
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
/* on top of the map, centred: the search card and, under it, the route bar */
.pharmacies-map__top {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none; /* the map stays usable around the cards */
}
.pharmacies-map__top > * {
  pointer-events: auto;
}
/* no padding: the field itself is the card (its own border radius, a white
   background and the shadow) */
.pharmacies-map__search {
  width: min(440px, 100%);
  padding: 0;
}
.pharmacies-map__search :deep(.q-field__control) {
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.body--dark .pharmacies-map__search :deep(.q-field__control) {
  background: var(--q-dark);
}
/* bottom, centred, clear of "Expand map" (left) and Google's controls (right) */
.pharmacies-map__bottom {
  position: absolute;
  left: 56px;
  right: 56px;
  bottom: 24px;
  z-index: 2;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.pharmacies-map__bottom > * {
  pointer-events: auto;
}
.pharmacies-map__route {
  width: min(440px, 100%);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  border-radius: 14px;
  background: #fff;
  color: #1f2937;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.pharmacies-map__route-text {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.25;
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
/* the whole card shows at once: Google's InfoWindow scrolls its content
   (inline overflow: scroll and a max-height) - not for this card */
.gm-style-iw-d:has(.pharmacy-pin) {
  overflow: visible !important;
  max-height: none !important;
}
.gm-style-iw-c:has(.pharmacy-pin) {
  max-height: none !important;
  /* Google leaves no right/bottom padding (room for its scrollbar) */
  padding-right: 12px !important;
  padding-bottom: 12px !important;
}
.pharmacy-pin {
  width: 214px; /* fits Google's narrowest window on a phone with 12px each side */
  max-width: 60vw;
  font-family: inherit;
  color: #1f2937;
  line-height: 1.35;
}
.pharmacy-pin__head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}
.pharmacy-pin__avatar {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--q-primary), color-mix(in srgb, var(--q-primary) 60%, #000));
  box-shadow: 0 4px 10px color-mix(in srgb, var(--q-primary) 35%, transparent);
}
.pharmacy-pin__avatar .pharmacy-pin__icon {
  font-size: 20px;
  color: #fff;
}
.pharmacy-pin__titles {
  flex: 1 1 auto;
  min-width: 0;
}
/* one line each, "..." when longer */
.pharmacy-pin__name,
.pharmacy-pin__org,
.pharmacy-pin__text,
.pharmacy-pin__label {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pharmacy-pin__name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}
.pharmacy-pin__org {
  font-size: 12px;
  color: #6b7280;
  margin-top: 1px;
}
.pharmacy-pin__header {
  display: flex;
  align-items: center;
  min-height: 24px;
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
  gap: 4px;
  padding: 8px 0;
  border-top: 1px solid #eef0f3;
  border-bottom: 1px solid #eef0f3;
  margin-bottom: 8px;
}
.pharmacy-pin__row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #374151;
  text-decoration: none;
  min-width: 0;
}
a.pharmacy-pin__row:hover span {
  color: var(--q-primary);
  text-decoration: underline;
}
.pharmacy-pin__icon {
  font-size: 15px;
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
  margin-bottom: 8px;
}
.pharmacy-pin__badge--online {
  color: #047857;
  background: #d1fae5;
}
/* small buttons, one per line, the card's full width and never wider
   (border-box: the "Show route" link is an <a>, content-box by default) */
.pharmacy-pin__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pharmacy-pin__btn {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 30px;
  padding: 5px 10px;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.pharmacy-pin__btn .pharmacy-pin__icon {
  font-size: 16px;
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
