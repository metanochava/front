<template>
  <q-page class="q-pa-sm" v-if="Product.row">
    <div class="text-h6 q-mb-md row items-center">
      <q-icon name="photo_library" class="q-mr-sm" />
      {{ tdc('Galeria') }} — {{ Product.row.nome }}
      <q-space />
      <q-btn flat icon="arrow_back" :label="tdc('Voltar')" :to="{ name: 'list_product' }" />
    </div>

    <div class="row q-col-gutter-md">

      <!-- IMAGEM PRINCIPAL -->
      <div class="col-12 col-md-4">
        <s-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ tdc('Imagem Principal') }}</div>
            <q-img
              v-if="Product.row.imagem?.url"
              :src="Product.row.imagem.url"
              ratio="1"
              class="rounded-borders"
            />
            <div v-else class="text-caption text-grey-6">{{ tdc('Sem imagem principal') }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              {{ tdc('Para alterar, edita o produto na listagem.') }}
            </div>
          </q-card-section>
        </s-card>
      </div>

      <!-- UPLOAD NOVA MÍDIA -->
      <div class="col-12 col-md-8">
        <s-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">{{ tdc('Adicionar à Galeria') }} ({{ tdc('imagem ou vídeo') }})</div>

            <s-form-two
              v-if="Productmedia.fields.length"
              :store="Productmedia"
              :ignore-fields="['id', 'product', 'entity', 'branch', 'state', 'ordem', 'created_at','updated_at', 'created_by', 'updated_by', 'deleted_at']"
              @saved="onSaved"
            />
            <div v-else class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="28px" />
            </div>
          </q-card-section>
        </s-card>
      </div>

    </div>

    <!-- GRELHA DA GALERIA -->
    <s-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ tdc('Galeria') }} ({{ Productmedia.rows.length }})</div>

        <div v-if="!Productmedia.rows.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>

        <div class="row q-col-gutter-md">
          <div v-for="item in Productmedia.rows" :key="item.id" class="col-6 col-sm-4 col-md-3">
            <s-card flat bordered>
              <video
                v-if="item.file?.kind === 'video'"
                :src="item.file?.url"
                controls
                class="gallery-media"
              />
              <q-img
                v-else
                :src="item.file?.url"
                ratio="1"
                class="gallery-media"
              />
              <q-card-section class="q-pa-sm">
                <div class="text-caption ellipsis">{{ item.legenda || item.file?.name }}</div>
                <div class="row justify-end">
                  <q-btn flat dense round icon="delete" color="negative" size="sm" @click="removeMedia(item)" />
                </div>
              </q-card-section>
            </s-card>
          </div>
        </div>
      </q-card-section>
    </s-card>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc } from 'quasar_resaas'
import { useProductStore } from './../product/productStore'
import { useProductmediaStore } from './productmediaStore'

const route = useRoute()
const Product = useProductStore()
const Productmedia = useProductmediaStore()

async function fetchGallery() {
  await Productmedia.loadData({ product: route.params.id, page_size: 100 })
}

function prepareNewForm() {
  Productmedia.resetForm()
  Productmedia.form.product = route.params.id
}

async function onSaved() {
  await fetchGallery()
  prepareNewForm()
}

async function removeMedia(item) {
  Productmedia.form = { id: item.id }
  await Productmedia.remove()
  await fetchGallery()
}

onMounted(async () => {
  await Product.getById(route.params.id)
  await Productmedia.loadSchemaOnce()
  prepareNewForm()
  await fetchGallery()
})
</script>

<style scoped>
.gallery-media {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
</style>
