<template>
  <q-page v-if="Item.row" class="q-pa-sm" data-test="medicine-photos-page">
    <div class="text-h6 q-mb-md row items-center">
      <q-icon name="photo_library" class="q-mr-sm" />
      {{ tdc('Photos and videos') }} — {{ Item.row.name }} {{ Item.row.strength }}
      <q-space />
      <s-btn flat icon="arrow_back" label="Back" :to="{ name: 'list_medicinecatalogitem' }" />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <s-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ tdc('Main photo') }}</div>
            <q-img v-if="Item.row.image?.url" :src="Item.row.image.url" ratio="1" fit="contain" class="rounded-borders" />
            <div v-else class="text-caption text-grey-6">{{ tdc('No main photo') }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              {{ tdc('To change the main photo, edit the medicine in the catalogue.') }}
            </div>
          </q-card-section>
        </s-card>
      </div>

      <div v-if="canAdd" class="col-12 col-md-8">
        <s-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ tdc('Add photo or video') }}</div>
            <s-form-two
              v-if="Media.fields.length"
              :store="Media"
              :ignore-fields="['id', 'catalog_item', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at']"
              @saved="onSaved"
            />
            <div v-else class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="48px" />
            </div>
          </q-card-section>
        </s-card>
      </div>
    </div>

    <s-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ tdc('Gallery') }} ({{ Media.rows.length }})</div>
        <div v-if="!Media.rows.length" class="text-caption text-grey-6">{{ tdc('No photos or videos') }}</div>
        <div class="row q-col-gutter-md">
          <div v-for="photo in Media.rows" :key="photo.id" class="col-6 col-sm-4 col-md-3" data-test="medicine-media">
            <s-card flat bordered>
              <video v-if="photo.file?.kind === 'video'" :src="photo.file?.url" controls preload="metadata" class="media-tile" />
              <q-img v-else :src="photo.file?.url" ratio="1" fit="contain" />
              <q-card-section class="q-pa-sm row items-center no-wrap">
                <div class="col text-caption ellipsis">{{ photo.caption || photo.file?.name }}</div>
                <s-btn v-if="canDelete" flat dense round icon="delete" color="negative" size="sm" @click="removePhoto(photo)" />
              </q-card-section>
            </s-card>
          </div>
        </div>
      </q-card-section>
    </s-card>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="48px" />
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { sDialog, tdc, useUserStore } from 'quasar_resaas'
import { useMedicineCatalogMediaStore, useMedicineCatalogItemStore } from './medicineCatalogStores'

// The gallery (photos and videos) of a catalogue medicine (the main photo is the item's
// "image", edited in the catalogue form). The backend enforces the
// permissions; the buttons only follow them.
const route = useRoute()
const Item = useMedicineCatalogItemStore()
const Media = useMedicineCatalogMediaStore()
const User = useUserStore()

const canAdd = computed(() => User.can('add_medicinecatalogmedia'))
const canDelete = computed(() => User.can('delete_medicinecatalogmedia'))

async function fetchPhotos () {
  await Media.loadData({ catalog_item: route.params.id, page_size: 100 })
}

function prepareForm () {
  Media.resetForm()
  Media.form.catalog_item = route.params.id
}

async function onSaved () {
  await fetchPhotos()
  prepareForm()
}

function removePhoto (photo) {
  sDialog({ title: tdc('Delete'), message: tdc('Delete this photo or video?'), cancel: true }).onOk(async () => {
    await Media.removeById(photo.id)
    await fetchPhotos()
  })
}

onMounted(async () => {
  await Item.getById(route.params.id)
  await Media.loadSchemaOnce()
  prepareForm()
  await fetchPhotos()
})
</script>

<style scoped>
.media-tile {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background: #000;
}
</style>
