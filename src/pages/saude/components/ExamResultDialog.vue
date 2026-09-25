<template>
  <q-dialog v-model="open" persistent>
    <s-modal-card
      :title="`${tdc('Record result')} - ${schema?.exam || ''}`"
      icon="edit_note"
      width="720px"
      form
      data-test="exam-result-dialog"
      @close="open = false"
      @submit="save"
    >
      <div v-if="loading" class="flex flex-center q-pa-lg">
        <q-spinner size="40px" />
      </div>

      <div v-else-if="schema">
        <div class="row q-col-gutter-sm q-mb-md text-caption">
          <div class="col-12 col-sm-6">{{ tdc('Patient') }}: <b>{{ schema.patient || '-' }}</b></div>
          <div class="col-12 col-sm-6">{{ tdc('Collected') }}: <b>{{ formatDate(schema.collected_at) }}</b></div>
        </div>

        <div v-if="schema.result" class="q-mb-sm" data-test="exam-result-status">
          <q-badge outline color="primary" class="q-mr-xs" :label="`${tdc('Revision')} ${schema.result.revision}`" />
          <q-badge :color="schema.result.validated ? 'positive' : 'grey'" class="q-mr-xs"
                   :label="tdc(schema.result.validated ? 'Validated' : 'Not validated')" />
          <q-badge v-if="schema.result.released" color="info" :label="tdc('Released')" />
        </div>

        <q-banner v-if="locked" dense rounded class="q-mb-md bg-grey-3 text-dark">
          {{ tdc('This result is validated and cannot be changed. Amend it to create a new revision.') }}
        </q-banner>

        <div v-if="!schema.parameters.length" class="text-grey-7 q-mb-md" data-test="exam-result-no-parameters">
          {{ tdc('This exam has no parameters configured. Record the observation and the report.') }}
        </div>

        <div v-for="p in schema.parameters" :key="p.code" class="q-mb-sm" :data-test="`exam-param-${p.code}`">
          <s-select
            v-if="p.data_type === 'choice'"
            v-model="values[p.code]"
            :label="labelOf(p)"
            :options="p.choices"
            :readonly="locked"
            :error="!!errors[p.code]"
            :error-message="errors[p.code]"
            clearable
          />
          <s-toggle
            v-else-if="p.data_type === 'boolean'"
            v-model="values[p.code]"
            :label="labelOf(p)"
            :disable="locked"
          />
          <s-input
            v-else
            v-model="values[p.code]"
            :label="labelOf(p)"
            :type="p.data_type === 'text' ? 'textarea' : 'text'"
            :inputmode="isNumeric(p) ? 'decimal' : undefined"
            :suffix="p.unit || undefined"
            :hint="referenceText(p.reference)"
            :readonly="locked"
            :error="!!errors[p.code]"
            :error-message="errors[p.code]"
          >
            <template v-if="p.value?.flag" #append>
              <q-badge :color="flagColor(p.value.flag)" :label="tdc(flagLabel(p.value.flag))" />
            </template>
          </s-input>
        </div>

        <s-input v-model="observacao" :label="tdc('Observation')" type="textarea" autogrow :readonly="locked" class="q-mt-md" />
        <s-input v-model="laudo" :label="tdc('Report')" type="textarea" autogrow :readonly="locked" />
      </div>

      <template #footer>
        <s-btn flat :label="tdc('Close')" @click="open = false" />
        <s-btn
          v-if="canRun('validate')"
          flat color="positive" icon="verified" :label="tdc('Validate')"
          :loading="running === 'validate'" data-test="exam-result-validate"
          @click="runResultAction('validate')"
        />
        <s-btn
          v-if="canRun('release')"
          flat color="info" icon="publish" :label="tdc('Release')"
          :loading="running === 'release'" data-test="exam-result-release"
          @click="runResultAction('release')"
        />
        <s-btn
          v-if="canRun('amend')"
          flat color="warning" icon="history_edu" :label="tdc('Amend')"
          :loading="running === 'amend'" data-test="exam-result-amend"
          @click="amend"
        />
        <s-btn
          v-if="!locked"
          color="primary"
          icon="save"
          type="submit"
          :label="tdc('Save result')"
          :loading="saving"
          data-test="exam-result-save"
        />
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
// Dynamic result form of one exam item: built from the exam's parameters
// (GET .../result_form/), saved with POST .../record_result/. The backend
// decides which parameters exist and validates every value; field errors
// come back in error.details and are shown on their field.
import { computed, ref, watch } from 'vue'
import { HTTPAuth, url, tdc, sDialog, useUserStore } from 'quasar_resaas'

