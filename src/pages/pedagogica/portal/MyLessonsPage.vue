<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm items-center q-mb-md">
      <div class="col-12 col-sm-4">
        <s-select v-model="enrolment" :options="enrolmentOptions" emit-value map-options :label="tdc('Enrolment')" data-test="lessons-enrolment" />
      </div>
      <div class="col-12 col-sm-4">
        <s-select v-model="subject" :options="subjectOptions" emit-value map-options clearable :label="tdc('Subject')" />
      </div>
      <div class="col-12 col-sm-4">
        <s-input v-model="q" type="search" debounce="300" :placeholder="tdc('Search lessons')" data-test="lessons-search" />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner size="40px" :color="$q.dark.isActive ? 'white' : 'primary'" /></div>
    <div v-else-if="!lessons.length" class="text-center text-grey-6 q-pa-xl">{{ tdc('No lessons yet') }}</div>

    <!-- newest first, by date -->
    <section v-for="day in days" :key="day.date" class="q-mb-lg">
      <div class="text-overline text-grey-7">{{ day.date }}</div>
      <s-card v-for="lesson in day.lessons" :key="lesson.id" flat bordered class="q-pa-md q-mb-sm lesson" data-test="lesson">
        <div class="row items-center no-wrap">
          <q-badge color="primary" class="q-mr-sm">{{ label(lesson.subject) }}</q-badge>
          <div class="text-subtitle1 text-weight-bold col">{{ lesson.title }}</div>
        </div>
        <div v-if="lesson.summary" class="text-grey-8 q-mt-xs">{{ lesson.summary }}</div>
        <div v-for="(block, i) in lesson.blocks" :key="i" class="q-mt-sm">
          <!-- eslint-disable-next-line vue/no-v-html -- sanitized (utils/sanitizeHtml.js) -->
          <div v-if="block.type === 'text'" class="lesson-text" v-html="sanitizeHtml(block.content)" />
          <pre v-else-if="block.type === 'diagram'" class="lesson-diagram">{{ block.content }}</pre>
          <img v-else-if="(block.type === 'image' || block.type === 'drawing') && fileOf(lesson, block)" :src="fileOf(lesson, block)" :alt="block.caption" class="lesson-image">
          <a v-else-if="block.type === 'document' && fileOf(lesson, block)" :href="fileOf(lesson, block)" target="_blank" rel="noopener">
            <q-icon name="description" /> {{ block.caption || tdc('Open the document') }}
          </a>
          <div v-if="block.caption && block.type !== 'document'" class="text-caption text-grey-7">{{ block.caption }}</div>
        </div>
      </s-card>
    </section>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import { useLessonStore } from '../lessonStore'
import { sanitizeHtml } from '../utils/sanitizeHtml'

// The student's (or guardian's) lessons: the published lessons of the class
// of one of their enrolments (pedagogica lessons/mine/), newest first,
// searchable and by subject.
const Lesson = useLessonStore()
const enrolments = ref([])
const enrolment = ref(null)
const subject = ref(null)
const q = ref('')
const lessons = ref([])
const loading = ref(false)

const label = (field) => (field && typeof field === 'object' ? field.label : field) || ''
const value = (field) => (field && typeof field === 'object' ? field.value ?? field.id : field)

// academica enrolments/mine/: {id, student, academic_year: {name}, class_group, ...}
const enrolmentOptions = computed(() => enrolments.value.map(e => ({
  value: e.id, label: [e.student, e.academic_year?.name, e.class_group].filter(Boolean).join(' · '),
})))
const subjectOptions = computed(() => {
  const seen = new Map()
  lessons.value.forEach(l => seen.set(value(l.subject), label(l.subject)))
  return [...seen].map(([v, l]) => ({ value: v, label: l }))
})
const days = computed(() => {
  const map = new Map()
  for (const lesson of lessons.value) {
    if (!map.has(lesson.date)) map.set(lesson.date, [])
    map.get(lesson.date).push(lesson)
  }
  return [...map].map(([date, rows]) => ({ date, lessons: rows }))
})

function fileOf (lesson, block) {
  const att = (lesson.attachments || []).find(a => a.id === block.attachment)
  return att ? (att.file?.url || att.file) : ''
}

async function load () {
  if (!enrolment.value) return
  loading.value = true
  try {
    lessons.value = await Lesson.mine({ enrolment: enrolment.value, subject: subject.value || undefined, q: q.value || undefined })
  } finally {
    loading.value = false
  }
}

watch([enrolment, subject, q], load)

onMounted(async () => {
  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'academica/enrolments/mine/' }))
  enrolments.value = data || []
  enrolment.value = enrolments.value[0]?.id || null
})
</script>

<style scoped>
.lesson { border-radius: 14px; }
.lesson-text :deep(p) { margin: 0 0 6px; }
.lesson-diagram { white-space: pre-wrap; background: rgba(128, 128, 128, 0.08); padding: 10px; border-radius: 8px; font-size: 0.9rem; }
.lesson-image { max-width: 100%; border-radius: 10px; }
</style>
