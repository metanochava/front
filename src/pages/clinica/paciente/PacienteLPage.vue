<template>
  <q-page class="q-pa-sm">
    <AutoCrud :module="module" :model="model" :can="User.can" :ignoreFields="ignoreFields" route="view_paciente"  />
  </q-page>
</template>

<script setup>

// import { HTTPAuth, url } from 'quasar_resaas'
import { AutoCrud } from 'quasar_resaas'
import { UserStore } from 'quasar_resaas'

import { ref, watch, onMounted} from 'vue'
import { useRoute } from 'vue-router'
// import { tdc } from '../../boot/base'

const User = UserStore()
const route = useRoute()
const module = ref('clinica')
const model = ref('Paciente')
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
