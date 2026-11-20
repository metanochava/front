<template>
  <!-- a record's page (the view_<model> routes): a header with the record and
       its actions, and tabs - the record's own fields, then the records of
       related models that point at it, then any tab the page adds through a
       `tab-<name>` slot. The same layout as the employee's profile page. -->
  <q-page class="q-pa-sm">
    <div v-if="loading && !row" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>

    <div v-else-if="!row" class="q-pa-lg text-grey-7 text-center" data-test="record-not-found">
      {{ tdc('Record not found.') }}
    </div>

    <template v-else>
      <!-- HEADER -->
      <s-card class="q-mb-md">
        <q-card-section class="row items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="72px" color="primary" text-color="white">
              <img v-if="photo" :src="photo" />
              <q-icon v-else-if="icon" :name="icon" />
              <span v-else>{{ initials }}</span>
            </q-avatar>
          </div>

          <div class="col">
            <div class="text-h6" data-test="record-title">{{ titleText }}</div>
            <div v-if="subtitleText" class="text-subtitle2 text-grey-8">{{ subtitleText }}</div>
            <div class="text-caption text-grey-6">{{ tdc(modelLabel) }}</div>
          </div>

          <div v-if="statusText" class="col-auto">
            <q-badge :color="statusColor" class="q-pa-sm text-weight-bold">{{ tdc(statusText) }}</q-badge>
          </div>

          <div class="col-auto row no-wrap q-gutter-xs">
            <slot name="header-actions" :row="row" :reload="load" />
            <s-btn v-if="canPdf" flat round icon="picture_as_pdf" data-test="record-pdf" @click="openPdf">
              <s-tooltip>{{ tdc('Pdf') }}</s-tooltip>
            </s-btn>
            <s-btn v-if="canChange" flat round icon="edit" data-test="record-edit" @click="showForm = true">
              <s-tooltip>{{ tdc('Edit') }}</s-tooltip>
            </s-btn>
            <s-btn flat round icon="refresh" :loading="loading" @click="load">
              <s-tooltip>{{ tdc('Reload') }}</s-tooltip>
            </s-btn>
          </div>
        </q-card-section>
      </s-card>

      <!-- TABS -->
      <s-card>
        <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary" no-caps
                outside-arrows mobile-arrows>
          <q-tab v-for="t in visibleTabs" :key="t.name" :name="t.name" :icon="t.icon" :label="tdc(t.label)"
                 :data-test="`record-tab-${t.name}`" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel v-for="t in visibleTabs" :key="t.name" :name="t.name" class="q-pa-md">
            <slot v-if="t.slot" :name="`tab-${t.name}`" :row="row" :reload="load" />
            <template v-else-if="t.person">
              <PersonProfilePanel v-if="people[t.person]" :person="people[t.person]" />
              <div v-else class="text-grey-6 q-pa-md">{{ tdc('No person linked.') }}</div>
            </template>
            <s-form v-else-if="t.name === 'details'" :store="store" :ignoreFields="ignoreFields" readonly />
            <ActionRows v-else-if="t.action" :endpoint="endpoint" :id="id" :action="t.action" :columns="t.columns || []" />
            <RelatedTable v-else :app="t.app || app" :model="t.model" :fk="t.fk" :parent-id="id" />
          </q-tab-panel>
        </q-tab-panels>
      </s-card>
    </template>

    <s-form-modal v-model="showForm" :store="store" :schema="schema" :ignoreFields="ignoreFields" @saved="onSaved" />
    <s-pdf-render v-model="showPdf" :src="pdfUrl" title="Document" :top="false" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  tdc, HTTPAuth, HTTPAuthBlob, url, buildFormFromSchema, resolvePdfDetailEndpoint, pdfBlobUrl, useUserStore,
  PersonProfilePanel
} from 'quasar_resaas'
import RelatedTable from './RelatedTable.vue'
import ActionRows from './ActionRows.vue'
import { applyFieldAccess } from './fieldAccess'

const props = defineProps({
  app: { type: String, required: true },
  model: { type: String, required: true },
  id: { type: [String, Number], required: true },
  // tabs after "Details": {name, label, icon, person: '<field>', permission?}
  // (the Person of that field, in the same panel as the employee's), or
  // {name, label, icon, model, fk, app?, permission?}
  // (a related model's records where <fk> = this record), {name, label, icon,
  // action, columns, permission} (the rows of this record's GET action, e.g.
  // history), or {name, label, icon, slot: true, permission?} filled by the
  // `tab-<name>` slot.
  // A related tab needs list_<model> unless it names its own permission.
  tabs: { type: Array, default: () => [] },
  // which tab opens first (default: the first one)
  defaultTab: { type: String, default: null },
  title: { type: Function, default: null },
  subtitle: { type: Function, default: null },
  photo: { type: Function, default: null },
  icon: { type: String, default: null },
  statusField: { type: String, default: 'status' },
  ignoreFields: { type: Array, default: () => ['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'] }
})

