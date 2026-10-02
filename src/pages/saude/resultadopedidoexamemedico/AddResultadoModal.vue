<template>
  <q-dialog v-model="dialog" full-width full-height>
    <s-modal-card :title="tdc('Results')" icon="fact_check" fullscreen @close="dialog = false">
      <div v-if="!Pedidoexamemedico.items.length" class="text-grey-6 text-center q-pa-lg">
        {{ tdc('No exams in this request.') }}
      </div>

      <q-card
        v-for="item in Pedidoexamemedico.items"
        :key="item.id"
        class="q-mb-lg"
        flat
        bordered
        :data-test="`result-item-${item.id}`"
      >
        <q-bar class="bg-grey-2 text-dark">
          <div class="text-subtitle2 text-weight-bold ellipsis">{{ item?.exame?.label }}</div>
          <q-space />
          <q-badge
            v-if="item.resultado?.id"
            :color="item.resultado.validado ? 'positive' : 'grey'"
            class="q-mr-xs"
            :label="tdc(item.resultado.validado ? 'Validated' : 'Not validated')"
          />
          <q-badge
            v-if="item.resultado?.released"
            color="primary"
            class="q-mr-xs"
            :label="tdc('Released')"
          />
          <q-badge :color="item.estado_exame?.id === 'pendente' ? 'orange' : 'positive'">
            {{ item.estado_exame?.label }}
          </q-badge>
        </q-bar>

        <q-card-section>
          <!-- a validated result is read-only: corrections are an amendment (new revision) -->
          <template v-if="item.resultado?.validado">
            <div class="text-caption text-grey-7 q-mb-sm">
              {{ tdc('This result is validated and cannot be changed. Amend it to create a new revision.') }}
            </div>
            <div v-if="item.resultado.valor_resultado"><b>{{ tdc('Result value') }}:</b> {{ item.resultado.valor_resultado }}</div>
            <!-- eslint-disable-next-line vue/no-v-html -- the laboratory's report (s-editor), sanitized -->
            <div v-if="item.resultado.laudo" class="q-mt-sm" v-html="sanitizeClinicalHtml(item.resultado.laudo)" />
            <div v-if="item.resultado.observacao" class="q-mt-sm text-grey-8">{{ plain(item.resultado.observacao) }}</div>
          </template>

          <template v-else>
            <s-input
              v-model="draftOf(item).valor_resultado"
              :label="tdc('Result value')"
              maxlength="200"
              :error="!!errorsOf(item).valor_resultado"
              :error-message="errorsOf(item).valor_resultado"
            />
            <s-editor v-model="draftOf(item).laudo" :label="tdc('Findings')" min-height="120px" class="q-mt-sm" />
            <s-editor v-model="draftOf(item).observacao" :label="tdc('Observation')" min-height="80px" class="q-mt-sm" />
            <s-file v-model="draftOf(item).file" :label="tdc('File')" class="q-mt-sm" />
          </template>

          <div v-if="item.resultado?.file" class="q-mt-sm">
            <q-icon name="attach_file" class="q-mr-xs" />
            <a :href="item.resultado.file" target="_blank" rel="noopener noreferrer">{{ item.resultado.nome || tdc('File') }}</a>
          </div>
        </q-card-section>

        <q-separator />

        <!-- actions of THIS exam (one card per exam, inside the scrolling list) -->
        <q-card-actions align="right">
          <s-btn
            flat
            color="primary"
            icon="edit_note"
            :label="tdc('Record result')"
            data-test="open-structured-result"
            @click="openStructured(item)"
          />
          <s-btn
            v-if="canRun('validate', item)"
            flat
            color="positive"
            icon="verified"
            :label="tdc('Validate')"
            :loading="running === `validate-${item.id}`"
            data-test="result-validate"
            @click="runResultAction(item, 'validate')"
          />
          <s-btn
            v-if="canRun('release', item)"
            flat
            color="primary"
            icon="publish"
            :label="tdc('Release')"
            :loading="running === `release-${item.id}`"
            data-test="result-release"
            @click="runResultAction(item, 'release')"
          />
          <s-btn
            v-if="!item.resultado?.validado"
            color="primary"
            icon="save"
            :label="tdc('Save report')"
            :loading="saving === item.id"
            data-test="save-report"
            @click="saveReport(item)"
          />
        </q-card-actions>
      </q-card>
    </s-modal-card>
  </q-dialog>

  <ExamResultDialog
    v-model="structuredOpen"
    :item-id="structuredItemId"
    @saved="reload"
    @changed="reload"
  />
