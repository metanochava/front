<template>
  <!-- A stored result file: what was entered with it (exam_values) takes most
       of the modal; the file is a card beside it, and a click on the card
       opens a second, full-screen modal that renders it by type (image, PDF,
       video, audio, text; anything else offers the download). -->
  <q-dialog persistent :model-value="modelValue" @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="values?.exam?.name || name || tdc('Preview')" icon="science" width="1100px" data-test="file-preview" @close="close">
      <div class="row q-col-gutter-md">
        <!-- the information: exam, status, value, report, observation, parameters -->
        <div class="col-12 col-md-8" data-test="file-preview-values">
          <div v-if="loadingValues" class="flex flex-center q-pa-lg"><q-spinner color="primary" size="40px" /></div>
          <ResultValuesCard v-else-if="values?.exam" :row="values" />
          <div v-else class="text-grey-7 q-pa-md">{{ tdc('No exam values were entered with this file.') }}</div>
        </div>

        <!-- the file: click to see it in its own modal -->
        <div class="col-12 col-md-4">
          <s-card
            v-if="url"
            flat bordered
            class="file-preview__file cursor-pointer"
            data-test="file-preview-file"
            @click="viewerOpen = true"
          >
            <!-- a small preview of what the browser can show (image, PDF, text,
                 video, audio); the overlay keeps the click for the full modal -->
            <div class="file-preview__thumb flex flex-center" :data-test="`file-preview-thumb-${kind}`">
              <img v-if="kind === 'image'" :src="url" :alt="name" class="file-preview__thumb-image">
              <iframe v-else-if="kind === 'pdf'" :src="`${url}#toolbar=0&navpanes=0&view=FitH`" class="file-preview__thumb-frame" :title="name" tabindex="-1" />
              <iframe v-else-if="kind === 'text'" :src="url" class="file-preview__thumb-frame" :title="name" tabindex="-1" />
              <video v-else-if="kind === 'video'" :src="url" muted preload="metadata" class="file-preview__thumb-image" />
              <q-icon v-else :name="icon" size="72px" color="primary" />
              <div v-if="kind !== 'audio'" class="file-preview__thumb-overlay" />
            </div>
            <!-- audio: playable right here -->
            <audio v-if="kind === 'audio'" :src="url" controls class="full-width q-px-sm" @click.stop />
            <q-separator />
            <div class="q-pa-sm row items-center no-wrap">
              <div class="col ellipsis text-caption">{{ name }}</div>
              <q-icon name="open_in_full" color="primary" />
            </div>
            <s-tooltip>{{ tdc('Open the file') }}</s-tooltip>
          </s-card>
          <s-card v-else flat bordered class="q-pa-md text-center text-grey-7" data-test="file-preview-no-file">
            <q-icon name="attach_file" size="48px" color="grey-5" />
            <div class="q-mt-sm">{{ tdc('No file was attached to this result.') }}</div>
          </s-card>
        </div>
      </div>
    </s-modal-card>
  </q-dialog>

  <!-- the file itself, full screen; only the body scrolls -->
  <q-dialog v-model="viewerOpen" persistent full-width full-height>
    <s-modal-card :title="name || tdc('Preview')" :icon="icon" fullscreen flush data-test="file-viewer" @close="viewerOpen = false">
      <template #bar-actions>
        <s-btn v-if="url" dense flat round icon="open_in_new" :href="url" target="_blank" rel="noopener">
          <s-tooltip>{{ tdc('Open in a new tab') }}</s-tooltip>
        </s-btn>
        <s-btn v-if="url" dense flat round icon="download" :href="url" :download="name || true">
          <s-tooltip>{{ tdc('Download') }}</s-tooltip>
        </s-btn>
      </template>

      <div class="col file-preview__body" :data-test="`file-preview-${kind}`">
        <img v-if="kind === 'image'" :src="url" :alt="name" class="file-preview__image">
        <iframe v-else-if="kind === 'pdf' || kind === 'text'" :src="url" class="file-preview__frame" :title="name" />
        <video v-else-if="kind === 'video'" :src="url" controls class="file-preview__media" />
        <audio v-else-if="kind === 'audio'" :src="url" controls class="file-preview__audio" />
        <div v-else class="column flex-center q-pa-xl text-center">
          <q-icon name="insert_drive_file" size="64px" color="grey-6" />
          <div class="q-mt-md">{{ tdc('This file cannot be previewed here.') }}</div>
          <s-btn v-if="url" class="q-mt-md" color="primary" icon="download" :label="tdc('Download')" :href="url" :download="name || true">
            <s-tooltip>{{ tdc('Download') }}</s-tooltip>
          </s-btn>
        </div>
      </div>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// The file of a result (resultadoexamemedico) - or any stored file object
// {url, mime_type, extensao, nome/name} - with its exam values; the file is
// rendered by its type in a second modal. The URL is
// the stored media file the API already returned (view_resultadoexamemedico
// to list it); nothing else is fetched.
import { computed, ref, watch } from 'vue'
import { tdc, url as apiUrl, HTTPAuth } from 'quasar_resaas'
import ResultValuesCard from './ResultValuesCard.vue'
import { fileUrl, fileName, fileKind, KIND_ICONS } from './fileKind'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // an explorer item: { file: <url or {url, mime_type}>, mime_type, extensao, nome, filename }
  file: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const url = computed(() => fileUrl(props.file))
const name = computed(() => fileName(props.file))
const kind = computed(() => fileKind(props.file))

const icon = computed(() => KIND_ICONS[kind.value] || 'insert_drive_file')

// the exam, value, report, observation and parameter values entered with the
// file (resultadoexamemedicos/{id}/exam_values/, view_resultadoexamemedico)
const values = ref(null)
const loadingValues = ref(false)

async function loadValues () {
  values.value = null
  if (!props.modelValue || !props.file?.id) return
  loadingValues.value = true
  try {
    const { data } = await HTTPAuth.get(apiUrl({ type: 'u', url: `saude/resultadoexamemedicos/${props.file.id}/exam_values/` }))
    values.value = data
  } catch {
    // the error was already shown by the HTTP funnel: only the file stays
    values.value = null
  } finally {
    loadingValues.value = false
  }
}

watch(() => [props.modelValue, props.file?.id], loadValues, { immediate: true })

// the second modal, with the file rendered
const viewerOpen = ref(false)
watch(() => props.file?.id, () => { viewerOpen.value = false })

const close = () => { viewerOpen.value = false; emit('update:modelValue', false) }
</script>

<style scoped>
.file-preview__body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: auto;
  background: #f4f6f8;
}
.body--dark .file-preview__body { background: #1b1b1b; }
.file-preview__thumb {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: #f4f6f8;
}
.file-preview__thumb-frame {
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
  pointer-events: none;
}
.file-preview__thumb-overlay {
  position: absolute;
  inset: 0;
}
.body--dark .file-preview__thumb { background: #1b1b1b; }
.file-preview__thumb-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.file-preview__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.file-preview__frame {
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
}
.file-preview__media {
  max-width: 100%;
  max-height: 100%;
}
.file-preview__audio { width: min(560px, 90%); }
</style>
