<template>
  <q-page class="q-pa-sm">
    <!-- FORM -->
    <div v-if="LeaveBalanceEntry.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>
    <FormTwo
      v-else
      :store="LeaveBalanceEntry"
      :ignore-fields="ignoreFields"
      @saved="onSaved"
    />

  </q-page>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLeaveBalanceEntryStore } from '../stores/LeaveBalanceEntryStore.js'
import { FormTwo } from 'quasar_resaas'

// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const LeaveBalanceEntry = useLeaveBalanceEntryStore()

// ---------------- STATE ----------------
const ready = ref(false)

const ignoreFields = [
  'id',
  'created_at',
  'updated_at',
  'created_by',
  'updated_by',
  'deleted_at',
  'reference'
]

// ---------------- PERMISSIONS ----------------
// ---------------- LOAD DATA ----------------
async function load(id) {

  if (!id) {

    LeaveBalanceEntry.resetForm?.()
    return
  }


  // avoids duplicate calls with a safe comparison
  if (String(LeaveBalanceEntry.row?.id) === String(id)) {
    LeaveBalanceEntry.form = LeaveBalanceEntry.row
    return
  }

  LeaveBalanceEntry.row = await LeaveBalanceEntry.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {
    ready.value = false

    await LeaveBalanceEntry.init()

    const id = route.params.id
    await load(id)

    ready.value = true

  } catch (err) {
    console.error('Error initializing page:', err)
  }
}

// ---------------- WATCH ROUTE (FIXED) ----------------
watch(
  () => route.params,
  async (params) => {
    if (!params) return

    const id = params.id

    // always reloads when the route changes
    await load(id)
  },
  { immediate: false } // init already handles the first load
)

// ---------------- EVENTS ----------------
function onSaved() {
  // the page reloads itself after saving
}

// ---------------- LIFECYCLE ----------------
onMounted(init)
</script>
