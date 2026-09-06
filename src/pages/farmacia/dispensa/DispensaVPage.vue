
<template>
  <q-page class="q-pa-sm">
    <div v-if="Dispensa.loading" class="flex flex-center q-pa-lg">
      <q-spinner size="40px" color="primary" />
    </div>
    <s-form
      v-else
      :store="Dispensa"
      :ignore-fields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDispensaStore } from './dispensaStore'

const route = useRoute()
const Dispensa = useDispensaStore()

async function load(id) {
  if (!id) return
  Dispensa.row = await Dispensa.getById(id)
}

async function init() {
  await Dispensa.init()
  await load(route.params.id)
}

watch(
  () => route.params,
  async (params) => {
    if (!params) return
    await load(params.id)
  }
)

onMounted(init)
</script>
