<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      :key="model"
      app="hospitality" :model="model"
      :ignoreFields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'qr_token', 'current_sale_id']"
      :ignoreFieldsFilter="['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'qr_token', 'current_sale_id']"
    />
  </q-page>
</template>

<script setup>
defineProps({ model: { type: String, required: true } })
</script>
