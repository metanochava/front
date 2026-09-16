<template>
  <q-page class="q-pa-sm">
    <div v-if="Classeexamemedico.loading" class="flex flex-center q-pa-lg">
      <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" /> </div> <s-form v-else :store="Classeexamemedico" :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']" />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useClasseexamemedicoStore } from './classeexamemedicoStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Classeexamemedico = useClasseexamemedicoStore()

// ----------------------------------
// LOAD DATA
// ----------------------------------
async function load(id) {
  if (!id) return
  Classeexamemedico.row = await Classeexamemedico.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  await Classeexamemedico.init()
  await load(route.params.id)
}

// ----------------------------------
// WATCH (se mudar rota)
// ----------------------------------
watch(
  () => route.params,
  async (params) => {
    if (!params) return
    await load(params.id)
  }
)

// ----------------------------------
// LIFECYCLE
// ----------------------------------
onMounted(init)
</script>
