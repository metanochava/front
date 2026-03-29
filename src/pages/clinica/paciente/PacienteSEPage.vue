
<template>


    <AutoForm
      v-model="showForm"
      :schema="schema"
      :module="module"
      :model="model"
      :data="selectedRow"
      :can-do="canDo"
      :ignoreFields="ignoreFields"
      @saved="onSaved"
    />

</template>
<script setup>
import { ref, watch } from 'vue'

import { UserStore } from 'quasar_resaas'


const User = UserStore()

import { AutoForm } from 'quasar_resaas'


// import { HTTPAuth, url } from 'quasar_resaas'
import { buildFormFromSchema } from 'quasar_resaas'

// --- props ---
const props = defineProps({
  module: { type: String, required: true },
  model: { type: String, required: true },
  can: { type: Function, default: null },
  schemaPath: { type: String, default: 'fields' },
  route: { type: [String, Object], default: null },
  ignoreFields: { type: Array, default: () =>  ['id', 'created_at','updated_at', 'created_by', 'updated_by'] },
})

// --- state ---
const schema = ref([])



const showForm = ref(true)

const selectedRow = ref(null)

function canDo(perm) {
  if (!perm) return true
  if (typeof props.can === 'function') return !!User.can(perm)
  return true
}

// --- INIT ---
async function init() {
  if (!props.module || !props.model) return

  schema.value = await buildFormFromSchema({
    module: props.module,
    model: props.model,
    schemaPath: props.schemaPath,
  })
}







async function onSaved() {
  clean()
}

// --- FILTER ---
function clean(obj) {
  const out = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      out[k] = v
    }
  })
  return out
}



// --- WATCH ---
watch(
  () => props.model,
  async (model) => {
    if (!model) return
    await init()
  },
  { immediate: true }
)
</script>
