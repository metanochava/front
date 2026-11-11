<template>
  <!-- named sets of exams (saude/examsets/): one click adds all of a set's
       exams to the request (nothing is saved until the request is). The
       clinic's sets are everyone's; personal ones only their owner's. The
       content of the "Exam sets" tab of the exam request page; the page's
       search filters it by the set's name or the names of its exams. -->
  <div data-test="exam-sets">
    <div class="q-pa-sm">
      <div v-if="loading" class="flex flex-center q-pa-sm">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="28px" />
      </div>
      <div v-else-if="!sets.length" class="text-caption text-grey-7">
        {{ tdc('No exam sets yet: add exams to the request and save them as a set.') }}
      </div>
      <div v-else-if="!filteredSets.length" class="text-caption text-grey-7" data-test="exam-sets-none-found">
        {{ tdc('No exam set matches the search.') }}
      </div>
      <div v-else class="row q-col-gutter-xs">
        <div v-for="set in filteredSets" :key="set.id" class="col-12 col-sm-6 col-md-4">
          <q-item
            clickable
            dense
            class="exam-set rounded-borders"
            :class="{ 'exam-set--done': allAdded(set) }"
            data-test="exam-set"
            @click="apply(set)"
          >
            <q-item-section avatar style="min-width: 32px">
              <q-icon :name="set.scope === 'entity' ? 'domain' : 'person'" :color="set.scope === 'entity' ? 'primary' : 'teal'" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium ellipsis">
                <s-highlight :text="set.name" :search="search" />
              </q-item-label>
              <q-item-label caption>
                {{ set.exams.length }} {{ tdc(set.exams.length === 1 ? 'exam' : 'exams') }} ·
                {{ tdc(set.scope === 'entity' ? 'Clinic' : 'Mine') }}
              </q-item-label>
              <q-item-label v-if="matchedExams(set).length" caption class="ellipsis" data-test="exam-set-matches">
                <s-highlight :text="matchedExams(set).join(', ')" :search="search" />
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="canEdit(set) || canRemove(set)" side>
              <div class="row no-wrap">
                <s-btn v-if="canEdit(set)" round flat dense size="sm" icon="edit" color="primary" data-test="exam-set-edit" @click.stop="openEdit(set)">
                  <s-tooltip>{{ tdc('Edit this exam set') }}</s-tooltip>
                </s-btn>
                <s-btn v-if="canRemove(set)" round flat dense size="sm" icon="delete_outline" color="negative" data-test="exam-set-remove" @click.stop="remove(set)">
                  <s-tooltip>{{ tdc('Remove this exam set') }}</s-tooltip>
                </s-btn>
              </div>
            </q-item-section>
            <s-tooltip>{{ tdc('Add every exam of this set to the request') }}</s-tooltip>
          </q-item>
        </div>
      </div>
    </div>
  </div>

  <!-- create (the exams added to the request) or edit a set -->
  <q-dialog v-model="dialog" persistent>
    <s-modal-card :title="editing ? tdc('Edit exam set') : tdc('Save as exam set')" :icon="editing ? 'edit' : 'playlist_add'" width="560px">
      <div class="column q-gutter-y-md">
        <s-input
          v-model="draft.name"
          :label="tdc('Set name')"
          :error="!!errors.name"
          :error-message="errors.name"
          maxlength="120"
          autofocus
          data-test="exam-set-name"
        />
        <q-option-group
          v-if="!editing && canManageEntity"
          v-model="draft.scope"
          :options="scopeOptions"
          inline
          data-test="exam-set-scope"
        />

        <div>
          <div class="row items-center q-mb-xs">
            <div class="text-subtitle2">{{ draft.exams.length }} {{ tdc(draft.exams.length === 1 ? 'exam' : 'exams') }}</div>
            <q-space />
            <s-btn
              v-if="editing"
              flat dense no-caps size="sm" color="primary" icon="playlist_add"
              :label="tdc('Add the exams of the request')"
              :disable="!missingFromDraft.length"
              data-test="exam-set-add-current"
              @click="addCurrent"
            >
              <s-tooltip>{{ tdc('Add to this set the exams already in the request') }}</s-tooltip>
            </s-btn>
          </div>
          <div class="row q-gutter-xs" data-test="exam-set-draft-exams">
            <q-chip
              v-for="id in draft.exams"
              :key="id"
              dense
              :removable="editing"
              color="primary"
              text-color="white"
              @remove="removeFromDraft(id)"
            >
              {{ examLabel(id) }}
            </q-chip>
          </div>
        </div>
        <div v-if="errors.exams" class="text-negative text-caption">{{ errors.exams }}</div>
      </div>
      <template #footer>
        <s-btn flat :label="tdc('Cancel')" v-close-popup>
          <s-tooltip>{{ tdc('Close without saving') }}</s-tooltip>
        </s-btn>
        <s-btn
          color="primary" icon="save" :label="tdc('Save')" :loading="saving"
          :disable="!draft.name.trim() || !draft.exams.length"
          data-test="exam-set-save"
          @click="save"
        >
          <s-tooltip>{{ editing ? tdc('Save the changes to this set') : tdc('Save these exams as a set') }}</s-tooltip>
        </s-btn>
      </template>
    </s-modal-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { HTTPAuth, url, tdc, useUserStore, sDialog } from 'quasar_resaas'

