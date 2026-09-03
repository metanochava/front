<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      app="inventory" model="Productcategory"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
    />
  </q-page>
</template>

<script setup>
</script>
