<template>
  <!-- a stored file shown in place: image, PDF, video, audio or text; any other
       type offers the download. Full screen (s-modal-card), only the body scrolls -->
  <q-dialog :model-value="modelValue" full-width full-height @update:model-value="v => emit('update:modelValue', v)">
    <s-modal-card :title="name || tdc('Preview')" :icon="icon" fullscreen flush data-test="file-preview" @close="close">
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
          <s-btn v-if="url" class="q-mt-md" color="primary" icon="download" :label="tdc('Download')" :href="url" :download="name || true" />
        </div>
      </div>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// The file of a result (resultadoexamemedico) - or any stored file object
// {url, mime_type, extensao, nome/name} - previewed by its type. The URL is
// the stored media file the API already returned (view_resultadoexamemedico
// to list it); nothing else is fetched.
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // an explorer item: { file: <url or {url, mime_type}>, mime_type, extensao, nome, filename }
  file: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const IMAGE = /^(png|jpe?g|gif|webp|bmp|svg|avif)$/
const VIDEO = /^(mp4|webm|ogv|mov)$/
const AUDIO = /^(mp3|wav|ogg|oga|m4a|aac)$/
const TEXT = /^(txt|csv|json|xml|log|md)$/

const url = computed(() => {
  const value = props.file?.file
  const raw = typeof value === 'string' ? value : value?.url
  // https page: never load an http file (mixed content is blocked)
  return raw && window.location.protocol === 'https:' ? raw.replace(/^http:\/\//, 'https://') : raw || null
})

// the name the user gave (nome) before the stored one (a generated uuid)
const name = computed(() => props.file?.nome || props.file?.filename || props.file?.file?.name || '')

const extension = computed(() => {
  const ext = props.file?.extensao || (name.value.includes('.') ? name.value.split('.').pop() : '')
  return String(ext || '').replace(/^\./, '').toLowerCase()
})

const mime = computed(() => String(props.file?.mime_type || props.file?.file?.mime_type || '').toLowerCase())

const kind = computed(() => {
  if (!url.value) return 'none'
  if (mime.value.startsWith('image/') || IMAGE.test(extension.value)) return 'image'
  if (mime.value === 'application/pdf' || extension.value === 'pdf') return 'pdf'
  if (mime.value.startsWith('video/') || VIDEO.test(extension.value)) return 'video'
  if (mime.value.startsWith('audio/') || AUDIO.test(extension.value)) return 'audio'
  if (mime.value.startsWith('text/') || TEXT.test(extension.value)) return 'text'
  return 'other'
})

const icon = computed(() => ({
  image: 'image', pdf: 'picture_as_pdf', video: 'movie', audio: 'audiotrack', text: 'description',
}[kind.value] || 'insert_drive_file'))

const close = () => emit('update:modelValue', false)
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
