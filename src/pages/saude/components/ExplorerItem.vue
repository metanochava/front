<template>
  <div
    class="explorer-item"
    :class="{ selected: selected?.id === item.id }"
    @click="$emit('select', item)"
    @dblclick="$emit('open', item)"
  >
    <q-icon
      :name="icon"
      :color="isFolder ? 'amber-8' : 'primary'"
      size="64px"
    />

    <div class="explorer-label">
      {{ item.nome }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selected: {
    type: Object,
    default: null
  }
})

defineEmits([
  'select',
  'open'
])

// The API answers tipo as a choice ({id: 'Folder'|'File', ...}) and file as an
// object ({url, name, ext, mime_type}) - reading either as a string threw and
// the item (and the grid with it) did not render.
const isFolder = computed(() => (props.item.tipo?.id ?? props.item.tipo) === 'Folder')

const icon = computed(() => {
  if (isFolder.value) return 'folder'
  // the backend already picks the icon from the extension (serializer `icon`)
  if (props.item.icon) return props.item.icon

  const file = props.item.file
  const f = String(
    props.item.extensao || (typeof file === 'string' ? file : file?.name) || props.item.nome || ''
  ).toLowerCase()

  if (f.endsWith('pdf')) return 'picture_as_pdf'
  if (f.match(/(jpg|jpeg|png|gif|bmp|webp|svg)$/)) return 'image'
  if (f.match(/(doc|docx|odt|txt|rtf)$/)) return 'description'
  if (f.match(/(xls|xlsx|ods|csv)$/)) return 'table_view'
  if (f.match(/(zip|rar|7z)$/)) return 'folder_zip'
  if (f.match(/(mp4|webm|mov)$/)) return 'movie'
  if (f.match(/(mp3|wav|ogg|m4a)$/)) return 'audiotrack'

  return 'insert_drive_file'
})
</script>

<style scoped>
.explorer-item {
  width: 130px;
  min-height: 135px;
  text-align: center;
  cursor: pointer;
  padding: 12px;
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
  margin-top: 8px;
  font-size: 13px;
  word-break: break-word;
}
</style>