</template>

<script setup>
// Two ways of entering the result of each exam of a request, both on the SAME
// result record (the item's current revision - saude/services/lab_result_service.py):
// - "Record result": the structured form built from the exam's parameters
//   (ExamResultDialog -> record_result);
// - the free-form report on this card: value, findings, observation, file
//   (record_report).
// Validating and releasing have their own permissions and are offered only in
// the state the backend accepts them; the backend enforces both (403 / 409).
import { computed, reactive, ref, watch } from 'vue'
import { tdc, url, HTTPAuth, useUserStore } from 'quasar_resaas'
import { usePedidoexamemedicoStore } from './../pedidoexamemedico/pedidoexamemedicoStore.js'
import ExamResultDialog from '../components/ExamResultDialog.vue'
import { sanitizeClinicalHtml } from '../components/clinicalHtml'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const Pedidoexamemedico = usePedidoexamemedicoStore()
const User = useUserStore()

// ---------------------------------------------------------------- structured form
const structuredOpen = ref(false)
const structuredItemId = ref(null)
function openStructured (item) {
  structuredItemId.value = item?.id
  structuredOpen.value = true
}

// ---------------------------------------------------------------- free-form report
const drafts = reactive({})
const errors = reactive({})
const saving = ref(null)

function fromResult (resultado) {
  return {
    valor_resultado: resultado?.valor_resultado || '',
    laudo: resultado?.laudo || '',
    observacao: resultado?.observacao || '',
    file: null
  }
}

function draftOf (item) {
  if (!drafts[item.id]) drafts[item.id] = fromResult(item.resultado)
  return drafts[item.id]
}

function errorsOf (item) {
  return errors[item.id] || {}
}

// every (re)load shows what the server has
watch(() => Pedidoexamemedico.items, (items) => {
  for (const item of items || []) drafts[item.id] = fromResult(item.resultado)
}, { immediate: true })

function plain (html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function reload () {
  const pedidoId = Pedidoexamemedico.row?.id
  if (pedidoId) await Pedidoexamemedico.getItemPedido(pedidoId)
}

async function saveReport (item) {
  const draft = draftOf(item)
  const body = new FormData()
  for (const field of ['valor_resultado', 'laudo', 'observacao']) body.append(field, draft[field] ?? '')
  if (draft.file instanceof File) body.append('file', draft.file)

  saving.value = item.id
  errors[item.id] = {}
  try {
    await HTTPAuth.post(url({ type: 'u', url: `saude/itempedidoexamemedicos/${item.id}/record_report/` }), body)
    await reload()
  } catch (error) {
    // field errors stay on their fields; the message goes through the normal
    // alert funnel (services/api interceptor)
    const details = error?.response?.data?.error?.details || {}
    errors[item.id] = Object.fromEntries(
      Object.entries(details).map(([field, messages]) => [field, tdc([].concat(messages)[0])])
    )
  } finally {
    saving.value = null
  }
}

// ---------------------------------------------------------------- lifecycle
const running = ref(null)
const LIFECYCLE = {
  validate: (r) => !r.validado,
  release: (r) => r.validado && !r.released
}

function canRun (action, item) {
  const result = item.resultado
  return !!result?.id && LIFECYCLE[action](result) && User.can(`${action}_resultadoexamemedico`)
}

async function runResultAction (item, action) {
  running.value = `${action}-${item.id}`
  try {
    await HTTPAuth.post(url({ type: 'u', url: `saude/resultadoexamemedicos/${item.resultado.id}/${action}/` }))
    await reload()
  } finally {
    running.value = null
  }
}
</script>