const props = defineProps({
  // the exam catalogue [{ id, nome, classes: [{ id, nome, exames: [...] }] }]
  catalogo: { type: Array, default: () => [] },
  // ids of the exams already in the request
  currentExams: { type: Array, default: () => [] },
  // the page's search: a set's name or the name/code of one of its exams
  search: { type: String, default: '' }
})

// [{ tipo, classe, exame }] of the clicked set, in catalogue order
const emit = defineEmits(['apply', 'loaded'])

const User = useUserStore()
const canList = computed(() => User.can('list_examset'))
const canAdd = computed(() => User.can('add_examset'))
const canChange = computed(() => User.can('change_examset'))
const canDelete = computed(() => User.can('delete_examset'))
const canManageEntity = computed(() => User.can('manage_entity_examset'))

const sets = ref([])
const loading = ref(false)
const dialog = ref(false)
const saving = ref(false)
const editing = ref(null)       // the set being edited, null when creating
const draft = reactive({ name: '', scope: 'mine', exams: [] })
const errors = reactive({ name: '', exams: '' })

const scopeOptions = computed(() => [
  { value: 'mine', label: tdc('Only for me') },
  { value: 'entity', label: tdc('For the whole clinic') }
])

const endpoint = (id) => url({ type: 'u', url: id ? `saude/examsets/${id}/` : 'saude/examsets/' })

async function load () {
  if (!canList.value) return
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(endpoint())
    sets.value = Array.isArray(data) ? data : []
    emit('loaded', sets.value.length)
  } catch {
    // the alert funnel (HTTPAuth interceptor) shows why
  } finally {
    loading.value = false
  }
}

// exam id -> { tipo, classe, exame } of the catalogue
const index = computed(() => {
  const map = new Map()
  for (const tipo of props.catalogo) {
    for (const classe of tipo.classes || []) {
      for (const exame of classe.exames || []) map.set(String(exame.id), { tipo, classe, exame })
    }
  }
  return map
})

function examLabel (id) {
  const exame = index.value.get(String(id))?.exame
  if (!exame) return tdc('Exam no longer in the catalogue')
  return exame.codigo ? `${exame.codigo} - ${exame.nome}` : exame.nome
}

// ---------------- SEARCH ----------------
const normalize = value => String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
const term = computed(() => normalize(props.search))

function matchedExams (set) {
  if (!term.value) return []
  return set.exams.map(examLabel).filter(label => normalize(label).includes(term.value))
}

const filteredSets = computed(() => {
  if (!term.value) return sets.value
  return sets.value.filter(set => normalize(set.name).includes(term.value) || matchedExams(set).length)
})

// ---------------- USE ----------------
function entriesOf (set) {
  // an exam no longer in the catalogue is skipped
  return set.exams.map(id => index.value.get(String(id))).filter(Boolean)
}

function allAdded (set) {
  const added = new Set(props.currentExams.map(String))
  return set.exams.length > 0 && set.exams.every(id => added.has(String(id)))
}

function apply (set) {
  emit('apply', entriesOf(set))
}

// a clinic set is kept by who manages them; a personal one by its owner (the
// list only has the user's own)
function canEdit (set) {
  return set.scope === 'entity' ? canManageEntity.value : canChange.value
}

function canRemove (set) {
  return set.scope === 'entity' ? canManageEntity.value : canDelete.value
}

function remove (set) {
  sDialog({
    title: tdc('Remove this exam set'),
    message: `${tdc('Remove the exam set')} "${set.name}"?`,
    cancel: { flat: true, label: tdc('Cancel') },
    ok: { color: 'negative', label: tdc('Remove') },
    persistent: true
  }).onOk(async () => {
    try {
      await HTTPAuth.delete(endpoint(set.id))
      await load()
    } catch {
      // the alert funnel shows why
    }
  })
}

// ---------------- CREATE / EDIT ----------------
function resetErrors () {
  errors.name = ''
  errors.exams = ''
}

function openSave () {
  editing.value = null
  draft.name = ''
  draft.scope = 'mine'
  draft.exams = props.currentExams.map(String)
  resetErrors()
  dialog.value = true
}

function openEdit (set) {
  editing.value = set
  draft.name = set.name
  draft.scope = set.scope
  draft.exams = set.exams.map(String)
  resetErrors()
  dialog.value = true
}

const missingFromDraft = computed(() => props.currentExams.map(String).filter(id => !draft.exams.includes(id)))

function addCurrent () {
  draft.exams = [...draft.exams, ...missingFromDraft.value]
}

function removeFromDraft (id) {
  draft.exams = draft.exams.filter(item => item !== id)
}

async function save () {
  saving.value = true
  resetErrors()
  try {
    if (editing.value) {
      await HTTPAuth.patch(endpoint(editing.value.id), { name: draft.name.trim(), exams: draft.exams })
    } else {
      await HTTPAuth.post(endpoint(), { name: draft.name.trim(), exams: draft.exams, scope: draft.scope })
    }
    dialog.value = false
    await load()
  } catch (error) {
    const details = error?.response?.data?.error?.details || {}
    errors.name = [].concat(details.name || [])[0] || ''
    errors.exams = [].concat(details.exams || [])[0] || ''
  } finally {
    saving.value = false
  }
}

onMounted(load)

defineExpose({ openSave, canSave: canAdd })
</script>

<style scoped>
.exam-set {
  border: 1px solid rgba(128, 128, 128, 0.25);
}

.exam-set--done {
  opacity: 0.6;
}
</style>
