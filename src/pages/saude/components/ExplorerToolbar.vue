<template>
  <div class="explorer-toolbar">
    <div class="row items-center q-col-gutter-sm">

      <div class="col-auto">
        <s-btn
          color="primary"
          icon="create_new_folder"
          label="Nova Pasta"
          unelevated
          @click="$emit('new-folder')"
        />
      </div>

      <div class="col-auto">
        <s-btn
          color="primary"
          icon="attach_file"
          label="Upload"
          unelevated
          @click="$emit('upload')"
        />
      </div>

      <div class="col-auto">
        <s-btn
          flat
          color="grey-8"
          icon="edit"
          label="Renomear"
          :disable="!selected"
          @click="$emit('rename')"
        />
      </div>

      <div class="col-auto">
        <s-btn
          flat
          color="negative"
          icon="delete"
          label="Eliminar"
          :disable="!selected"
          @click="$emit('delete')"
        />
      </div>

      <div class="col-auto">
        <s-btn
          flat
          color="primary"
          icon="refresh"
          label="Atualizar"
          @click="$emit('refresh')"
        />
      </div>

      <q-space />

      <div class="col-md-3 col-sm-5 col-xs-12">
        <s-input
          v-model="search"
          dense
          outlined
          clearable
          label="Pesquisar resultados"
          prepend-icon="search"
          @update:model-value="$emit('search', search)"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  selected: {
    type: Object,
    default: null
  }
})

defineEmits([
  'new-folder',
  'upload',
  'rename',
  'delete',
  'refresh',
  'search'
])

const search = ref('')
</script>

<style scoped>
.explorer-toolbar {
  padding: 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}
</style>
