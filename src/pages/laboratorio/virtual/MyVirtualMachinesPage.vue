<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-6">
        <s-select v-model="enrolment" :options="enrolmentOptions" emit-value map-options :label="tdc('Enrolment')" />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner size="40px" :color="$q.dark.isActive ? 'white' : 'primary'" /></div>
    <div v-else-if="!machines.length" class="text-center text-grey-6 q-pa-xl">{{ tdc('No virtual machine yet') }}</div>

    <div class="row q-col-gutter-md">
      <div v-for="vm in machines" :key="vm.id" class="col-12 col-md-6">
        <s-card flat bordered class="q-pa-md vm-card" data-test="my-vm">
          <div class="row items-center no-wrap">
            <q-icon name="terminal" size="28px" color="primary" class="q-mr-sm" />
            <div class="col">
              <div class="text-subtitle1 text-weight-bold">{{ vm.lab }}</div>
              <div class="text-caption text-grey-7">{{ vm.description }}</div>
            </div>
            <q-badge :color="vm.status === 'running' ? 'positive' : 'grey-7'" :label="tdc(vm.status === 'running' ? 'Running' : 'Stopped')" />
          </div>
          <div class="q-mt-md">
            <div class="text-caption text-weight-bold">{{ tdc('Connect with SSH') }}</div>
            <div class="row items-center no-wrap vm-code">
              <code class="col ellipsis">{{ vm.access.ssh }}</code>
              <s-btn flat round dense icon="content_copy" @click="copy(vm.access.ssh)"><s-tooltip>{{ tdc('Copy the command') }}</s-tooltip></s-btn>
            </div>
            <div v-if="vm.access.http" class="q-mt-sm">
              <a :href="vm.access.http" target="_blank" rel="noopener"><q-icon name="language" /> {{ vm.access.http }}</a>
            </div>
          </div>
          <div class="row justify-end q-mt-md">
            <s-btn outline rounded no-caps icon="key" :label="tdc('New password')" :loading="busy === vm.id" data-test="my-vm-renew" @click="renew(vm)">
              <s-tooltip>{{ tdc('Get a new password for this machine (shown once)') }}</s-tooltip>
            </s-btn>
          </div>
        </s-card>
      </div>
    </div>

    <q-dialog v-model="passwordDialog">
      <PasswordOnceDialog v-if="password" :password="password.value" :username="password.username" @close="passwordDialog = false; password = null" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'
import { tdc, url, HTTPAuth, errorMessage } from 'quasar_resaas'
import { useVirtualLabStore } from '../virtualStore'
import PasswordOnceDialog from './PasswordOnceDialog.vue'

// The student's virtual machines: how to connect, and a new password on
// demand (shown once, never stored).
const $q = useQuasar()
const Lab = useVirtualLabStore()
const enrolments = ref([])
const enrolment = ref(null)
const machines = ref([])
const loading = ref(false)
const busy = ref(null)
const passwordDialog = ref(false)
const password = ref(null)

// academica enrolments/mine/: {id, student, academic_year: {name}, class_group, ...}
const enrolmentOptions = computed(() => enrolments.value.map(e => ({
  value: e.id, label: [e.student, e.academic_year?.name, e.class_group].filter(Boolean).join(' · '),
})))
const copy = (text) => copyToClipboard(text)

async function load () {
  if (!enrolment.value) return
  loading.value = true
  try { machines.value = await Lab.mine(enrolment.value) } finally { loading.value = false }
}

async function renew (vm) {
  busy.value = vm.id
  try {
    const { password: value } = await Lab.renewOwn(vm.id, enrolment.value)
    password.value = { value, username: vm.access.ssh }
    passwordDialog.value = true
  } catch (e) {
    $q.notify({ type: 'negative', message: errorMessage(e) || tdc('An error occurred. Please try again.') })
  } finally { busy.value = null }
}

watch(enrolment, load)

onMounted(async () => {
  const { data } = await HTTPAuth.get(url({ type: 'u', url: 'academica/enrolments/mine/' }))
  enrolments.value = data || []
  enrolment.value = enrolments.value[0]?.id || null
})
</script>

<style scoped>
.vm-card { border-radius: 14px; }
.vm-code { padding: 8px 10px; border-radius: 10px; background: rgba(128, 128, 128, 0.1); }
</style>
