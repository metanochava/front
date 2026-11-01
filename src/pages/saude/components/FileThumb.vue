<template>
  <!-- A small, non-interactive preview of what the browser can show (image,
       PDF first page, text, video frame); anything else - and folders - its
       icon. The overlay keeps clicks and double clicks for the parent. -->
  <div class="file-thumb flex flex-center" :class="{ 'file-thumb--framed': framed }" :style="square ? { width: '100%', aspectRatio: '1 / 1' } : { height: size, width: width || size }" :data-test="`file-thumb-${kind}`">
    <q-icon v-if="folder" name="folder" color="amber-8" :size="iconSize" />
    <img v-else-if="kind === 'image'" :src="url" :alt="name" loading="lazy" class="file-thumb__media">
    <iframe v-else-if="kind === 'pdf'" :src="`${url}#toolbar=0&navpanes=0&view=FitH`" loading="lazy" class="file-thumb__frame" :title="name" tabindex="-1" />
    <iframe v-else-if="kind === 'text'" :src="url" loading="lazy" class="file-thumb__frame" :title="name" tabindex="-1" />
    <video v-else-if="kind === 'video'" :src="url" muted preload="metadata" class="file-thumb__media" />
    <q-icon v-else :name="icon" color="primary" :size="iconSize" />
    <div class="file-thumb__overlay" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { fileUrl, fileName, fileKind, KIND_ICONS } from './fileKind'

const props = defineProps({
  item: { type: Object, required: true },
  // CSS height (and width, unless `width` is given)
  size: { type: String, default: '64px' },
  width: { type: String, default: null },
  // PDF / text frames only when there is room for them (not in a list row)
  previews: { type: Boolean, default: true },
  framed: { type: Boolean, default: false },
  // a square as wide as its container (explorer tiles); `size` then only sizes the icon
  square: { type: Boolean, default: false }
})

const folder = computed(() => (props.item.tipo?.id ?? props.item.tipo) === 'Folder')
const url = computed(() => fileUrl(props.item))
const name = computed(() => fileName(props.item))
const kind = computed(() => {
  const k = fileKind(props.item)
  return !props.previews && (k === 'pdf' || k === 'text' || k === 'video') ? 'other' : k
})
// the backend picks the icon from the extension (serializer `icon`)
const icon = computed(() => props.item.icon || KIND_ICONS[fileKind(props.item)] || 'insert_drive_file')
const iconSize = computed(() => (props.square ? props.size : `calc(${props.size} * 0.8)`))
</script>

<style scoped>
.file-thumb {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  margin: 0 auto;
}
.file-thumb--framed { background: #f4f6f8; }
.body--dark .file-thumb--framed { background: #1b1b1b; }
.file-thumb__media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.file-thumb__frame {
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
  pointer-events: none;
}
.file-thumb__overlay {
  position: absolute;
  inset: 0;
}
</style>
