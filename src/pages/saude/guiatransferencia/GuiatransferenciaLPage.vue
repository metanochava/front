
<template>
  <q-page class="q-pa-sm">
    <AutoCrud
      :app="app" :model="model"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>

import { AutoCrud } from 'quasar_resaas'
import { ref, onMounted} from 'vue'

const app = ref('saude')
const model = ref('Guiatransferencia')

onMounted(async () => {

})
</script>