const emit = defineEmits(['loaded'])

const route = useRoute()
const router = useRouter()
const User = useUserStore()

const schema = ref(null)
const row = ref(null)
const loading = ref(false)
const showForm = ref(false)
const showPdf = ref(false)
const pdfUrl = ref(null)
const store = reactive({ fields: [], app: props.app, model: props.model, form: null, row: null, safeUrl: '' })
// the Person of each person tab's field, loaded with the record
const people = reactive({})

const endpoint = computed(() => schema.value?.model?.endpoint || `${props.app}/${props.model.toLowerCase()}s/`)
const modelName = computed(() => props.model.toLowerCase())
const modelLabel = computed(() => schema.value?.model?.label || props.model)

const can = (perm) => !!perm && User.can(String(perm).toLowerCase())
const canChange = computed(() => can(schema.value?.permissions?.change || `change_${modelName.value}`))
const canPdf = computed(() => !!schema.value?.pdf?.detail && (!schema.value.pdf.detail_permission ||
  can(schema.value.pdf.detail_permission)))

const allTabs = computed(() => [{ name: 'details', label: 'Details', icon: 'info' }, ...props.tabs])
const visibleTabs = computed(() => allTabs.value.filter(t => {
  if (t.permission) return can(t.permission)
  if (t.model) return can(`list_${t.model.toLowerCase()}`)
  return true
}))

// the tab survives a reload (?tab=) and falls back when it is not allowed
const tab = ref(route.query.tab || props.defaultTab || null)
watch(visibleTabs, (tabs) => {
  if (!tabs.some(t => t.name === tab.value)) tab.value = (props.defaultTab && tabs.some(t => t.name === props.defaultTab))
    ? props.defaultTab : tabs[0]?.name
}, { immediate: true })
watch(tab, (value) => {
  if (value && route.query.tab !== value) router.replace({ query: { ...route.query, tab: value } })
})

const labelOf = (value) => (value && typeof value === 'object') ? (value.label ?? value.value ?? '') : (value ?? '')
const titleText = computed(() => {
  if (!row.value) return ''
  const fromProp = props.title?.(row.value)
  if (fromProp) return fromProp
  const label = row.value.label
  return (label && label !== 'None') ? label : String(row.value.id)
})
const subtitleText = computed(() => (row.value && props.subtitle?.(row.value)) || '')
const firstPerson = computed(() => Object.values(people).find(Boolean) || null)
const photo = computed(() => (row.value && props.photo?.(row.value)) ||
  firstPerson.value?.photo?.url || firstPerson.value?.profile?.url || null)
const initials = computed(() => titleText.value.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase())
const statusText = computed(() => row.value ? labelOf(row.value[props.statusField]) : '')
const statusColor = computed(() => {
  const value = row.value?.[props.statusField]
  const key = String((value && typeof value === 'object') ? value.value : value || '').toLowerCase()
  return ({
    active: 'positive', open: 'positive', paid: 'positive', present: 'positive', completed: 'primary',
    pending: 'warning', planned: 'warning', draft: 'warning', suspended: 'orange', late: 'orange',
    cancelled: 'negative', inactive: 'grey', closed: 'grey', transferred: 'grey', absent: 'negative'
  })[key] || 'grey'
})

async function load () {
  loading.value = true
  try {
    if (!schema.value) {
      const data = await buildFormFromSchema({ app: props.app, model: props.model })
      schema.value = data.schema
      store.fields = applyFieldAccess(data.fields, perm => User.can(perm))
      store.safeUrl = endpoint.value.replace(/\/+$/, '')
    }
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `${endpoint.value}${props.id}/` }))
    row.value = data
    store.form = data
    store.row = data
    await loadPeople(data)
    emit('loaded', data)
  } catch {
    row.value = null
  } finally {
    loading.value = false
  }
}

async function loadPeople (data) {
  for (const t of props.tabs.filter(t => t.person)) {
    people[t.person] = null
    const value = data?.[`${t.person}_id`] ?? data?.[t.person]
    const personId = (value && typeof value === 'object') ? value.id : value
    if (!personId || !can(t.permission || 'view_person')) continue
    try {
      people[t.person] = (await HTTPAuth.get(url({ type: 'u', url: `django_resaas/persons/${personId}/` }))).data
    } catch {
      people[t.person] = null
    }
  }
}

async function openPdf () {
  const pdfEndpoint = resolvePdfDetailEndpoint(schema.value, row.value)
  if (!pdfEndpoint) return
  pdfUrl.value = pdfBlobUrl(await HTTPAuthBlob.get(url({ type: 'u', url: pdfEndpoint })))
  showPdf.value = true
}

async function onSaved () {
  showForm.value = false
  await load()
}

watch(() => props.id, load)
onMounted(load)

defineExpose({ reload: load })
</script>
