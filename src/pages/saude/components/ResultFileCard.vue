<template>
  <!-- The file attached to a result: its preview (what the browser can show),
       its name, and View (PDF / image, in the modal viewer) / Open (new tab).
       A click on the preview views it too (or opens it when it can't be shown). -->
  <s-card flat bordered data-test="result-file-card">
    <div class="cursor-pointer" @click="preview">
      <FileThumb :item="thumbItem" size="220px" width="100%" framed />
      <s-tooltip>{{ tdc(viewable ? 'View the attached file' : 'Open the attached file') }}</s-tooltip>
    </div>
    <q-separator />
    <div class="row items-center no-wrap q-pa-sm q-gutter-x-xs">
      <q-icon name="attach_file" />
      <div class="col ellipsis text-caption">{{ name }}</div>
      <s-btn v-if="viewable" flat dense round color="primary" icon="visibility" @click="$emit('view')">
        <s-tooltip>{{ tdc('View the attached file') }}</s-tooltip>
      </s-btn>
      <s-btn flat dense round color="primary" icon="open_in_new" :href="file.url" target="_blank" rel="noopener noreferrer">
        <s-tooltip>{{ tdc('Open the attached file') }}</s-tooltip>
      </s-btn>
    </div>
  </s-card>
</template>

<script setup>
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'
import FileThumb from './FileThumb.vue'
import { fileKind } from './fileKind'

const props = defineProps({
  // the exam request item (its resultado holds nome / extensao / mime_type)
  item: { type: Object, required: true },
  // the stored file {url, name, mime_type}
  file: { type: Object, required: true }
})
const emit = defineEmits(['view'])

const thumbItem = computed(() => ({ ...(props.item.resultado || {}), tipo: 'File', file: props.file, mime_type: props.file.mime_type || props.item.resultado?.mime_type }))
const name = computed(() => props.file.name || props.item.resultado?.nome || tdc('File'))
// the modal viewer (s-pdf-render) shows PDFs and images
const viewable = computed(() => ['pdf', 'image'].includes(fileKind(thumbItem.value)))

function preview () {
  if (viewable.value) emit('view')
  else window.open(props.file.url, '_blank', 'noopener')
}
</script>
