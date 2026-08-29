
<template>
  <q-page class="q-pa-sm">
    <s-auto-crud :app="module" :model="model" :ignoreFields="ignoreFields" />
  </q-page>
</template>

<script setup>



import { ref, watch, onMounted} from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const module = ref('rh')
const model = ref('Contrato')
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

