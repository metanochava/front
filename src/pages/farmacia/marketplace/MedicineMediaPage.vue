<template>
  <q-page v-if="Item.row" class="q-pa-sm" data-test="medicine-photos-page">
    <div class="text-h6 q-mb-md row items-center">
      <q-icon name="photo_library" class="q-mr-sm" />
      {{ tdc('Photos and videos') }} — {{ Item.row.name }} {{ Item.row.strength }}
      <q-space />
      <s-btn flat icon="arrow_back" label="Back" :to="{ name: 'list_medicinecatalogitem' }">
        <s-tooltip>{{ tdc('Back') }}</s-tooltip>
      </s-btn>
    </div>

    <div class="row q-col-gutter-md">
      <!-- main photo: a RESAAS File, uploaded here (upload_main_photo) -->
      <div class="col-12 col-md-4">
        <s-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ tdc('Main photo') }}</div>
            <q-img
              v-if="Item.row.main_photo?.url"
              :src="Item.row.main_photo.url"
              ratio="1"
              fit="contain"
              class="rounded-borders"
              data-test="main-photo"
            />
            <div v-else class="text-caption text-grey-6">{{ tdc('No main photo') }}</div>

            <template v-if="canChange">
              <s-file
                v-model="mainPhoto"
                class="q-mt-md"
                label="Choose a photo"
                accept=".png,.jpg,.jpeg,.webp"
                data-test="main-photo-input"
              />
              <div class="row q-gutter-sm q-mt-sm">
                <s-btn
                  color="primary"
                  icon="upload"
                  label="Save main photo"
                  :disable="!mainPhoto"
                  :loading="savingMain"
                  data-test="main-photo-save"
                  @click="saveMainPhoto">
                  <s-tooltip>{{ tdc('Save main photo') }}</s-tooltip>
                </s-btn>
                <s-btn
                  v-if="Item.row.main_photo"
                  flat
                  color="negative"
                  icon="delete"
                  label="Remove main photo"
                  :loading="savingMain"
                  data-test="main-photo-remove"
                  @click="removeMainPhoto">
                  <s-tooltip>{{ tdc('Remove main photo') }}</s-tooltip>
                </s-btn>
              </div>
            </template>
          </q-card-section>
        </s-card>
      </div>

      <!-- add to the gallery: the upload becomes a RESAAS File -->
      <div v-if="canAdd" class="col-12 col-md-8">
        <s-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ tdc('Add photo or video') }}</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <s-file
                  v-model="Media.form.upload"
                  label="Photo or video"
                  accept=".png,.jpg,.jpeg,.webp,.mp4,.webm,.mov"
                  data-test="media-input"
                />
                <div v-if="uploadError" class="text-negative text-caption q-mt-xs" data-test="media-error">{{ uploadError }}</div>
              </div>
              <div class="col-12 col-sm-9">
                <s-input v-model="Media.form.caption" label="Caption" dense clearable />
              </div>
              <div class="col-12 col-sm-3">
                <s-input v-model.number="Media.form.position" type="number" min="0" label="Position" dense />
              </div>
            </div>
            <div class="row justify-end q-mt-sm">
              <s-btn
                color="primary"
                icon="add_photo_alternate"
                label="Add"
                :disable="!Media.form.upload"
                :loading="Media.loading"
                data-test="media-add"
                @click="addMedia">
                <s-tooltip>{{ tdc('Add') }}</s-tooltip>
              </s-btn>
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
          <div v-for="item in Media.rows" :key="item.id" class="col-6 col-sm-4 col-md-3" data-test="medicine-media">
            <s-card flat bordered>
              <video
                v-if="item.media_file?.kind === 'video'"
                :src="item.media_file?.url"
                controls
                preload="metadata"
                class="media-tile"
              />
              <q-img v-else :src="item.media_file?.url" ratio="1" fit="contain" />
              <q-card-section class="q-pa-sm row items-center no-wrap">
                <div class="col text-caption ellipsis">{{ item.caption || item.media_file?.name }}</div>
                <s-btn v-if="canDelete" flat dense round icon="delete" color="negative" size="sm" @click="removeMedia(item)">
                  <s-tooltip>{{ tdc('Delete') }}</s-tooltip>
                </s-btn>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { sDialog, tdc, useUserStore } from 'quasar_resaas'
import { useMedicineCatalogMediaStore, useMedicineCatalogItemStore } from './medicineCatalogStores'

// The photos and videos of a catalogue medicine. Every file is a RESAAS File
// (django_resaas File), created by the catalogue endpoints from the upload:
//   main photo -> PATCH farmacia/medicinecatalogitems/{id}/ {upload_main_photo | remove_main_photo}
//   gallery    -> POST  farmacia/medicinecatalogmedia/     {catalog_item, upload, caption, position}
// The backend enforces the permissions and the file rules; the buttons only follow them.
const route = useRoute()
const Item = useMedicineCatalogItemStore()
const Media = useMedicineCatalogMediaStore()
const User = useUserStore()

const canChange = computed(() => User.can('change_medicinecatalogitem'))
const canAdd = computed(() => User.can('add_medicinecatalogmedia'))
const canDelete = computed(() => User.can('delete_medicinecatalogmedia'))

const mainPhoto = ref(null)
const savingMain = ref(false)

// the upload's validation message (error.details.upload, or a non-field one)
const uploadError = computed(() => {
  const value = Media.errors?.upload || Media.errors?.error
  return Array.isArray(value) ? value.join(' ') : (value || '')
})

async function fetchItem () {
  await Item.getById(route.params.id, { force: true })
}

async function fetchMedia () {
  await Media.loadData({ catalog_item: route.params.id, page_size: 100 })
}

function prepareForm () {
  Media.form = { catalog_item: route.params.id, upload: null, caption: '', position: Media.rows.length }
  Media.errors = {}
}

async function patchItem (payload) {
  savingMain.value = true
  try {
    await Item.patchById(route.params.id, payload)
    mainPhoto.value = null
    await fetchItem()
  } finally {
    savingMain.value = false
  }
}

function saveMainPhoto () {
  if (mainPhoto.value) patchItem({ upload_main_photo: mainPhoto.value })
}

function removeMainPhoto () {
  sDialog({ title: tdc('Remove main photo'), message: tdc('Remove the main photo of this medicine?'), cancel: true })
    .onOk(() => patchItem({ remove_main_photo: true }))
}

async function addMedia () {
  try {
    await Media.create()
  } catch {
    return // the message stays under the file field (Media.errors)
  }
  await fetchMedia()
  prepareForm()
}

function removeMedia (item) {
  sDialog({ title: tdc('Delete'), message: tdc('Delete this photo or video?'), cancel: true }).onOk(async () => {
    await Media.removeById(item.id)
    await fetchMedia()
    prepareForm()
  })
}

onMounted(async () => {
  await fetchItem()
  await fetchMedia()
  prepareForm()
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
