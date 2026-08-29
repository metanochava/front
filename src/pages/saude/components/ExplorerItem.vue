<template>
  <div
    class="explorer-item"
    :class="{ selected: selected?.id === item.id }"
    @click="$emit('select', item)"
    @dblclick="$emit('open', item)"
  >
    <q-icon
      :name="icon"
      :color="item.tipo === 'Folder' ? 'amber-8' : 'primary'"
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

const icon = computed(() => {
  if (props.item.tipo === 'Folder') return 'folder'

  const f = (props.item.file || props.item.nome || '').toLowerCase()

  if (f.endsWith('.pdf')) return 'picture_as_pdf'
  if (f.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) return 'image'
  if (f.match(/\.(doc|docx)$/)) return 'description'
  if (f.match(/\.(xls|xlsx)$/)) return 'table_view'
  if (f.match(/\.(zip|rar|7z)$/)) return 'folder_zip'

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
