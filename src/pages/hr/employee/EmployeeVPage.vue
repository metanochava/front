<template>
  <div class="q-pa-sm">
    <!-- FORM -->
    <div v-if="Employee.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
    </div>
    <FormTwo
      v-else
      :store="Employee"
      :ignore-fields="ignoreFields"
      @saved="onSaved"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEmployeeStore } from '../stores/EmployeeStore.js'
import { FormTwo } from 'quasar_resaas'

// ---------------- ROUTE ----------------
const route = useRoute()

// ---------------- STORE ----------------
const Employee = useEmployeeStore()

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

    Employee.resetForm?.()
    return
  }


  // 🔥 avoids duplicate calls with a safe comparison
  if (String(Employee.row?.id) === String(id)) {
    Employee.form = Employee.row 
    return
  }

  Employee.row =  await Employee.getById(id)
}

// ---------------- INIT ----------------
async function init() {
  try {
    ready.value = false

    await Employee.init()

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

    // 🔥 always reloads when the route changes
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