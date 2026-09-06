
<template>
  <q-page class="q-pa-sm">
    <s-auto-crud :app="module" :model="model" :ignoreFields="ignoreFields" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const module = ref('farmacia')
const model = ref('Dispensa')
const ignoreFields = ref(['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'])
</script>
