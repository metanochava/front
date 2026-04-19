
<template>
  <q-page class="q-pa-sm">
    <AutoCrud :module="module" :model="model" :can="User.can" :ignoreFields="ignoreFields" route="view_departamento"  />
  </q-page>
</template>

<script setup>

import { AutoCrud } from 'quasar_resaas'
import { useUserStore } from 'quasar_resaas'

import { ref, watch, onMounted} from 'vue'
import { useRoute } from 'vue-router'


const User =useUserStore()
const route = useRoute()
const module = ref('rh')
const model = ref('Departamento')
const ignoreFields = ref(['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at'] )

onMounted(async () => {

})

// 🔥 WATCH REATIVO DA ROTA
watch(
  () => route.params,
  () => {

  },
  { immediate: true }
)
</script>

