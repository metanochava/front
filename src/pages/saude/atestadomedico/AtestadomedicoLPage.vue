
<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      :app="app" :model="model"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>


import { ref, onMounted} from 'vue'

const app = ref('saude')
const model = ref('Atestadomedico')

onMounted(async () => {

})
</script>


