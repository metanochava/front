<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      :key="model"
      app="crm" :model="model"
      :ignoreFields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
defineProps({ model: { type: String, required: true } })
</script>
