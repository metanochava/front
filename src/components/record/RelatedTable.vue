<template>
  <!-- the records of a related model that point at one parent (?<fk>=<id>):
       the model's own schema table, with the parent column hidden and a new
       record created already attached to the parent -->
  <div>
    <s-auto-table
      v-if="schema"
      v-model:pagination="pagination"
      :app="app"
      :model="model"
      :schema="schema"
      :rows="rows"
      :columns="columns"
      :fields="fields"
      :actions="actions"
      :loading="loading"
      :ignoreFields="hidden"
      :config="config"
      @request="onRequest"
      @create="openCreate"
      @edit="openEdit"
      @delete="onDelete"
      @refresh="load"
      @search="onSearch"
    />

    <s-form-modal
      v-model="showForm"
      :store="store"
      :schema="schema"
      :ignoreFields="hidden"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { debounce } from 'quasar'
import { tdc, HTTPAuth, url, buildFormFromSchema, useUserStore } from 'quasar_resaas'
import { applyFieldAccess } from './fieldAccess'

const props = defineProps({
  app: { type: String, required: true },
  model: { type: String, required: true },
  // the field of `model` that points at the parent, and the parent's id
  fk: { type: String, required: true },
  parentId: { type: [String, Number], required: true },
  ignoreFields: { type: Array, default: () => ['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'] }
})

const User = useUserStore()
const schema = ref(null)
const fields = ref([])
const actions = ref([])
const config = ref({})
const rows = ref([])
const loading = ref(false)
const search = ref('')
const showForm = ref(false)
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: 'id', descending: true })
const store = reactive({ fields: [], app: props.app, model: props.model, form: null, safeUrl: '' })

const hidden = computed(() => [...props.ignoreFields, props.fk])
const endpoint = computed(() => schema.value?.model?.endpoint || `${props.app}/${props.model.toLowerCase()}s/`)

const columns = computed(() => [
  { name: '__actions', label: tdc('Actions'), field: '__lactions', sortable: false, align: 'left' },
  ...fields.value.filter(f => !f.write_only && !hidden.value.includes(f.name))
    .map(f => ({ name: f.name, label: f.label, field: f.name, sortable: true, align: 'left' })),
  { name: '__actions', label: tdc('Actions'), field: '__ractions', sortable: false, align: 'right' }
])

async function init () {
  const data = await buildFormFromSchema({ app: props.app, model: props.model })
  schema.value = data.schema
  fields.value = applyFieldAccess(data.fields, perm => User.can(perm))
  actions.value = data.actions || []
  config.value = data.config || {}
  const ordering = data.schema?.pagination?.default_ordering || '-id'
  Object.assign(pagination.value, {
    rowsPerPage: data.schema?.pagination?.page_size || 10,
    descending: ordering.startsWith('-'),
    sortBy: ordering.replace(/^-/, '')
  })
  Object.assign(store, { fields: fields.value, safeUrl: endpoint.value.replace(/\/+$/, '') })
  await load()
}

async function load () {
  if (!schema.value) return
  loading.value = true
  try {
    const p = pagination.value
    const params = {
      [props.fk]: props.parentId,
      page: p.page,
      page_size: p.rowsPerPage,
      ordering: p.sortBy ? `${p.descending ? '-' : ''}${p.sortBy}` : undefined,
      ...(search.value ? { search: search.value } : {})
    }
    const { data } = await HTTPAuth.get(url({ type: 'u', url: endpoint.value, params }))
    rows.value = data?.results || data || []
    pagination.value.rowsNumber = data?.count ?? rows.value.length
  } catch {
    rows.value = []
    pagination.value.rowsNumber = 0
  } finally {
    loading.value = false
  }
}

function onRequest ({ pagination: value }) {
  Object.assign(pagination.value, value)
  load()
}

const onSearch = debounce((value) => {
  search.value = (value || '').trim()
  pagination.value.page = 1
  load()
}, 300)

function openCreate () {
  store.form = { [props.fk]: props.parentId }
  showForm.value = true
}

function openEdit (row) {
  store.form = row
  showForm.value = true
}

async function onDelete (row) {
  if (!User.can(schema.value?.permissions?.delete)) return
  await HTTPAuth.delete(url({ type: 'u', url: `${endpoint.value}${row.id}/` }))
  await load()
}

async function onSaved () {
  showForm.value = false
  await load()
}

watch(() => props.parentId, () => { pagination.value.page = 1; load() })
onMounted(init)
</script>
