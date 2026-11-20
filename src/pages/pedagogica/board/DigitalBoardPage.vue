<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <!-- the lessons' history: searchable, newest first -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="q-pa-sm board-history">
          <div class="row items-center no-wrap q-mb-sm">
            <div class="text-subtitle1 text-weight-bold col">{{ tdc('Lessons') }}</div>
            <s-btn unelevated round color="primary" icon="add" data-test="board-new" @click="newLesson">
              <s-tooltip>{{ tdc('New lesson') }}</s-tooltip>
            </s-btn>
          </div>
          <s-input v-model="q" dense debounce="300" type="search" :placeholder="tdc('Search lessons')" @update:model-value="loadHistory" />
          <div class="row q-col-gutter-xs q-mt-xs">
            <div class="col-6"><s-select v-model="filterClass" dense :api="classUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Class')" @update:model-value="loadHistory" /></div>
            <div class="col-6"><s-select v-model="filterSubject" dense :api="subjectUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Subject')" @update:model-value="loadHistory" /></div>
          </div>
          <q-list separator class="q-mt-sm">
            <q-item v-for="l in history" :key="l.id" clickable :active="form.id === l.id" data-test="board-history-item" @click="open(l)">
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ l.title }}</q-item-label>
                <q-item-label caption>{{ l.date }} · {{ label(l.subject) }} · {{ label(l.class_group) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="value(l.status) === 'published' ? 'positive' : 'grey-6'" :label="tdc(value(l.status) === 'published' ? 'Published' : 'Draft')" />
              </q-item-section>
            </q-item>
            <q-item v-if="!history.length"><q-item-section class="text-grey-6">{{ tdc('No lessons yet') }}</q-item-section></q-item>
          </q-list>
        </s-card>
      </div>

      <!-- the board -->
      <div class="col-12 col-md-8">
        <s-card flat bordered class="q-pa-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-4"><s-select v-model="form.class_group" :api="classUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Class')" data-test="board-class" /></div>
            <div class="col-12 col-sm-4"><s-select v-model="form.subject" :api="subjectUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Subject')" data-test="board-subject" /></div>
            <div class="col-12 col-sm-4"><s-input v-model="form.date" type="date" :label="tdc('Date')" /></div>
            <div class="col-12"><s-input v-model="form.title" :label="tdc('Title')" data-test="board-title" /></div>
            <div class="col-12"><s-input v-model="form.summary" type="textarea" autogrow :label="tdc('Summary')" /></div>
          </div>

          <!-- the blocks -->
          <div v-for="(block, i) in form.blocks" :key="block.key" class="board-block" data-test="board-block">
            <div class="row items-center no-wrap q-mb-xs">
              <q-icon :name="icons[block.type]" color="primary" class="q-mr-xs" />
              <span class="text-caption text-weight-bold col">{{ tdc(typeLabel[block.type]) }}</span>
              <s-btn flat round dense size="sm" icon="arrow_upward" :disable="i === 0" @click="moveBlock(i, -1)"><s-tooltip>{{ tdc('Move up') }}</s-tooltip></s-btn>
              <s-btn flat round dense size="sm" icon="arrow_downward" :disable="i === form.blocks.length - 1" @click="moveBlock(i, 1)"><s-tooltip>{{ tdc('Move down') }}</s-tooltip></s-btn>
              <s-btn flat round dense size="sm" icon="delete" color="negative" @click="form.blocks.splice(i, 1)"><s-tooltip>{{ tdc('Remove the block') }}</s-tooltip></s-btn>
            </div>
            <s-editor v-if="block.type === 'text'" v-model="block.content" min-height="8rem" />
            <s-input v-else-if="block.type === 'diagram'" v-model="block.content" type="textarea" autogrow :label="tdc('Diagram (text, e.g. A --> B)')" />
            <template v-else-if="block.type === 'drawing' && !block.attachment">
              <WhiteboardCanvas :ref="el => (boards[block.key] = el)" />
              <s-btn class="q-mt-xs" unelevated rounded color="primary" icon="save" :label="tdc('Keep the drawing')" :disable="!form.id" :loading="busy" @click="saveDrawing(block)">
                <s-tooltip>{{ form.id ? tdc('Save the drawing in the lesson') : tdc('Save the lesson first') }}</s-tooltip>
              </s-btn>
            </template>
            <template v-else>
              <img v-if="block.attachment && (block.type === 'image' || block.type === 'drawing')" :src="fileUrl(block.attachment)" class="board-image" :alt="block.caption">
              <a v-else-if="block.attachment" :href="fileUrl(block.attachment)" target="_blank" rel="noopener">{{ block.caption || tdc('Open the document') }}</a>
              <q-file v-else dense outlined :label="tdc(form.id ? 'Choose a file' : 'Save the lesson first')" :disable="!form.id"
                      :accept="block.type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt'"
                      @update:model-value="file => upload(block, file)" />
            </template>
            <s-input v-if="block.type !== 'text'" v-model="block.caption" dense class="q-mt-xs" :label="tdc('Caption')" />
          </div>

          <!-- add a block -->
          <div class="row q-gutter-xs q-mt-md">
            <s-btn v-for="t in types" :key="t" outline rounded no-caps :icon="icons[t]" :label="tdc(typeLabel[t])" :data-test="`board-add-${t}`" @click="addBlock(t)">
              <s-tooltip>{{ tdc('Add a block') }}</s-tooltip>
            </s-btn>
          </div>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <s-btn v-if="form.id" flat rounded no-caps :icon="published ? 'unpublished' : 'publish'" :label="tdc(published ? 'Unpublish' : 'Publish')" :loading="busy" data-test="board-publish" @click="togglePublished">
              <s-tooltip>{{ tdc(published ? 'Hide the lesson from the class' : 'Show the lesson to the class') }}</s-tooltip>
            </s-btn>
            <s-btn unelevated rounded color="primary" icon="save" :label="tdc('Save')" :loading="busy" data-test="board-save" @click="save">
              <s-tooltip>{{ tdc('Save the lesson') }}</s-tooltip>
            </s-btn>
          </div>
        </s-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { tdc, url, errorMessage } from 'quasar_resaas'
import { useLessonStore } from '../lessonStore'
import WhiteboardCanvas from './WhiteboardCanvas.vue'

// The digital board: a teacher writes a lesson in blocks (text, images,
// documents, diagrams, drawings) for a class, subject and date, saves it and
// publishes it to the class. The history on the left is searchable.
const Lesson = useLessonStore()
const classUrl = url({ type: 'u', url: 'academica/classgroups', params: { select: 'true' } })
const subjectUrl = url({ type: 'u', url: 'academica/subjects', params: { select: 'true' } })

const types = ['text', 'image', 'document', 'diagram', 'drawing']
const icons = { text: 'notes', image: 'image', document: 'description', diagram: 'account_tree', drawing: 'draw' }
const typeLabel = { text: 'Text', image: 'Image', document: 'Document', diagram: 'Diagram', drawing: 'Drawing' }

const q = ref('')
const filterClass = ref(null)
const filterSubject = ref(null)
const history = ref([])
const files = ref({})           // attachment id -> url
const boards = {}
const busy = ref(false)
const error = ref('')
const status = ref('draft')
let seq = 0

const today = () => new Date().toISOString().slice(0, 10)
const empty = () => ({ id: null, class_group: null, subject: null, date: today(), title: '', summary: '', blocks: [] })
const form = reactive(empty())
const published = computed(() => status.value === 'published')

const value = (field) => (field && typeof field === 'object' ? field.value ?? field.id : field)
const label = (field) => (field && typeof field === 'object' ? field.label : field) || ''
const fileUrl = (id) => files.value[id] || ''

async function loadHistory () {
  try {
    history.value = await Lesson.searchLessons({ q: q.value || undefined, class_group: filterClass.value || undefined, subject: filterSubject.value || undefined })
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  }
}

async function loadFiles (lessonId) {
  const rows = await Lesson.attachments(lessonId)
  files.value = Object.fromEntries(rows.map(r => [r.id, r.file?.url || r.file]))
}

function newLesson () {
  Object.assign(form, empty())
  status.value = 'draft'
  files.value = {}
  error.value = ''
}

async function open (lesson) {
  Object.assign(form, {
    id: lesson.id, class_group: value(lesson.class_group), subject: value(lesson.subject), date: lesson.date,
    title: lesson.title, summary: lesson.summary, blocks: (lesson.blocks || []).map(b => ({ ...b, key: ++seq })),
  })
  status.value = value(lesson.status)
  error.value = ''
  await loadFiles(lesson.id)
}

function addBlock (type) {
  form.blocks.push({ key: ++seq, type, content: '', caption: '' })
}

function moveBlock (i, delta) {
  const [block] = form.blocks.splice(i, 1)
  form.blocks.splice(i + delta, 0, block)
}

const payload = () => ({
  ...form,
  blocks: form.blocks.map(({ key, ...b }) => b),   // eslint-disable-line no-unused-vars
})

async function save () {
  busy.value = true
  error.value = ''
  try {
    const saved = await Lesson.saveLesson(payload())
    form.id = saved.id
    status.value = value(saved.status)
    await loadHistory()
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    busy.value = false
  }
}

async function upload (block, file, kind = null) {
  if (!file || !form.id) return
  busy.value = true
  try {
    const att = await Lesson.uploadAttachment(form.id, file, kind || (block.type === 'image' ? 'image' : 'document'),
      block.caption || file.name)
    block.attachment = att.id
    if (!block.caption) block.caption = file.name
    files.value = { ...files.value, [att.id]: att.file?.url || att.file }
    await save()
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    busy.value = false
  }
}

async function saveDrawing (block) {
  const board = boards[block.key]
  if (!board || !form.id) return
  const blob = await board.toBlob()
  // upload() sets block.attachment and saves the lesson
  await upload(block, new File([blob], `drawing-${Date.now()}.png`, { type: 'image/png' }), 'drawing')
}

async function togglePublished () {
  busy.value = true
  try {
    const saved = await Lesson.setPublished(form.id, !published.value)
    status.value = value(saved.status)
    await loadHistory()
  } catch (e) {
    error.value = errorMessage(e) || tdc('An error occurred. Please try again.')
  } finally {
    busy.value = false
  }
}

onMounted(loadHistory)
</script>

<style scoped>
.board-history { max-height: calc(100vh - 140px); overflow-y: auto; }
.board-block { margin-top: 14px; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(128, 128, 128, 0.2); }
.board-image { max-width: 100%; border-radius: 8px; }
</style>