const props = defineProps({
  modelValue: Boolean,
  itemId: { type: [String, Number], default: null }
})
const emit = defineEmits(['update:modelValue', 'saved', 'changed'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const schema = ref(null)
const values = ref({})
const errors = ref({})
const observacao = ref(null)
const laudo = ref(null)
const loading = ref(false)
const saving = ref(false)

const locked = computed(() => !!schema.value?.result?.validated)

// Result lifecycle (saude/views/resultadoexamemedico.py): validate, release
// and amend each have their own permission and are only offered in the state
// the backend accepts them - the backend enforces both (403 / 409).
const User = useUserStore()
const running = ref(null)
const LIFECYCLE = {
  validate: (r) => !r.validated,
  release: (r) => r.validated && !r.released,
  amend: (r) => r.validated
}

function canRun (action) {
  const result = schema.value?.result
  return !!result && LIFECYCLE[action](result) && User.can(`${action}_resultadoexamemedico`)
}

async function runResultAction (action, body = {}) {
  running.value = action
  try {
    await HTTPAuth.post(
      url({ type: 'u', url: `saude/resultadoexamemedicos/${schema.value.result.id}/${action}/` }), body
    )
    await load()
    emit('changed', action)
  } finally {
    running.value = null
  }
}

function amend () {
  sDialog({
    title: tdc('Amend'),
    message: tdc('A new revision is created from this one; it must be validated and released again.'),
    icon: 'history_edu',
    cancel: true,
    prompt: { model: '', type: 'textarea', label: tdc('Reason'), isValid: (v) => !!v?.trim() }
  }).onOk((reason) => runResultAction('amend', { reason }))
}

const FLAGS = {
  low: ['Low', 'warning'],
  high: ['High', 'warning'],
  normal: ['Normal', 'positive'],
  critical_low: ['Critical low', 'negative'],
  critical_high: ['Critical high', 'negative']
}

function isNumeric (p) { return p.data_type === 'decimal' || p.data_type === 'integer' }
function labelOf (p) { return `${tdc(p.name)}${p.required ? ' *' : ''}` }
function flagLabel (flag) { return (FLAGS[flag] || [flag])[0] }
function flagColor (flag) { return (FLAGS[flag] || [null, 'grey'])[1] }
function referenceText (ref) {
  if (!ref) return undefined
  const range = [ref.low, ref.high].filter((v) => v !== null && v !== undefined).join(' - ')
  return `${tdc('Reference')}: ${range}${ref.label ? ` (${ref.label})` : ''}`
}
function formatDate (iso) { return iso ? new Date(iso).toLocaleString() : '-' }

function endpoint (suffix) {
  return url({ type: 'u', url: `saude/itempedidoexamemedicos/${props.itemId}/${suffix}/` })
}

function applySchema (data) {
  schema.value = data
  errors.value = {}
  values.value = Object.fromEntries(
    (data.parameters || []).map((p) => [p.code, p.value ? toInput(p, p.value.value) : null])
  )
}

function toInput (p, value) {
  if (p.data_type === 'boolean') return value === 'Yes'
  return value
}

async function load () {
  if (!props.itemId) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(endpoint('result_form'))
    applySchema(data)
  } finally {
    loading.value = false
  }
}

async function save () {
  saving.value = true
  errors.value = {}
  try {
    const { data } = await HTTPAuth.post(endpoint('record_result'), {
      values: values.value,
      observacao: observacao.value,
      laudo: laudo.value
    })
    applySchema(data)
    emit('saved', data)
  } catch (error) {
    // field errors stay on their fields; the message goes through the
    // normal alert funnel (services/api interceptor)
    const details = error?.response?.data?.error?.details || {}
    errors.value = Object.fromEntries(
      Object.entries(details).map(([code, messages]) => [code, tdc([].concat(messages)[0])])
    )
  } finally {
    saving.value = false
  }
}

watch(() => [props.modelValue, props.itemId], ([isOpen]) => { if (isOpen) load() }, { immediate: true })
</script>
