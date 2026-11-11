<template>
  <!-- named sets of exams (saude/examsets/): one click adds all of a set's
       exams to the request (nothing is saved until the request is). The
       clinic's sets are everyone's; personal ones only their owner's. -->
  <q-expansion-item
    v-model="open"
    expand-separator
    data-test="exam-sets"
  >
    <template #header>
      <q-item-section avatar>
        <q-icon name="playlist_add" color="primary" size="20px" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-weight-bold">{{ tdc('Exam sets') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-badge color="primary" :label="sets.length" />
      </q-item-section>
    </template>

    <div class="q-pa-sm">
      <div v-if="loading" class="flex flex-center q-pa-sm">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="28px" />
      </div>
      <div v-else-if="!sets.length" class="text-caption text-grey-7">
        {{ tdc('No exam sets yet: add exams to the request and save them as a set.') }}
      </div>
      <div v-else class="row q-col-gutter-xs">
        <div v-for="set in sets" :key="set.id" class="col-12 col-sm-6 col-md-4">
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
              <q-item-label class="text-weight-medium ellipsis">{{ set.name }}</q-item-label>
              <q-item-label caption>
                {{ set.exams.length }} {{ tdc(set.exams.length === 1 ? 'exam' : 'exams') }} ·
                {{ tdc(set.scope === 'entity' ? 'Clinic' : 'Mine') }}
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="canRemove(set)" side>
              <s-btn round flat dense size="sm" icon="delete_outline" color="negative" data-test="exam-set-remove" @click.stop="remove(set)">
                <s-tooltip>{{ tdc('Remove this exam set') }}</s-tooltip>
              </s-btn>
            </q-item-section>
            <s-tooltip>{{ tdc('Add every exam of this set to the request') }}</s-tooltip>
          </q-item>
        </div>
      </div>
    </div>
  </q-expansion-item>

  <!-- save the exams added to the request as a set -->
  <q-dialog v-model="saveDialog" persistent>
    <s-modal-card :title="tdc('Save as exam set')" icon="playlist_add" width="480px">
      <div class="column q-gutter-y-md">
        <div class="text-caption text-grey-7">
          {{ currentExams.length }} {{ tdc(currentExams.length === 1 ? 'exam' : 'exams') }}
        </div>
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
          v-if="canManageEntity"
          v-model="draft.scope"
          :options="scopeOptions"
          inline
          data-test="exam-set-scope"
        />
        <div v-if="errors.exams" class="text-negative text-caption">{{ errors.exams }}</div>
      </div>
      <template #footer>
        <s-btn flat :label="tdc('Cancel')" v-close-popup>
          <s-tooltip>{{ tdc('Close without saving') }}</s-tooltip>
        </s-btn>
        <s-btn color="primary" icon="save" :label="tdc('Save')" :loading="saving" :disable="!draft.name.trim()" data-test="exam-set-save" @click="save">
          <s-tooltip>{{ tdc('Save these exams as a set') }}</s-tooltip>
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
  currentExams: { type: Array, default: () => [] }
})

// [{ tipo, classe, exame }] of the clicked set, in catalogue order
const emit = defineEmits(['apply'])

const User = useUserStore()
const canList = computed(() => User.can('list_examset'))
const canAdd = computed(() => User.can('add_examset'))
const canDelete = computed(() => User.can('delete_examset'))
const canManageEntity = computed(() => User.can('manage_entity_examset'))

const open = ref(true)
const sets = ref([])
const loading = ref(false)
const saveDialog = ref(false)
const saving = ref(false)
const draft = reactive({ name: '', scope: 'mine' })
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

function openSave () {
  draft.name = ''
  draft.scope = 'mine'
  errors.name = ''
  errors.exams = ''
  saveDialog.value = true
}

async function save () {
  saving.value = true
  errors.name = ''
  errors.exams = ''
  try {
    await HTTPAuth.post(endpoint(), { name: draft.name.trim(), exams: props.currentExams, scope: draft.scope })
    saveDialog.value = false
    open.value = true
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
