<template>
  <!-- A stored result file: what was entered with it (exam_values) takes most
       of the modal; the file is the shared preview card beside it
       (FilePreviewCard: a click opens it full screen, rendered by type). -->
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
          <!-- the shared file preview (quasar_resaas s-file-preview / FilePreviewCard):
               a thumbnail card; a click opens it full screen, rendered by type -->
          <FilePreviewCard :file="file">
            <template #empty>
              <s-card flat bordered class="q-pa-md text-center text-grey-7" data-test="file-preview-no-file">
                <q-icon name="attach_file" size="48px" color="grey-5" />
                <div class="q-mt-sm">{{ tdc('No file was attached to this result.') }}</div>
              </s-card>
            </template>
          </FilePreviewCard>
        </div>
      </div>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// The file of a result (resultadoexamemedico) - or any stored file object
// {url, mime_type, extensao, nome/name} - with its exam values; the file is
// the shared FilePreviewCard (rendered by type in its own modal). The URL is
// the stored media file the API already returned (view_resultadoexamemedico
// to list it); nothing else is fetched.
import { computed, ref, watch } from 'vue'
import { tdc, url as apiUrl, HTTPAuth, FilePreviewCard } from 'quasar_resaas'
import ResultValuesCard from './ResultValuesCard.vue'
import { fileName } from './fileKind'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // an explorer item: { file: <url or {url, mime_type}>, mime_type, extensao, nome, filename }
  file: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const name = computed(() => fileName(props.file))

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

const close = () => emit('update:modelValue', false)
</script>
