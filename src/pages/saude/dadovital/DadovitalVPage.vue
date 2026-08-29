<template>
  <q-page class="q-pa-sm">
    <div v-if="Dadovital.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form
      v-else
      :store="Dadovital"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDadovitalStore } from './dadovitalStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Dadovital = useDadovitalStore()

// ----------------------------------
// LOAD DATA
// ----------------------------------
async function load(id) {
  if (!id) return
  Dadovital.row = await Dadovital.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  await Dadovital.init()
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
