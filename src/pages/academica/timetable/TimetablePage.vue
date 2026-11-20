<template>
  <q-page class="q-pa-sm">
    <div class="row items-center q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-sm-6 col-md-4">
        <s-select
          v-model="classGroup"
          :api="classUrl"
          option-label="label" option-value="value"
          emit-value map-options clearable
          :label="tdc('Class')"
          data-test="timetable-class"
        />
      </div>
      <q-space />
      <s-btn flat round icon="refresh" :loading="loading" @click="load">
        <s-tooltip>{{ tdc('Reload the timetable') }}</s-tooltip>
      </s-btn>
    </div>

    <!-- the class's week -->
    <div v-if="classGroup" class="tt-week q-mb-md">
      <section v-for="day in days" :key="day.value" class="tt-day" data-test="timetable-day">
        <header class="tt-day__head">{{ day.label }}</header>
        <div v-if="!byDay(day.value).length" class="text-grey-6 text-caption q-pa-sm">—</div>
        <article v-for="slot in byDay(day.value)" :key="slot.id" class="tt-slot" data-test="timetable-slot">
          <div class="tt-slot__time">{{ slot.starts_at }}–{{ slot.ends_at }}</div>
          <div class="tt-slot__subject">{{ slot.subject.name }}</div>
          <div class="text-caption text-grey-7">
            <span v-if="slot.teacher">{{ slot.teacher.name }}</span>
            <span v-if="slot.room"> · {{ slot.room.name }}</span>
          </div>
        </article>
      </section>
    </div>
    <div v-else class="text-grey-7 q-pa-md">{{ tdc('Choose a class to see its week.') }}</div>

    <!-- the slots themselves (add / edit / delete) -->
    <s-auto-crud
      app="academica" model="TimetableSlot"
      :ignoreFields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'academic_year']"
      :ignoreFieldsFilter="['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'

// A class's weekly timetable (academica timetableslots/week/) above the
// schema-driven list of its slots. Overlaps are refused by the backend.
const classUrl = url({ type: 'u', url: 'academica/classgroups', params: { select: 'true' } })
const classGroup = ref(null)
const slots = ref([])
const loading = ref(false)

const days = computed(() => [
  { value: 1, label: tdc('Monday') }, { value: 2, label: tdc('Tuesday') }, { value: 3, label: tdc('Wednesday') },
  { value: 4, label: tdc('Thursday') }, { value: 5, label: tdc('Friday') }, { value: 6, label: tdc('Saturday') },
])

function byDay (weekday) {
  return slots.value.filter(s => s.weekday === weekday)
}

async function load () {
  if (!classGroup.value) { slots.value = []; return }
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'academica/timetableslots/week/', params: { class_group: classGroup.value } }))
    slots.value = data || []
  } finally {
    loading.value = false
  }
}

watch(classGroup, load)
</script>

<style scoped>
.tt-week { display: grid; grid-template-columns: repeat(6, minmax(150px, 1fr)); gap: 8px; overflow-x: auto; }
.tt-day { border-radius: 14px; background: rgba(128, 128, 128, 0.07); min-height: 120px; }
.tt-day__head { padding: 8px 12px; font-weight: 700; border-bottom: 1px solid rgba(128, 128, 128, 0.15); }
.tt-slot { margin: 8px; padding: 8px 10px; border-radius: 10px; border-left: 4px solid var(--q-primary); background: rgba(128, 128, 128, 0.08); }
.tt-slot__time { font-size: 0.8rem; font-weight: 600; color: var(--q-primary); }
.tt-slot__subject { font-weight: 600; }
@media (max-width: 599px) { .tt-week { grid-template-columns: repeat(6, 80vw); } }
</style>
