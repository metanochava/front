<template>
  <q-page class="q-pa-sm">
    <s-auto-crud
      :key="model"
      app="farmacia"
      :model="model"
      :ignoreFields="ignoreFields"
      :extraActions="extraActions"
      @runaction="onRunAction"
    />
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'quasar_resaas'

const props = defineProps({ model: { type: String, required: true } })

// main_photo: a RESAAS File, uploaded on the Photos page (not picked by id here)
const ignoreFields = ['created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at', 'main_photo']
const router = useRouter()
const User = useUserStore()

// the catalogue's photos and videos (main photo and gallery) have their own page
const extraActions = computed(() => (
  props.model === 'MedicineCatalogItem' && User.can('list_medicinecatalogmedia')
    ? [{ action: 'Photos', icon: 'photo_library', method: 'get', position: 'l', tooltip: 'Photos and videos', visible: true }]
    : []
))

function onRunAction (obj, row) {
  if (obj.action === 'Photos') router.push({ name: 'view_medicine_media', params: { id: row.id } })
}
</script>
