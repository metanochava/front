<template>
  <q-dialog v-model="open" data-test="medicine-media-viewer" @keydown.left="go(-1)" @keydown.right="go(1)">
    <s-modal-card :title="title" icon="photo_library" width="960px" flush @close="open = false">
      <div v-if="items.length" class="media-viewer" :class="{ 'media-viewer--single': items.length === 1 }">
        <!-- thumbnails: a column on the left (a row below on small screens) -->
        <div v-if="items.length > 1" class="media-viewer__thumbs" data-test="media-thumbs">
          <button
            v-for="(item, index) in items"
            :key="item.src"
            type="button"
            class="media-viewer__thumb"
            :class="{ 'media-viewer__thumb--active': index === current }"
            :aria-label="item.caption || (item.kind === 'video' ? tdc('Video') : tdc('Photo'))"
            data-test="media-thumb"
            @click="current = index"
            @mouseenter="current = index"
          >
            <!-- #t=0.1: the browser paints the first frame instead of a blank box -->
            <video v-if="item.kind === 'video'" :src="`${item.src}#t=0.1`" muted preload="metadata" />
            <img v-else :src="item.src" alt="">
            <q-icon v-if="item.kind === 'video'" name="play_circle" size="24px" class="media-viewer__play" />
          </button>
        </div>

        <!-- the selected photo or video, large -->
        <div class="media-viewer__stage" data-test="media-stage">
          <video
            v-if="active.kind === 'video'"
            :key="active.src"
            :src="active.src"
            controls
            autoplay
            playsinline
            class="media-viewer__media"
          />
          <!-- photos zoom under the mouse, like a shop's product gallery -->
          <div
            v-else
            class="media-viewer__zoom"
            :class="{ 'media-viewer__zoom--on': zoom.on }"
            data-test="media-zoom"
            @mousemove="moveZoom"
            @mouseleave="zoom.on = false"
          >
            <img
              :src="active.src"
              :alt="active.caption || title"
              class="media-viewer__media"
              :style="zoom.on ? { transformOrigin: zoom.origin } : null"
            >
          </div>
          <s-btn
            v-if="items.length > 1"
            round
            dense
            unelevated
            color="primary"
            icon="chevron_left"
            class="media-viewer__nav media-viewer__nav--prev"
            :aria-label="tdc('Previous')"
            @click="go(-1)">
            <s-tooltip>{{ tdc('Previous') }}</s-tooltip>
          </s-btn>
          <s-btn
            v-if="items.length > 1"
            round
            dense
            unelevated
            color="primary"
            icon="chevron_right"
            class="media-viewer__nav media-viewer__nav--next"
            :aria-label="tdc('Next')"
            @click="go(1)">
            <s-tooltip>{{ tdc('Next') }}</s-tooltip>
          </s-btn>
          <div class="media-viewer__caption text-caption">
            <span v-if="active.caption">{{ active.caption }} · </span>{{ current + 1 }} / {{ items.length }}
          </div>
        </div>
      </div>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { tdc } from 'quasar_resaas'
import { medicineMedia } from './useMarketplace'

// The photos and videos of one medicine of the search, like a shop's product
// gallery: the selected item large, thumbnails beside it (hover or click),
// arrows and the keyboard to move. The main photo comes first.
const props = defineProps({ medicine: { type: Object, default: null } })
const open = defineModel({ type: Boolean, default: false })

const current = ref(0)
const items = computed(() => medicineMedia(props.medicine))
const active = computed(() => items.value[current.value] || {})
const title = computed(() =>
  props.medicine ? `${props.medicine.name} ${props.medicine.strength}` : tdc('Photos of the medicine'),
)

// hover zoom (mouse only: on touch screens the photo stays fitted)
const zoom = reactive({ on: false, origin: '50% 50%' })
const canHover = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

function moveZoom (event) {
  if (!canHover) return
  const box = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - box.left) / box.width) * 100
  const y = ((event.clientY - box.top) / box.height) * 100
  zoom.origin = `${Math.min(Math.max(x, 0), 100)}% ${Math.min(Math.max(y, 0), 100)}%`
  zoom.on = true
}

function go (delta) {
  const count = items.value.length
  if (count > 1) current.value = (current.value + delta + count) % count
}

watch(open, (value) => { if (value) current.value = 0 })
watch(current, () => { zoom.on = false })
</script>

<style scoped>
.media-viewer {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  padding: 12px;
  height: min(70vh, 620px);
}
.media-viewer--single {
  grid-template-columns: 1fr;
}
.media-viewer__thumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}
.media-viewer__thumb {
  position: relative;
  flex: 0 0 auto;
  width: 72px;
  height: 72px;
  padding: 2px;
  border: 2px solid rgba(127, 127, 127, 0.3);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
}
.media-viewer__thumb--active {
  border-color: var(--q-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--q-primary) 30%, transparent);
}
.media-viewer__thumb video {
  background: #111;
}
.media-viewer__thumb img,
.media-viewer__thumb video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
.media-viewer__play {
  position: absolute;
  inset: 0;
  margin: auto;
  color: #fff;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.7));
}
.media-viewer__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
}
.media-viewer__media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.media-viewer__zoom {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: zoom-in;
}
.media-viewer__zoom img {
  transition: transform 0.15s ease;
}
.media-viewer__zoom--on img {
  transform: scale(2.2);
}
.media-viewer__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.85;
}
.media-viewer__nav--prev { left: 4px; }
.media-viewer__nav--next { right: 4px; }
.media-viewer__caption {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
}
@media (max-width: 599px) {
  .media-viewer {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    height: 75vh;
  }
  .media-viewer__thumbs {
    flex-direction: row;
    order: 2;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
