<template>

  <!-- icons / gallery: tiles with a preview; list: a table with name, type,
       size and date (the column browser is ExplorerColumns). Click selects,
       double click opens (folder: enters it; file: its preview modal). -->
  <div v-if="tiles" class="explorer-container" :class="{ 'explorer-container--gallery': mode === 'gallery' }">

    <ExplorerItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :mode="mode"
      :selected="selected"
      @select="$emit('select',$event)"
      @open="open(item)"
    />

    <div v-if="!items.length" class="empty-folder">
      <q-icon name="folder_off" size="90px" color="grey-5" />
      <div class="text-grey-7 text-subtitle1 q-mt-md">{{ tdc('This folder is empty') }}</div>
    </div>

  </div>

  <div v-else class="explorer-rows q-pa-sm">

    <q-markup-table flat dense separator="horizontal" :data-test="`explorer-${mode}`">
      <thead>
        <tr>
          <th class="text-left">{{ tdc('Name') }}</th>
          <th class="text-left gt-xs">{{ tdc('Type') }}</th>
          <th class="text-right gt-xs">{{ tdc('Size') }}</th>
          <th class="text-right">{{ tdc('Modified') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="explorer-row cursor-pointer"
          :class="{ selected: selected?.id === item.id }"
          :data-test="`explorer-row-${item.id}`"
          @click="$emit('select', item)"
          @dblclick="open(item)"
        >
          <td class="explorer-row__name">
            <div class="row items-center no-wrap explorer-row__line">
              <!-- a list row is small: images keep a thumbnail, the rest their icon -->
              <FileThumb :item="item" size="28px" :previews="false" class="explorer-row__thumb" />
              <span>{{ shortFileName(item, 48) }}</span>
            </div>
            <s-tooltip>{{ fullFileName(item) }}</s-tooltip>
          </td>
          <td class="gt-xs text-grey-8">{{ typeLabel(item) }}</td>
          <td class="gt-xs text-right text-grey-8">{{ isFolder(item) ? '' : (item.size_human || '') }}</td>
          <td class="text-right text-grey-8">{{ formatDate(item.updated_at || item.created_at) }}</td>
        </tr>
        <tr v-if="!items.length">
          <td :colspan="4" class="text-center text-grey-7 q-pa-lg">{{ tdc('This folder is empty') }}</td>
        </tr>
      </tbody>
    </q-markup-table>

  </div>

</template>

<script setup>
import { computed } from 'vue'
import { date } from 'quasar'
import { tdc } from 'quasar_resaas'

import ExplorerItem from './ExplorerItem.vue'
import FileThumb from './FileThumb.vue'
import { fullFileName, shortFileName, fileExtension } from './fileKind'

const props = defineProps({

    folders:{
        type:Array,
        default:()=>[]
    },

    files:{
        type:Array,
        default:()=>[]
    },

    selected:{
        type:Object,
        default:null
    },

    // 'icons' | 'gallery' | 'list'
    mode:{
        type:String,
        default:'icons'
    }

})

const emit = defineEmits([
    'select',
    'open-folder',
    'open-file'
])

// folders first, then files (as before)
const items = computed(() => [...props.folders, ...props.files])
const tiles = computed(() => props.mode === 'icons' || props.mode === 'gallery')

const isFolder = (item) => (item.tipo?.id ?? item.tipo) === 'Folder'

function open (item) {
    emit(isFolder(item) ? 'open-folder' : 'open-file', item)
}

function typeLabel (item) {
    if (isFolder(item)) return tdc('Folder')
    const ext = fileExtension(item)
    return ext ? ext.toUpperCase() : tdc('File')
}

const formatDate = (value) => (value ? date.formatDate(value, 'DD/MM/YYYY HH:mm') : '')

</script>

<style scoped>

/* a justified grid: equal columns filling the row edge to edge, the tiles
   of a row the same height, the last row aligned to the same columns (rows
   take their content's height: never stretched to fill the page) */
.explorer-container{

    display:grid;

    grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));

    gap:16px;

    padding:20px;

    align-content:start;

    flex:1;

    overflow:auto;

}

.explorer-container--gallery{

    grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));

}

.explorer-row.selected{

    background:#dbeafe;

}

.explorer-row:hover{

    background:#e3f2fd;

}

.explorer-row__name{

    white-space:nowrap;

    text-align:left;

}

/* the thumbnail at the start of the row, the name right after it (FileThumb
   centres itself in a tile) */
.explorer-row__line{

    gap:8px;

    justify-content:flex-start;

}

.explorer-row__thumb{

    margin:0;

    flex:none;

}

.empty-folder{

    grid-column:1 / -1;

    width:100%;

    padding:60px;

    text-align:center;

}

</style>
