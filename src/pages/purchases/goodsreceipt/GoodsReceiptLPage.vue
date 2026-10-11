<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      app="purchases" model="GoodsReceipt"
      :ignoreFields="['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'idempotency_key']"
      :ignoreFieldsFilter="['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'idempotency_key']"
    />
  </q-page>
</template>
