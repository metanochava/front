<template>
  <div class="explorer-toolbar">
    <div class="row items-center no-wrap q-gutter-x-sm">

      <!-- icon-only actions, each with its tooltip (files view only) -->
      <div v-if="filesView" class="col-auto row items-center no-wrap q-gutter-xs">
        <s-btn round dense flat color="primary" icon="create_new_folder" data-test="explorer-new-folder" @click="$emit('new-folder')">
          <s-tooltip>{{ tdc('New folder') }}</s-tooltip>
        </s-btn>
        <s-btn round dense flat color="primary" icon="attach_file" data-test="explorer-upload" @click="$emit('upload')">
          <s-tooltip>{{ tdc('Upload') }}</s-tooltip>
        </s-btn>
        <s-btn round dense flat color="grey-8" icon="edit" :disable="!selected" data-test="explorer-rename" @click="$emit('rename')">
          <s-tooltip>{{ tdc('Rename') }}</s-tooltip>
        </s-btn>
        <s-btn round dense flat color="negative" icon="delete" :disable="!selected" data-test="explorer-delete" @click="$emit('delete')">
          <s-tooltip>{{ tdc('Delete') }}</s-tooltip>
        </s-btn>
        <s-btn round dense flat color="primary" icon="refresh" data-test="explorer-refresh" @click="$emit('refresh')">
          <s-tooltip>{{ tdc('Update') }}</s-tooltip>
        </s-btn>
      </div>

      <!-- extra info on the same row (e.g. files / folders counts) -->
      <div v-if="$slots.default && filesView" class="col-auto">
        <slot />
      </div>

      <q-space />

      <!-- Files / Data: radio-like pair, before the search (shown when the page binds v-model:view) -->
      <div v-if="view" class="col-auto row no-wrap" data-test="explorer-view">
        <s-btn
          dense no-caps unelevated
          icon="folder"
          :label="tdc('Files')"
          :color="view === 'files' ? 'primary' : 'grey-4'"
          :text-color="view === 'files' ? 'white' : 'grey-9'"
          class="explorer-toolbar__view-left"
          data-test="explorer-view-files"
          @click="$emit('update:view', 'files')"
        >
          <s-tooltip>{{ tdc('Show the files and folders') }}</s-tooltip>
        </s-btn>
        <s-btn
          dense no-caps unelevated
          icon="table_chart"
          :label="tdc('Exam data')"
          :color="view === 'data' ? 'primary' : 'grey-4'"
          :text-color="view === 'data' ? 'white' : 'grey-9'"
          class="explorer-toolbar__view-right"
          data-test="explorer-view-data"
          @click="$emit('update:view', 'data')"
        >
          <s-tooltip>{{ tdc('Show the entered results by parameter') }}</s-tooltip>
        </s-btn>
      </div>

      <!-- placeholder, not a floating label: the row stays as tall as the icons -->
      <!-- the search works in both views (Files: the explorer; Data: the results) -->
      <div class="explorer-toolbar__search">
        <s-input
          v-model="search"
          dense
          outlined
          clearable
          hide-bottom-space
          placeholder="Search results"
          prepend-icon="search"
          @update:model-value="$emit('search', search)"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import { computed, ref } from 'vue'

const props = defineProps({
  selected: {
    type: Object,
    default: null
  },
  // 'files' | 'data' (v-model:view); null hides the Files / Data pair
  view: {
    type: String,
    default: null
  }
})

defineEmits([
  'new-folder',
  'upload',
  'rename',
  'delete',
  'refresh',
  'search',
  'update:view'
])

const search = ref('')

// the buttons and the counts act on the explorer: hidden in "Data"
const filesView = computed(() => props.view !== 'data')
</script>

<style scoped>
.explorer-toolbar {
  padding: 4px 8px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.explorer-toolbar__view-left {
  border-radius: 4px 0 0 4px;
}

.explorer-toolbar__view-right {
  border-radius: 0 4px 4px 0;
}

.explorer-toolbar__search {
  width: 260px;
  max-width: 45%;
}
</style>
