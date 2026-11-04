<template>
  <!-- The column browser (like macOS Finder's columns): the root, then one
       column per open folder of the path, then - when a file is selected - its
       preview. A click on a folder opens it in the next column (the explorer's
       current folder: new folder / upload go there); a click on a file selects
       it and shows its preview; a double click on a file opens its modal. -->
  <div ref="scroller" class="explorer-columns" data-test="explorer-columns">
    <div v-for="(column, level) in columns" :key="column.key" class="explorer-columns__column" :data-test="`explorer-column-${level}`">
      <div v-if="column.loading" class="flex flex-center q-pa-md"><q-spinner color="primary" size="24px" /></div>
      <q-list v-else dense>
        <q-item
          v-for="item in column.items"
          :key="item.id"
          clickable
          dense
          class="explorer-columns__item"
          :class="{
            'explorer-columns__item--open': isOpen(level, item),
            'explorer-columns__item--selected': selected?.id === item.id && !isFolder(item)
          }"
          :data-test="`explorer-column-item-${item.id}`"
          @click="click(level, item)"
          @dblclick="!isFolder(item) && $emit('open-file', item)"
        >
          <q-item-section avatar class="explorer-columns__avatar">
            <FileThumb :item="item" size="22px" :previews="false" />
          </q-item-section>
          <q-item-section class="explorer-columns__name">{{ shortFileName(item, 30) }}</q-item-section>
          <q-item-section v-if="isFolder(item)" side><q-icon name="chevron_right" size="18px" /></q-item-section>
          <s-tooltip>{{ fullFileName(item) }}</s-tooltip>
        </q-item>
        <q-item v-if="!column.items.length">
          <q-item-section class="text-grey-6 text-caption">{{ tdc('This folder is empty') }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- the selected file: its preview and details -->
    <div v-if="previewItem" class="explorer-columns__preview q-pa-md" data-test="explorer-column-preview">
      <div class="explorer-columns__preview-thumb cursor-pointer" @dblclick="$emit('open-file', previewItem)">
        <FileThumb :item="previewItem" size="220px" width="100%" framed />
        <s-tooltip>{{ tdc('Double click to open') }}</s-tooltip>
      </div>
      <div class="text-subtitle2 q-mt-md ellipsis">{{ shortFileName(previewItem, 40) }}</div>
      <div class="text-caption text-grey-7">
        {{ fileExtension(previewItem).toUpperCase() }}<template v-if="previewItem.size_human"> · {{ previewItem.size_human }}</template>
      </div>
      <div class="text-caption text-grey-7">{{ formatDate(previewItem.updated_at || previewItem.created_at) }}</div>
      <s-btn class="q-mt-md" unelevated no-caps color="primary" icon="visibility" :label="tdc('Open')" @click="$emit('open-file', previewItem)">
        <s-tooltip>{{ tdc('Open the file') }}</s-tooltip>
      </s-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import FileThumb from './FileThumb.vue'
import { fullFileName, shortFileName, fileExtension } from './fileKind'

const props = defineProps({
  // the explorer's path (store.caminho): the open folders, root first
  path: { type: Array, default: () => [] },
  // the current folder's contents (the last column: store.pastas / ficheiros)
  folders: { type: Array, default: () => [] },
  files: { type: Array, default: () => [] },
  selected: { type: Object, default: null },
  paciente: { type: String, default: null }
})
const emit = defineEmits(['select', 'open-folder-at', 'open-file'])

const isFolder = (item) => (item.tipo?.id ?? item.tipo) === 'Folder'

// contents of the folders before the current one (read only: the same
// explorer endpoint, never the store's current folder), by folder id ('' = root)
const contents = reactive({})
const loadingIds = reactive({})

async function loadContents (folderId) {
  const key = folderId || ''
  if (contents[key] || loadingIds[key] || !props.paciente) return
  loadingIds[key] = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/resultadoexamemedicos/explorer/',
      params: { pai: folderId || undefined, paciente: props.paciente }
    }))
    const rows = data?.data || data || []
    // folders first, then files (as the explorer)
    contents[key] = [...rows.filter(isFolder), ...rows.filter((r) => !isFolder(r))]
  } finally {
    loadingIds[key] = false
  }
}

const columns = computed(() => {
  const list = []
  // the ancestors: root, then every open folder but the last
  for (let level = 0; level < props.path.length; level++) {
    const key = level === 0 ? '' : props.path[level - 1].id
    list.push({ key: `c-${key}`, items: contents[key] || [], loading: !contents[key] })
  }
  // the current folder, kept up to date by the store (rename, upload, delete)
  list.push({ key: `c-${props.path.at(-1)?.id || ''}`, items: [...props.folders, ...props.files], loading: false })
  return list
})

// the folder open in a column is the next step of the path
function isOpen (level, item) {
  return isFolder(item) && props.path[level]?.id === item.id
}

const previewItem = computed(() => (props.selected && !isFolder(props.selected) && columns.value.at(-1).items.some((i) => i.id === props.selected.id)) ? props.selected : null)

function click (level, item) {
  if (isFolder(item)) emit('open-folder-at', level, item)
  else emit('select', item)
}

const scroller = ref(null)

// the ancestors' contents, and the newest column brought into view
watch(() => [props.paciente, props.path.map((f) => f.id).join('/')], async () => {
  for (let level = 0; level < props.path.length; level++) loadContents(level === 0 ? null : props.path[level - 1].id)
  await nextTick()
  if (scroller.value) scroller.value.scrollLeft = scroller.value.scrollWidth
}, { immediate: true })

// after a change in the explorer (new folder, rename, delete) the ancestors reload
function reset () {
  Object.keys(contents).forEach((key) => { delete contents[key] })
  for (let level = 0; level < props.path.length; level++) loadContents(level === 0 ? null : props.path[level - 1].id)
}

const formatDate = (value) => ds(value)

defineExpose({ reset })
</script>

<style scoped>
.explorer-columns {
  display: flex;
  min-height: 500px;
  max-height: 70vh;
  overflow-x: auto;
  overflow-y: hidden;
}
.explorer-columns__column {
  flex: 0 0 240px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
  padding: 4px;
}
.explorer-columns__item { border-radius: 6px; min-height: 30px; }
.explorer-columns__avatar { min-width: 30px; padding-right: 6px; }
.explorer-columns__name { white-space: nowrap; overflow: hidden; }
.explorer-columns__item--open { background: #e3f2fd; }
.explorer-columns__item--selected { background: #2563eb; color: #fff; }
.explorer-columns__preview {
  flex: 1 0 300px;
  text-align: center;
  overflow-y: auto;
}
.explorer-columns__preview-thumb { max-width: 320px; margin: 0 auto; }
</style>
