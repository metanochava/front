<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-6">
        <s-select v-model="enrolment" :options="enrolmentOptions" emit-value map-options :label="tdc('Enrolment')" />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner size="40px" :color="$q.dark.isActive ? 'white' : 'primary'" /></div>
    <div v-else-if="!sessions.length" class="text-center text-grey-6 q-pa-xl">{{ tdc('No lab sessions yet') }}</div>

    <s-card v-for="row in sessions" :key="row.id" flat bordered class="q-pa-md q-mb-sm lab-card" data-test="my-lab-session">
      <!-- a remote access on the student's workstation is never hidden -->
      <q-banner v-if="row.remote_access" rounded class="bg-negative text-white q-mb-sm" data-test="my-lab-remote">
        <template #avatar><q-icon name="screen_share" /></template>
        {{ tdc('Remote access to your workstation by') }} {{ row.remote_access.teacher }}
        ({{ tdc('until') }} {{ time(row.remote_access.expires_at) }}): {{ row.remote_access.reason }}
      </q-banner>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">{{ row.title }}</div>
          <div class="text-caption text-grey-7">{{ row.subject }} · {{ row.teacher }} · {{ row.room }} · {{ when(row.starts_at) }}</div>
        </div>
        <q-badge :color="colors[row.status]" :label="tdc(statusLabel[row.status])" />
      </div>
      <div class="q-mt-sm">
        <q-icon name="desktop_windows" class="q-mr-xs" />
        <span v-if="row.workstation">{{ tdc('Your workstation') }}: <b>{{ row.workstation }}</b></span>
        <span v-else class="text-grey-6">{{ tdc('No workstation assigned') }}</span>
      </div>
      <div v-if="row.exercises.length" class="q-mt-sm">
        <div class="text-caption text-weight-bold">{{ tdc('Exercises') }}</div>
        <div v-for="e in row.exercises" :key="e.id"><q-icon name="assignment" class="q-mr-xs" />{{ e.title }}</div>
      </div>
    </s-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import { useLabSessionStore } from '../labSessionStore'

// The student's (or guardian's) practical sessions: their workstation, the
// exercises, and any remote access open on their workstation.
const Lab = useLabSessionStore()
const enrolments = ref([])
const enrolment = ref(null)
const sessions = ref([])
const loading = ref(false)

const colors = { planned: 'blue-grey', running: 'positive', ended: 'grey-7' }
const statusLabel = { planned: 'Planned', running: 'Running', ended: 'Ended' }
const when = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '')
const time = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { timeStyle: 'short' }) : '')

// academica enrolments/mine/: {id, student, academic_year: {name}, class_group, ...}
const enrolmentOptions = computed(() => enrolments.value.map(e => ({
  value: e.id, label: [e.student, e.academic_year?.name, e.class_group].filter(Boolean).join(' · '),
})))

async function load () {
  if (!enrolment.value) return
  loading.value = true
  try {
    sessions.value = await Lab.mine(enrolment.value)
  } finally {
    loading.value = false
  }
}

watch(enrolment, load)

onMounted(async () => {
  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'academica/enrolments/mine/' }))
  enrolments.value = data || []
  enrolment.value = enrolments.value[0]?.id || null
})
</script>

<style scoped>
.lab-card { border-radius: 14px; }
</style>
