<template>
  <q-page class="q-pa-sm">
    <!-- configuration of the structured result form: the parameters of each
         exam (saude/models/exam_parameter.py). Generic list, create and edit -->
    <s-auto-crud app="saude" model="Examparameter" route="list_examparameter" :ignore-fields="ignoreFields" />
  </q-page>
</template>

<script setup>
const ignoreFields = ['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']
</script>
