<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-md">
      <!-- the labs -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="q-pa-sm vl-list">
          <div class="row items-center no-wrap q-mb-sm">
            <div class="text-subtitle1 text-weight-bold col">{{ tdc('Virtual labs') }}</div>
            <s-btn unelevated round color="primary" icon="add" data-test="vl-new" @click="newDialog = true">
              <s-tooltip>{{ tdc('New virtual lab') }}</s-tooltip>
            </s-btn>
          </div>
          <q-list separator>
            <q-item v-for="row in labs" :key="row.id" clickable :active="current?.id === row.id" data-test="vl-lab" @click="open(row)">
              <q-item-section avatar><q-icon name="dns" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ row.name }}</q-item-label>
                <q-item-label caption>{{ label(row.class_group) || tdc('No class') }} · {{ tdc(value(row.network_mode) === 'isolated' ? 'Isolated' : 'Shared') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!labs.length"><q-item-section class="text-grey-6">{{ tdc('No virtual labs yet') }}</q-item-section></q-item>
          </q-list>
        </s-card>
      </div>

      <!-- the lab -->
      <div class="col-12 col-md-8">
        <s-card v-if="current" flat bordered class="q-pa-md">
          <div class="row items-center q-gutter-sm">
            <div class="col">
              <div class="text-h6">{{ current.name }}</div>
              <div class="text-caption text-grey-7">{{ current.description }} {{ current.network_name ? `· ${current.network_name}` : '' }}</div>
            </div>
            <q-btn-toggle v-model="mode" no-caps rounded unelevated toggle-color="primary" :options="modeOptions" @update:model-value="setMode" />
          </div>

          <div class="row q-gutter-xs q-mt-md">
            <s-btn outline rounded no-caps icon="dns" :label="tdc('Create the class machines')" :disable="!current.class_group" :loading="busy" data-test="vl-create-class" @click="createClass">
              <s-tooltip>{{ tdc('A machine for every student of the class without one') }}</s-tooltip>
            </s-btn>
            <s-btn outline rounded no-caps icon="add" :label="tdc('Add a machine')" data-test="vl-add" @click="addDialog = true">
              <s-tooltip>{{ tdc('A machine for one student') }}</s-tooltip>
            </s-btn>
            <s-btn flat round icon="play_arrow" color="positive" :loading="busy" @click="labAction('start_machines')"><s-tooltip>{{ tdc('Start every machine') }}</s-tooltip></s-btn>
            <s-btn flat round icon="stop" color="negative" :loading="busy" @click="labAction('stop_machines')"><s-tooltip>{{ tdc('Stop every machine') }}</s-tooltip></s-btn>
            <s-btn flat round icon="restart_alt" :loading="busy" @click="labAction('restart_machines')"><s-tooltip>{{ tdc('Restart every machine') }}</s-tooltip></s-btn>
            <s-btn flat round icon="sync" :loading="busy" @click="labAction('sync')"><s-tooltip>{{ tdc('Read the real state of the machines') }}</s-tooltip></s-btn>
          </div>

          <q-markup-table flat bordered dense class="q-mt-md" wrap-cells>
            <thead>
              <tr>
                <th class="text-left">{{ tdc('Machine') }}</th>
                <th class="text-left">{{ tdc('Student') }}</th>
                <th class="text-left">{{ tdc('Status') }}</th>
                <th class="text-left">SSH</th>
                <th class="text-right" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="vm in machines" :key="vm.id" data-test="vl-machine">
                <td>{{ vm.container_name }}</td>
                <td>{{ label(vm.enrolment) || '—' }}</td>
                <td><q-badge :color="colors[value(vm.status)]" :label="tdc(statusLabel[value(vm.status)])" /></td>
                <td><code>{{ vm.access?.ssh }}</code></td>
                <td class="text-right no-wrap">
                  <s-btn v-if="value(vm.status) !== 'running'" flat round dense size="sm" icon="play_arrow" color="positive" @click="machineAction(vm, 'start')"><s-tooltip>{{ tdc('Start') }}</s-tooltip></s-btn>
                  <s-btn v-else flat round dense size="sm" icon="stop" color="negative" @click="machineAction(vm, 'stop')"><s-tooltip>{{ tdc('Stop') }}</s-tooltip></s-btn>
                  <s-btn flat round dense size="sm" icon="restart_alt" @click="machineAction(vm, 'restart')"><s-tooltip>{{ tdc('Restart') }}</s-tooltip></s-btn>
                  <s-btn flat round dense size="sm" icon="key" @click="renew(vm)"><s-tooltip>{{ tdc('Renew the password') }}</s-tooltip></s-btn>
                  <s-btn flat round dense size="sm" icon="backup" @click="machineAction(vm, 'backup')"><s-tooltip>{{ tdc('Back up the home folder') }}</s-tooltip></s-btn>
                  <s-btn flat round dense size="sm" icon="delete" color="negative" @click="remove(vm)"><s-tooltip>{{ tdc('Delete the machine (its data is kept)') }}</s-tooltip></s-btn>
                </td>
              </tr>
              <tr v-if="!machines.length"><td colspan="5" class="text-grey-6">{{ tdc('No machines yet') }}</td></tr>
            </tbody>
          </q-markup-table>
          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
        </s-card>
        <div v-else class="text-center text-grey-6 q-pa-xl">{{ tdc('Choose a virtual lab') }}</div>
      </div>
    </div>

    <!-- new lab -->
    <q-dialog v-model="newDialog">
      <s-modal-card :title="tdc('New virtual lab')" icon="dns" width="min(560px, 94vw)" @close="newDialog = false">
        <div class="row q-col-gutter-sm">
          <div class="col-12"><s-input v-model="form.name" :label="tdc('Name (lowercase, digits and -)')" autofocus data-test="vl-name" /></div>
          <div class="col-12"><s-input v-model="form.description" :label="tdc('Description')" /></div>
          <div class="col-12 col-sm-6"><s-select v-model="form.class_group" :api="classUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Class')" /></div>
          <div class="col-12 col-sm-6"><s-select v-model="form.subject" :api="subjectUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Subject')" /></div>
          <div class="col-12"><s-select v-model="form.environment" :api="environmentUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Environment (image)')" /></div>
        </div>
        <div v-if="dialogError" class="text-negative q-mt-sm">{{ dialogError }}</div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="newDialog = false"><s-tooltip>{{ tdc('Close without saving') }}</s-tooltip></s-btn>
          <s-btn color="primary" icon="save" :label="tdc('Save')" :disable="!form.name" :loading="busy" data-test="vl-save" @click="createLab">
            <s-tooltip>{{ tdc('Save the virtual lab') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- one machine -->
    <q-dialog v-model="addDialog">
      <s-modal-card :title="tdc('Add a machine')" icon="add" width="min(520px, 94vw)" @close="addDialog = false">
        <s-select v-model="add.enrolment" :api="enrolmentUrl" option-label="label" option-value="value" emit-value map-options clearable :label="tdc('Student')" class="q-mb-sm" />
        <s-input v-if="!add.enrolment" v-model="add.username" :label="tdc('Or a username')" class="q-mb-sm" />
        <div class="row q-col-gutter-sm">
          <div class="col-6"><s-input v-model="add.ram" :label="tdc('RAM (e.g. 1g)')" /></div>
          <div class="col-6"><s-input v-model="add.cpus" :label="tdc('CPUs (e.g. 1)')" /></div>
        </div>
        <div v-if="dialogError" class="text-negative q-mt-sm">{{ dialogError }}</div>
        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="addDialog = false"><s-tooltip>{{ tdc('Close without saving') }}</s-tooltip></s-btn>
          <s-btn color="primary" icon="dns" :label="tdc('Create')" :disable="!add.enrolment && !add.username" :loading="busy" @click="createMachine">
            <s-tooltip>{{ tdc('Create and start the machine') }}</s-tooltip>
          </s-btn>
        </template>
      </s-modal-card>
    </q-dialog>

    <q-dialog v-model="passwordDialog">
      <PasswordOnceDialog v-if="password" :password="password.value" :username="password.username" @close="passwordDialog = false; password = null" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { tdc, url, errorMessage, sDialog } from 'quasar_resaas'
import { useVirtualLabStore } from '../virtualStore'
import PasswordOnceDialog from './PasswordOnceDialog.vue'

// Virtual labs (the former Lab Manager): a lab per class and subject, a
// virtual machine (a Docker container) per student, run from here.
const $q = useQuasar()
const Lab = useVirtualLabStore()
const sel = (path, params = {}) => url({ type: 'u', url: path, params: { select: 'true', ...params } })
const classUrl = sel('academica/classgroups')
const subjectUrl = sel('academica/subjects')
const environmentUrl = sel('laboratorio/environments')

const colors = { running: 'positive', stopped: 'grey-7', missing: 'negative', deleted: 'grey-5' }
const statusLabel = { running: 'Running', stopped: 'Stopped', missing: 'Missing', deleted: 'Deleted' }
const modeOptions = computed(() => [{ label: tdc('Shared'), value: 'shared' }, { label: tdc('Isolated'), value: 'isolated' }])

const labs = ref([])
const current = ref(null)
const machines = ref([])
const mode = ref('shared')
const busy = ref(false)
const error = ref('')
const dialogError = ref('')
const newDialog = ref(false)
const addDialog = ref(false)
const passwordDialog = ref(false)
const password = ref(null)
const form = reactive({ name: '', description: '', class_group: null, subject: null, environment: null })
const add = reactive({ enrolment: null, username: '', ram: '', cpus: '' })

const value = (field) => (field && typeof field === 'object' ? field.value ?? field.id : field)
const label = (field) => (field && typeof field === 'object' ? field.label : field) || ''
const enrolmentUrl = computed(() => sel('academica/enrolments', { class_group: value(current.value?.class_group) || undefined, status: 'active' }))
const fail = (e, target = error) => { target.value = errorMessage(e) || tdc('An error occurred. Please try again.') }

async function load () {
  try { labs.value = await Lab.labs() } catch (e) { fail(e) }
}

async function open (row) {
  current.value = row
  mode.value = value(row.network_mode)
  error.value = ''
  try { machines.value = await Lab.machines(row.id) } catch (e) { fail(e) }
}

async function reopen () {
  await load()
  const again = labs.value.find(r => r.id === current.value?.id)
  if (again) await open(again)
}

async function createLab () {
  busy.value = true
  dialogError.value = ''
  try {
    const body = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== null && v !== ''))
    const saved = await Lab.createLab(body)
    newDialog.value = false
    Object.assign(form, { name: '', description: '', class_group: null, subject: null, environment: null })
    await load()
    const row = labs.value.find(r => r.id === saved.id)
    if (row) await open(row)
  } catch (e) { fail(e, dialogError) } finally { busy.value = false }
}

async function setMode (to) {
  busy.value = true
  try { await Lab.labAction(current.value.id, 'network_mode', { mode: to }); await reopen() } catch (e) { fail(e); mode.value = value(current.value.network_mode) } finally { busy.value = false }
}

async function labAction (action) {
  busy.value = true
  try { await Lab.labAction(current.value.id, action); machines.value = await Lab.machines(current.value.id) } catch (e) { fail(e) } finally { busy.value = false }
}

async function createClass () {
  busy.value = true
  try {
    await Lab.labAction(current.value.id, 'create_machines')
    $q.notify({ type: 'info', message: tdc('The class machines are being created. Each student renews their own password in My virtual machines.') })
  } catch (e) { fail(e) } finally { busy.value = false }
}

async function createMachine () {
  busy.value = true
  dialogError.value = ''
  try {
    const body = { lab: current.value.id, ...Object.fromEntries(Object.entries(add).filter(([, v]) => v !== null && v !== '')) }
    const made = await Lab.createMachine(body)
    addDialog.value = false
    Object.assign(add, { enrolment: null, username: '', ram: '', cpus: '' })
    password.value = { value: made.password, username: made.access?.ssh || made.username }
    passwordDialog.value = true
    machines.value = await Lab.machines(current.value.id)
  } catch (e) { fail(e, dialogError) } finally { busy.value = false }
}

async function machineAction (vm, action) {
  try {
    await Lab.machineAction(vm.id, action)
    if (action === 'backup') $q.notify({ type: 'positive', message: tdc('Backup created.') })
    machines.value = await Lab.machines(current.value.id)
  } catch (e) { fail(e) }
}

async function renew (vm) {
  try {
    const { password: value } = await Lab.machineAction(vm.id, 'renew_password')
    password.value = { value, username: vm.access?.ssh || vm.username }
    passwordDialog.value = true
  } catch (e) { fail(e) }
}

function remove (vm) {
  sDialog({
    title: tdc('Delete the machine?'),
    message: tdc('The container is removed; the student\'s home folder (volume) is kept.'),
    persistent: true,
    ok: { label: tdc('Delete'), color: 'negative', flat: true },
    cancel: { label: tdc('Back'), flat: true },
  }).onOk(async () => {
    try { await Lab.deleteMachine(vm.id); machines.value = await Lab.machines(current.value.id) } catch (e) { fail(e) }
  })
}

onMounted(load)
</script>

<style scoped>
.vl-list { max-height: calc(100vh - 140px); overflow-y: auto; }
</style>
