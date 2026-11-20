<template>
  <div class="pos-grid column no-wrap">

    <!-- search / scan: a plain q-input, the scanner field needs focus() after
         every read, which s-input does not expose -->
    <div class="row items-center no-wrap q-gutter-x-sm q-mb-sm">
      <q-input
        ref="searchRef"
        v-model="search"
        class="col pos-search"
        :placeholder="tdc('Search or scan a product')"
        outlined dense rounded clearable
        :color="feedback === 'error' ? 'negative' : feedback === 'ok' ? 'positive' : 'primary'"
        debounce="250"
        data-test="pos-search"
        @update:model-value="loadProducts"
        @keyup.enter="onEnter"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <s-btn round unelevated color="primary" icon="photo_camera" @click="showCamera = true">
        <s-tooltip>{{ tdc('Scan with camera') }}</s-tooltip>
      </s-btn>
    </div>
    <div v-if="scanError" class="text-negative text-caption q-mb-xs">{{ scanError }}</div>

    <!-- categories -->
    <div v-if="categories.length" class="pos-chips row no-wrap q-gutter-x-xs q-mb-sm">
      <s-btn
        no-caps rounded unelevated size="sm"
        :color="category === null ? 'primary' : undefined"
        :outline="category !== null"
        :label="tdc('All')"
        @click="pickCategory(null)"
      >
        <s-tooltip>{{ tdc('Every category') }}</s-tooltip>
      </s-btn>
      <s-btn
        v-for="c in categories" :key="c.id"
        no-caps rounded unelevated size="sm"
        :color="category === c.id ? 'primary' : undefined"
        :outline="category !== c.id"
        :label="c.nome"
        data-test="pos-category"
        @click="pickCategory(c.id)"
      >
        <s-tooltip>{{ tdc('Show this category') }}</s-tooltip>
      </s-btn>
    </div>

    <!-- products -->
    <div class="col pos-grid__scroll">
      <div v-if="loading && !products.length" class="flex flex-center q-pa-xl">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="40px" />
      </div>
      <div v-else-if="!products.length" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="local_bar" size="40px" class="q-mb-sm" /><br>
        {{ tdc('No products') }}
      </div>
      <div v-else class="pos-tiles">
        <button
          v-for="p in products" :key="p.id"
          type="button"
          class="pos-tile"
          :class="{ 'pos-tile--dark': $q.dark.isActive }"
          :disabled="disabled"
          data-test="pos-product"
          @click="pick(p)"
        >
          <div class="pos-tile__media" :class="!p.imagem?.url ? `bg-${colorOf(p.nome)}` : ''">
            <img v-if="p.imagem?.url" :src="p.imagem.url" :alt="p.nome" loading="lazy">
            <span v-else class="pos-tile__initials">{{ initials(p.nome) }}</span>
          </div>
          <div class="pos-tile__name">{{ p.nome }}</div>
          <div class="pos-tile__price">{{ money(p.preco_base) }}</div>
          <s-tooltip>{{ tdc('Add to the cart') }}</s-tooltip>
        </button>
      </div>
    </div>

    <camera-scanner-dialog v-model="showCamera" @decoded="onCamera" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import CameraScannerDialog from 'src/components/CameraScannerDialog.vue'

// The catalog's active items as big touch tiles (phone, tablet), with search,
// barcode (typed, scanner gun or camera) and category chips. The price shown
// is the base one; the cart shows the customer's (the backend prices it).
defineProps({ disabled: { type: Boolean, default: false } })
const emit = defineEmits(['add'])

const products = ref([])
const categories = ref([])
const category = ref(null)
const search = ref('')
const loading = ref(false)
const feedback = ref(null)
const scanError = ref('')
const showCamera = ref(false)
const searchRef = ref(null)
let feedbackTimer = null

const PALETTE = ['indigo', 'teal', 'deep-orange', 'purple', 'blue', 'green', 'pink', 'amber-8', 'cyan-8', 'brown']

function colorOf (name) {
  let h = 0
  for (const ch of String(name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
}

function initials (name) {
  return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function money (v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0)
}

function focus () {
  nextTick(() => searchRef.value?.focus())
}

function flash (kind) {
  feedback.value = kind
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1200)
}

async function loadProducts () {
  loading.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'catalog/products',
      params: { search: search.value || undefined, categoria: category.value || undefined, ativo: true, page_size: 60 },
    }))
    products.value = data.results ?? data ?? []
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

async function loadCategories () {
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'catalog/productcategorys', params: { ativo: true, page_size: 50 } }))
    categories.value = data.results ?? data ?? []
  } catch {
    categories.value = []
  }
}

function pickCategory (id) {
  category.value = id
  loadProducts()
}

function pick (product) {
  emit('add', product)
  flash('ok')
}

// Enter: an exact code (barcode) first, else the only search result
async function lookup (codigo) {
  scanError.value = ''
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'catalog/products', params: { codigo, page_size: 1 } }))
    const rows = data.results ?? data ?? []
    if (rows.length) {
      pick(rows[0])
      return true
    }
  } catch {
    // falls through to the message
  }
  flash('error')
  scanError.value = tdc('No product found for this code') + ` "${codigo}"`
  return false
}

async function onEnter () {
  const text = String(search.value || '').trim()
  if (!text) return
  if (await lookup(text)) {
    search.value = ''
    loadProducts()
  } else if (products.value.length === 1) {
    scanError.value = ''
    pick(products.value[0])
  }
  focus()
}

async function onCamera (text) {
  await lookup(String(text || '').trim())
}

onMounted(() => {
  loadProducts()
  loadCategories()
})

defineExpose({ focus, reload: loadProducts })
</script>

<style scoped>
.pos-grid { height: 100%; min-height: 0; }
.pos-grid__scroll { overflow-y: auto; min-height: 0; padding-bottom: 8px; }
.pos-chips { overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.pos-chips::-webkit-scrollbar { display: none; }

.pos-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 10px;
}

.pos-tile {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 10px;
  border: 1px solid rgba(128, 128, 128, 0.18);
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: center;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  -webkit-tap-highlight-color: transparent;
}
.pos-tile--dark { background: #1f1f24; border-color: rgba(255, 255, 255, 0.08); }
.pos-tile:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.10); }
.pos-tile:active { transform: scale(0.96); }
.pos-tile:disabled { opacity: 0.5; cursor: default; }

.pos-tile__media {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.pos-tile__media img { width: 100%; height: 100%; object-fit: cover; }
.pos-tile__initials { color: #fff; font-size: 1.5rem; font-weight: 700; letter-spacing: 1px; }

.pos-tile__name {
  padding: 0 8px;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.2;
  min-height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pos-tile__price { margin-top: 4px; font-weight: 700; color: var(--q-primary); font-size: 0.9rem; }

@media (min-width: 1024px) {
  .pos-tiles { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .pos-tile__media { height: 88px; }
}
</style>
