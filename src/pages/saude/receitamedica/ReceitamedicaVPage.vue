
<template>

  <FormSaveEdit
    :schema="schema"
    :module="module"
    :model="model"
    :data="selectedRow"
    :can-do="User.can"
    :ignore-fields="ignoreFields"
    @saved="onSaved"
  />

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FormSaveEdit, buildFormFromSchema, useUserStore, HTTPAuth, url } from 'quasar_resaas'

// ----------------------------------
// STORE
// ----------------------------------
const User = useUserStore()

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STATE
// ----------------------------------
const schema = ref([])
const selectedRow = ref(null)

// ----------------------------------
// CONFIG
// ----------------------------------
const module = 'saude'
const model = 'Saude'

const schemaPath = 'fields'

const ignoreFields = [
  'created_at',
  'updated_at',
  'created_by',
  'updated_by'
]

// ----------------------------------
// LOAD DATA (EDIT)
// ----------------------------------
async function loadRow(id) {
  if (!id) {
    selectedRow.value = null
    return
  }

  const { data } = await HTTPAuth.get(
    url({
      type: 'u',
      url: `api/${module}/${model}s/${id}/`
    })
  )

  selectedRow.value = data
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  const data = await buildFormFromSchema({
    module,
    model,
    schemaPath,
  })

  schema.value = data.schema

  // 🔥 verifica se tem ID na rota
  const id = route.params.id || route.query.id

  await loadRow(id)
}

// ----------------------------------
// EVENTS
// ----------------------------------
function onSaved() {
  console.log('salvo')
}

// ----------------------------------
// WATCH (se mudar rota)
// ----------------------------------
watch(
  () => route.fullPath,
  async () => {
    await init()
  }
)

// ----------------------------------
// LIFECYCLE
// ----------------------------------
onMounted(async () => {
  await init()
})
</script>
