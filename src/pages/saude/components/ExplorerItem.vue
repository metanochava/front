<template>
  <div
    class="explorer-item"
    :class="{ selected: selected?.id === item.id, 'explorer-item--gallery': gallery }"
    @click="$emit('select', item)"
    @dblclick="$emit('open', item)"
  >
    <!-- what the browser can show of the file (image, PDF, text, video), or its icon -->
    <!-- a square preview the width of the tile: every tile the same square -->
    <FileThumb :item="item" :size="gallery ? '96px' : '56px'" square framed />

    <!-- one line: a long name is cut in the middle (...), a file always keeps
         its extension; the tooltip always shows the whole name -->
    <div class="explorer-label" data-test="explorer-label">
      {{ label }}
    </div>

    <!-- on the whole item (icon and name) -->
    <s-tooltip>{{ fullName }}</s-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FileThumb from './FileThumb.vue'
import { fullFileName, shortFileName } from './fileKind'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selected: {
    type: Object,
    default: null
  },
  // 'icons' (default) or 'gallery' (bigger previews)
  mode: {
    type: String,
    default: 'icons'
  }
})

defineEmits([
  'select',
  'open'
])

const gallery = computed(() => props.mode === 'gallery')

// longest label shown under the preview (fits the item on one line)
const maxLabel = computed(() => (gallery.value ? 28 : 16))

const fullName = computed(() => fullFileName(props.item))
const label = computed(() => shortFileName(props.item, maxLabel.value))
</script>

<style scoped>
/* fills its grid cell: the grid sets the widths, every tile the same height,
   the preview centred above a one-line name */
.explorer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-width: 0;
  height: 100%;
  text-align: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: .2s;
  border: 1px solid transparent;
}

.explorer-item:hover {
  background: #e3f2fd;
}

.explorer-item.selected {
  background: #dbeafe;
  border-color: #2563eb;
}

.explorer-label {
  width: 100%;
  margin-top: 8px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
}
</style>
