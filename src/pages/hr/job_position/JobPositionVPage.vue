<template>
  <q-page class="q-pa-sm">
    <!-- FORM -->
    <div v-if="JobPosition.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>
    <FormTwo
      v-else
      :store="JobPosition"
      :ignore-fields="ignoreFields"
      @saved="onSaved"
    />

  </q-page>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJobPositionStore } from '../stores/JobPositionStore.js'
import { FormTwo } from 'quasar_resaas'

// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const JobPosition = useJobPositionStore()

// ---------------- STATE ----------------
const ready = ref(false)

const ignoreFields = [
  'id',
  'created_at',
  'updated_at',
  'created_by',
  'updated_by',
  'deleted_at'
]

// ---------------- PERMISSIONS ----------------
// ---------------- LOAD DATA ----------------
async function load(id) {

  if (!id) {

    JobPosition.resetForm?.()
    return
  }


  // avoids duplicate calls with a safe comparison
  if (String(JobPosition.row?.id) === String(id)) {
    JobPosition.form = JobPosition.row
    return
  }

  JobPosition.row = await JobPosition.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {
    ready.value = false

    await JobPosition.init()

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