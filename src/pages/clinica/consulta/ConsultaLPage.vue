<template>
  <q-page class="q-pa-sm">
    <AutoCrud :module="module" :model="model" :can="User.can"/>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { AutoCrud, useUserStore } from 'quasar_resaas'

const User = useUserStore()

onMounted(async () => {

})
</script>
