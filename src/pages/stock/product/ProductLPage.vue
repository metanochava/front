<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      app="inventory" model="Product"
      :ignoreFields="['created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :ignoreFieldsFilter="['id', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
      :extraActions="[
        { action: 'Galeria', icon: 'photo_library', method: 'get', position: 'l', tooltip: 'Imagens e vídeo do produto', visible: true },
      ]"
      @runaction="onRunAction"
    />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function onRunAction(obj, row) {
  if (obj.action === 'Galeria') {
    router.push({ name: 'view_product_gallery', params: { id: row.id } })
  }
}
</script>
