<template>
  <q-page class="q-pa-sm">
    <!-- reference ranges of numeric parameters: laboratory configuration,
         never defaulted (saude/models/exam_parameter.py) -->
    <s-auto-crud app="saude" model="Examreferencerange" route="list_examreferencerange" :ignore-fields="ignoreFields" />
  </q-page>
</template>

<script setup>
const ignoreFields = ['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']
</script>
