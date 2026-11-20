<template>
  <!-- add_<model> / change_<model>/:id of a model with no form page of its
       own: the schema's form (s-form) over a store whose safeUrl is the
       model's endpoint - the same pieces as the list's "New"/"Edit" modal,
       as a page. The backend authorizes and validates everything. -->
  <q-page class="q-pa-sm" data-test="record-form-page">
    <div class="row items-center q-mb-sm">
      <q-icon :name="icon || (isEdit ? 'edit_note' : 'add_box')" size="24px" class="q-mr-sm" />
      <div class="text-h6" data-test="record-form-title">{{ title }}</div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <!-- the endpoint does not take this write (schema.operations), or the
         profile may not do it: no form that would be refused -->
    <s-card v-else-if="!allowed" flat bordered class="q-pa-lg text-center" data-test="record-form-unavailable">
      <q-icon name="block" size="40px" color="grey-6" />
      <div class="q-mt-sm">{{ tdc(unavailableText) }}</div>
      <s-btn flat color="primary" icon="arrow_back" :label="tdc('Back to the list')" class="q-mt-md" @click="toList">
        <s-tooltip>{{ tdc('Back to the list') }}</s-tooltip>
      </s-btn>
    </s-card>

    <s-card v-else flat bordered class="q-pa-md">
      <s-form ref="formRef" :store="store" :ignore-fields="ignoreFields" @saved="onSaved" />
      <div class="row justify-end q-gutter-sm q-mt-md">
        <s-btn flat :label="tdc('Cancel')" data-test="record-form-cancel" @click="back">
          <s-tooltip>{{ tdc('Leave without saving') }}</s-tooltip>
        </s-btn>
        <s-btn unelevated color="primary" icon="save" :label="tdc('Save')" :loading="formRef?.saving" data-test="record-form-save" @click="save">
          <s-tooltip>{{ tdc('Save the record') }}</s-tooltip>
        </s-btn>
      </div>
    </s-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, HTTPAuth, url, buildFormFromSchema, useUserStore } from 'quasar_resaas'
import { applyFieldAccess } from './fieldAccess'

const props = defineProps({
  app: { type: String, required: true },
  model: { type: String, required: true },
  // the record to change; none = a new one
  id: { type: String, default: null },
  label: { type: String, default: '' },
  icon: { type: String, default: null },
  ignoreFields: { type: Array, default: () => ['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'] }
})

const router = useRouter()
const User = useUserStore()

const schema = ref(null)
const loading = ref(false)
const formRef = ref(null)
const store = reactive({ fields: [], app: props.app, model: props.model, form: null, row: null, safeUrl: '' })

const isEdit = computed(() => Boolean(props.id))
const modelName = computed(() => props.model.toLowerCase())
const endpoint = computed(() => schema.value?.model?.endpoint || `${props.app}/${modelName.value}s/`)
const modelLabel = computed(() => props.label || schema.value?.model?.label || props.model)
const title = computed(() => `${tdc(isEdit.value ? 'Edit' : 'New')} ${tdc(modelLabel.value)}`)

const can = (perm) => !!perm && User.can(String(perm).toLowerCase())
const operation = computed(() => (isEdit.value ? 'update' : 'create'))
const permission = computed(() => isEdit.value
  ? (schema.value?.permissions?.change || `change_${modelName.value}`)
  : (schema.value?.permissions?.add || `add_${modelName.value}`))
const acceptsWrite = computed(() => schema.value?.operations?.[operation.value] !== false)
const allowed = computed(() => acceptsWrite.value && can(permission.value))
const unavailableText = computed(() => acceptsWrite.value
  ? 'Your profile cannot do this.'
  : (isEdit.value ? 'These records cannot be changed here.' : 'These records cannot be created here.'))

async function load () {
  loading.value = true
  try {
    if (!schema.value) {
      const data = await buildFormFromSchema({ app: props.app, model: props.model })
      schema.value = data.schema
      store.fields = applyFieldAccess(data.fields, perm => User.can(perm))
      store.safeUrl = endpoint.value.replace(/\/+$/, '')
    }
    if (props.id) {
      const { data } = await HTTPAuth.get(url({ type: 'u', url: `${endpoint.value}${props.id}/` }))
      store.form = data
      store.row = data
    } else {
      store.form = {}
      store.row = null
    }
  } finally {
    loading.value = false
  }
}

function routeExists (name) {
  return router.hasRoute(name)
}

function toList () {
  router.push({ name: `list_${modelName.value}` })
}

function back () {
  if (window.history.length > 1) router.back()
  else toList()
}

function save () {
  if (allowed.value) formRef.value?.save?.()
}

// after saving: the record's page when there is one, else the list
function onSaved (data) {
  const id = data?.id || props.id
  const view = `view_${modelName.value}`
  if (id && routeExists(view) && can(`view_${modelName.value}`)) router.push({ name: view, params: { id } })
  else toList()
}

onMounted(load)
watch(() => [props.model, props.id], () => { schema.value = props.model === store.model ? schema.value : null; store.model = props.model; load() })
</script>
