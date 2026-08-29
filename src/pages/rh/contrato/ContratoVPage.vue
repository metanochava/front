<template>
  <q-page class="q-pa-sm">
    <div v-if="Contrato.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form
      v-else
      :store="Contrato"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContratoStore } from './contratoStore'

// ----------------------------------
// ROUTE
// ----------------------------------
const route = useRoute()

// ----------------------------------
// STORE
// ----------------------------------
const Contrato = useContratoStore()

// ----------------------------------
// LOAD DATA
// ----------------------------------
async function load(id) {
  if (!id) return
  Contrato.row = await Contrato.getById(id)
}

// ----------------------------------
// INIT
// ----------------------------------
async function init() {
  await Contrato.init()
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
