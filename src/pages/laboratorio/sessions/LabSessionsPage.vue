<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <!-- the sessions, newest first -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="q-pa-sm lab-list">
          <div class="row items-center no-wrap q-mb-sm">
            <div class="text-subtitle1 text-weight-bold col">{{ tdc('Lab sessions') }}</div>
            <s-btn unelevated round color="primary" icon="add" data-test="lab-new" @click="newDialog = true">
              <s-tooltip>{{ tdc('New lab session') }}</s-tooltip>
            </s-btn>
          </div>
          <q-list separator>
            <q-item v-for="row in sessions" :key="row.id" clickable :active="current?.id === row.id" data-test="lab-session" @click="open(row)">
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ row.title }}</q-item-label>
                <q-item-label caption>{{ when(row.starts_at) }} · {{ label(row.room) }} · {{ label(row.class_group) }}</q-item-label>
              </q-item-section>
              <q-item-section side><q-badge :color="colors[value(row.status)]" :label="tdc(statusLabel[value(row.status)])" /></q-item-section>
            </q-item>
            <q-item v-if="!sessions.length"><q-item-section class="text-grey-6">{{ tdc('No lab sessions yet') }}</q-item-section></q-item>
          </q-list>
        </s-card>
      </div>

      <!-- the session -->
      <div class="col-12 col-md-8">
        <s-card v-if="current" flat bordered class="q-pa-md">
          <div class="row items-center q-gutter-sm">
            <div class="col">
              <div class="text-h6">{{ current.title }}</div>
              <div class="text-caption text-grey-7">
                {{ label(current.subject) }} · {{ label(current.teacher) }} · {{ when(current.starts_at) }} – {{ when(current.ends_at) }}
              </div>
            </div>
            <q-badge :color="colors[status]" :label="tdc(statusLabel[status])" class="text-body2 q-pa-xs" />
            <s-btn v-if="status === 'planned'" unelevated rounded color="positive" icon="play_arrow" :label="tdc('Start')" :loading="busy" data-test="lab-start" @click="move('start')">
              <s-tooltip>{{ tdc('Start the session') }}</s-tooltip>
            </s-btn>
            <s-btn v-if="status === 'running'" unelevated rounded color="negative" icon="stop" :label="tdc('End')" :loading="busy" data-test="lab-end" @click="confirmMove('end')">
              <s-tooltip>{{ tdc('End the session and every remote access') }}</s-tooltip>
            </s-btn>
            <s-btn v-if="status === 'planned'" flat rounded icon="cancel" :label="tdc('Cancel')" :loading="busy" @click="confirmMove('cancel')">
              <s-tooltip>{{ tdc('Cancel the session') }}</s-tooltip>
            </s-btn>
          </div>

          <!-- seats -->
          <div class="row items-center q-mt-lg q-mb-sm">
            <div class="text-subtitle1 text-weight-bold col">{{ tdc('Seats') }}</div>
            <s-btn v-if="status !== 'ended' && status !== 'cancelled'" outline rounded no-caps icon="event_seat" :label="tdc('Seat a student')" data-test="lab-seat" @click="seatDialog = true">
              <s-tooltip>{{ tdc('Seat a student at a workstation') }}</s-tooltip>
            </s-btn>
          </div>
          <div class="row q-col-gutter-sm">
            <div v-for="seat in seats" :key="seat.id" class="col-6 col-sm-4 col-lg-3">
              <div class="lab-seat" :class="{ 'lab-seat--remote': seat.remote_access }" data-test="lab-seat-card">
                <div class="row items-center no-wrap">
                  <q-icon name="desktop_windows" size="22px" class="q-mr-xs" />
                  <span class="text-weight-bold col ellipsis">{{ seat.workstation_code }}</span>
                  <s-btn v-if="seat.remote_access" flat round dense size="sm" icon="stop_screen_share" color="negative" @click="endRemote(seat)">
                    <s-tooltip>{{ tdc('End the remote access') }}</s-tooltip>
                  </s-btn>
                  <s-btn v-else-if="status === 'running'" flat round dense size="sm" icon="screen_share" color="primary" data-test="lab-remote" @click="askRemote(seat)">
                    <s-tooltip>{{ tdc('Open remote access') }}</s-tooltip>
                  </s-btn>
                </div>
                <div class="ellipsis">{{ seat.student }}</div>
                <div v-if="seat.remote_access" class="text-caption text-negative">
                  {{ tdc('Remote access until') }} {{ time(seat.remote_access.expires_at) }}
                </div>
              </div>
            </div>
            <div v-if="!seats.length" class="col-12 text-grey-6">{{ tdc('No student seated yet') }}</div>
          </div>

          <!-- exercises -->
          <div class="row items-center q-mt-lg q-mb-sm">
            <div class="text-subtitle1 text-weight-bold col">{{ tdc('Exercises') }}</div>
          </div>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-12 col-sm-8">
              <s-select v-model="assignment" :api="assignmentUrl" option-label="label" option-value="value" emit-value map-options clearable dense :label="tdc('Assignment of the class')" />
            </div>
            <div class="col-12 col-sm-4">
              <s-btn outline rounded no-caps icon="add_task" :label="tdc('Distribute')" :disable="!assignment" @click="addExercise">
                <s-tooltip>{{ tdc('Distribute the assignment in this session') }}</s-tooltip>
              </s-btn>
            </div>
          </div>
          <q-list dense class="q-mt-xs">
            <q-item v-for="e in exercises" :key="e.id"><q-item-section avatar><q-icon name="assignment" /></q-item-section><q-item-section>{{ label(e.assignment) }}</q-item-section></q-item>
          </q-list>

          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
        </s-card>
        <div v-else class="text-center text-grey-6 q-pa-xl">{{ tdc('Choose a lab session') }}</div>
      </div>
    </div>

    <!-- new session -->
    <q-dialog v-model="newDialog">
      <s-modal-card :title="tdc('New lab session')" icon="co_present" width="min(620px, 94vw)" @close="newDialog = false">
        <div class="row q-col-gutter-sm">
          <div class="col-12"><s-input v-model="form.title" :label="tdc('Title')" autofocus data-test="lab-title" /></div>
          <div class="col-12 col-sm-6"><s-select v-model="form.room" :api="roomUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Room')" /></div>
          <div class="col-12 col-sm-6"><s-select v-model="form.class_group" :api="classUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Class')" /></div>
          <div class="col-12 col-sm-6"><s-select v-model="form.subject" :api="subjectUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Subject')" /></div>
          <div class="col-12 col-sm-6"><s-select v-model="form.environment" :api="environmentUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Environment')" /></div>
          <div class="col-12 col-sm-6"><s-input v-model="form.starts_at" type="datetime-local" :label="tdc('Starts at')" /></div>
          <div class="col-12 col-sm-6"><s-input v-model="form.ends_at" type="datetime-local" :label="tdc('Ends at')" /></div>
        </div>
        <div v-if="dialogError" class="text-negative q-mt-sm">{{ dialogError }}</div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="newDialog = false"><s-tooltip>{{ tdc('Close without saving') }}</s-tooltip></s-btn>
          <s-btn color="primary" icon="save" :label="tdc('Save')" :loading="busy" :disable="!canCreate" data-test="lab-save" @click="create">
            <s-tooltip>{{ tdc('Save the lab session') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- seat a student -->
    <q-dialog v-model="seatDialog">
      <s-modal-card :title="tdc('Seat a student')" icon="event_seat" width="min(520px, 94vw)" @close="seatDialog = false">
        <s-select v-model="seatForm.enrolment" :api="enrolmentUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Student')" class="q-mb-sm" />
        <s-select v-model="seatForm.workstation" :api="workstationUrl" option-label="label" option-value="value" emit-value map-options :label="tdc('Workstation')" />
        <div v-if="dialogError" class="text-negative q-mt-sm">{{ dialogError }}</div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="seatDialog = false"><s-tooltip>{{ tdc('Close without saving') }}</s-tooltip></s-btn>
          <s-btn color="primary" icon="save" :label="tdc('Save')" :loading="busy" :disable="!seatForm.enrolment || !seatForm.workstation" @click="seatStudent">
            <s-tooltip>{{ tdc('Seat the student') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- remote access: a reason and a time limit, the student sees it -->
    <q-dialog v-model="remoteDialog">
      <s-modal-card :title="tdc('Open remote access')" icon="screen_share" width="min(520px, 94vw)" @close="remoteDialog = false">
        <div class="text-body2 q-mb-sm">{{ remoteSeat?.workstation_code }} · {{ remoteSeat?.student }}</div>
        <s-input v-model="remote.reason" type="textarea" autogrow :label="tdc('Reason')" autofocus data-test="lab-remote-reason" />
        <s-input v-model.number="remote.minutes" type="number" min="1" max="60" :label="tdc('Minutes (1 to 60)')" class="q-mt-sm" />
        <div class="text-caption text-grey-7 q-mt-sm">{{ tdc('The student sees the remote access and it is recorded in the audit log.') }}</div>
        <div v-if="dialogError" class="text-negative q-mt-sm">{{ dialogError }}</div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="remoteDialog = false"><s-tooltip>{{ tdc('Close without opening') }}</s-tooltip></s-btn>
          <s-btn color="primary" icon="screen_share" :label="tdc('Open')" :loading="busy" :disable="(remote.reason || '').trim().length < 5" data-test="lab-remote-open" @click="openRemote">
            <s-tooltip>{{ tdc('Open the remote access') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { tdc, url, errorMessage, sDialog } from 'quasar_resaas'
import { useLabSessionStore } from '../labSessionStore'

// Practical sessions: a teacher plans a session of a class in a room, seats
// the students at workstations, distributes exercises (pedagogica
// assignments), and while it runs may open a remote access to a seated
// student's workstation - with a reason and a time limit, audited.
const $q = useQuasar()
const Lab = useLabSessionStore()
const sel = (path, params = {}) => url({ type: 'u', url: path, params: { select: 'true', ...params } })
const roomUrl = sel('laboratorio/rooms')
const classUrl = sel('academica/classgroups')
const subjectUrl = sel('academica/subjects')
const environmentUrl = sel('laboratorio/environments')

const colors = { planned: 'blue-grey', running: 'positive', ended: 'grey-7', cancelled: 'negative' }
const statusLabel = { planned: 'Planned', running: 'Running', ended: 'Ended', cancelled: 'Cancelled' }

const sessions = ref([])
const current = ref(null)
const seats = ref([])
const exercises = ref([])
const assignment = ref(null)
const busy = ref(false)
const error = ref('')
const dialogError = ref('')
const newDialog = ref(false)
const seatDialog = ref(false)
const remoteDialog = ref(false)
const remoteSeat = ref(null)
const remote = reactive({ reason: '', minutes: 15 })
const seatForm = reactive({ enrolment: null, workstation: null })
const form = reactive({ title: '', room: null, class_group: null, subject: null, environment: null, starts_at: '', ends_at: '' })

const value = (field) => (field && typeof field === 'object' ? field.value ?? field.id : field)
const label = (field) => (field && typeof field === 'object' ? field.label : field) || ''
const when = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '')
const time = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { timeStyle: 'short' }) : '')
const status = computed(() => value(current.value?.status))
const canCreate = computed(() => form.title && form.room && form.class_group && form.subject && form.starts_at && form.ends_at)
const enrolmentUrl = computed(() => sel('academica/enrolments', { class_group: value(current.value?.class_group), status: 'active' }))
const workstationUrl = computed(() => sel('laboratorio/workstations', { room: value(current.value?.room), status: 'available' }))
const assignmentUrl = computed(() => sel('pedagogica/assignments', { class_group: value(current.value?.class_group) }))

const fail = (e, target = error) => { target.value = errorMessage(e) || tdc('An error occurred. Please try again.') }

async function load () {
  try {
    sessions.value = await Lab.sessions({ ordering: '-starts_at' })
  } catch (e) { fail(e) }
}

async function open (row) {
  current.value = row
  error.value = ''
  try {
    const [s, e] = await Promise.all([Lab.seats(row.id), Lab.exercises(row.id)])
    seats.value = s
    exercises.value = e
  } catch (err) { fail(err) }
}

async function refresh () {
  await load()
  const again = sessions.value.find(r => r.id === current.value?.id)
  if (again) await open(again)
}

async function create () {
  busy.value = true
  dialogError.value = ''
  try {
    const body = { ...form, starts_at: new Date(form.starts_at).toISOString(), ends_at: new Date(form.ends_at).toISOString() }
    if (!body.environment) delete body.environment
    const saved = await Lab.createSession(body)
    newDialog.value = false
    Object.assign(form, { title: '', room: null, class_group: null, subject: null, environment: null, starts_at: '', ends_at: '' })
    await load()
    const row = sessions.value.find(r => r.id === saved.id)
    if (row) await open(row)
  } catch (e) { fail(e, dialogError) } finally { busy.value = false }
}

async function move (to) {
  busy.value = true
  try {
    await Lab.move(current.value.id, to)
    await refresh()
  } catch (e) { fail(e) } finally { busy.value = false }
}

function confirmMove (to) {
  sDialog({
    title: tdc(to === 'end' ? 'End the session?' : 'Cancel the session?'),
    message: tdc(to === 'end' ? 'Every open remote access ends too.' : 'A cancelled session cannot be started again.'),
    persistent: true,
    ok: { label: tdc(to === 'end' ? 'End' : 'Cancel the session'), color: 'negative', flat: true },
    cancel: { label: tdc('Back'), flat: true },
  }).onOk(() => move(to))
}

async function seatStudent () {
  busy.value = true
  dialogError.value = ''
  try {
    await Lab.seat(current.value.id, seatForm.enrolment, seatForm.workstation)
    seatDialog.value = false
    seatForm.enrolment = seatForm.workstation = null
    seats.value = await Lab.seats(current.value.id)
  } catch (e) { fail(e, dialogError) } finally { busy.value = false }
}

async function addExercise () {
  try {
    await Lab.addExercise(current.value.id, assignment.value)
    assignment.value = null
    exercises.value = await Lab.exercises(current.value.id)
  } catch (e) { fail(e) }
}

function askRemote (seat) {
  remoteSeat.value = seat
  Object.assign(remote, { reason: '', minutes: 15 })
  dialogError.value = ''
  remoteDialog.value = true
}

async function openRemote () {
  busy.value = true
  dialogError.value = ''
  try {
    const access = await Lab.openRemote(current.value.id, { seat: remoteSeat.value.id, reason: remote.reason, minutes: remote.minutes })
    remoteDialog.value = false
    if (access.access_url) window.open(access.access_url, '_blank', 'noopener')
    else $q.notify({ type: 'info', message: tdc('Remote access recorded. No remote desktop tool is connected: connect with your usual tool.') })
    seats.value = await Lab.seats(current.value.id)
  } catch (e) { fail(e, dialogError) } finally { busy.value = false }
}

async function endRemote (seat) {
  try {
    await Lab.endRemote(seat.remote_access.id)
    seats.value = await Lab.seats(current.value.id)
  } catch (e) { fail(e) }
}

onMounted(load)
</script>

<style scoped>
.lab-list { max-height: calc(100vh - 140px); overflow-y: auto; }
.lab-seat { padding: 10px; border-radius: 12px; border: 1px solid rgba(128, 128, 128, 0.25); min-height: 76px; }
.lab-seat--remote { border-color: var(--q-negative); box-shadow: 0 0 0 1px var(--q-negative) inset; }
</style>
