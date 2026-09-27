<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'

import '../css/resaas.css'
import { search } from '../docs'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const THEME_KEY = 'rs_theme'

const links = [
  { to: '/docs/guide/start-here', label: 'Guide', product: 'guide' },
  { to: '/docs/django-resaas/getting-started/installation', label: 'Backend', product: 'django-resaas' },
  { to: '/docs/quasar-resaas/getting-started/installation', label: 'Frontend', product: 'quasar-resaas' }
]

// ------------------------------------------------------------ search
const query = ref('')
const searchOpen = ref(false)
const searchInput = ref(null)
const results = computed(() => search(query.value))

function openResult (result) {
  searchOpen.value = false
  query.value = ''
  router.push({ path: `/docs/${result.product}/${result.slug}`, query: result.heading ? { h: result.heading } : {} })
}

function onKey (event) {
  // "/" focuses the search, like most documentation sites
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault()
    searchInput.value?.focus?.()
  }
  if (event.key === 'Escape') searchOpen.value = false
}

// ------------------------------------------------------------ theme and fonts
function toggleTheme () {
  $q.dark.set(!$q.dark.isActive)
  try { localStorage.setItem(THEME_KEY, $q.dark.isActive ? 'dark' : 'light') } catch { /* not remembered */ }
}

function loadFonts () {
  if (document.getElementById('rs-fonts')) return
  const link = document.createElement('link')
  link.id = 'rs-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'
  document.head.appendChild(link)
}

onMounted(() => {
  let stored = null
  try { stored = localStorage.getItem(THEME_KEY) } catch { stored = null }
  $q.dark.set(stored ? stored === 'dark' : false)
  loadFonts()
  document.title = 'RESAAS — documentation'
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const activeProduct = computed(() => route.params.product || null)
</script>

<template>
  <q-layout view="hHh lpR fff" class="rs">
    <q-header class="rs-header">
      <div class="rs-header__inner">
        <router-link to="/home" class="rs-brand" aria-label="RESAAS">
          <span class="rs-brand__mark">R</span>
          <span class="rs-brand__name">RESAAS</span>
          <span class="rs-brand__tag">docs</span>
        </router-link>

        <nav class="rs-nav" :aria-label="tdc('Main navigation')">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rs-nav__link"
            :class="{ 'is-active': activeProduct === link.product }"
          >{{ tdc(link.label) }}</router-link>
        </nav>

        <div class="rs-search">
          <s-input
            ref="searchInput"
            v-model="query"
            dense
            outlined
            type="search"
            :placeholder="tdc('Search the docs') + '  ( / )'"
            class="rs-search__input"
            data-test="docs-search"
            @focus="searchOpen = true"
            @update:model-value="searchOpen = true"
          />
          <div v-if="searchOpen && query.length > 1" class="rs-search__results" data-test="docs-search-results">
            <button
              v-for="r in results"
              :key="r.product + r.slug"
              type="button"
              class="rs-search__item"
              @mousedown.prevent="openResult(r)"
            >
              <span class="rs-search__product" :class="`rs-search__product--${r.product}`">{{ r.product === 'guide' ? tdc('Guide') : r.product.replace('-', '_') }}</span>
              <span class="rs-search__title">{{ r.title }}<em v-if="r.heading"> › {{ r.heading }}</em></span>
              <span class="rs-search__excerpt">{{ r.excerpt }}</span>
            </button>
            <div v-if="!results.length" class="rs-search__empty">{{ tdc('No results') }}</div>
          </div>
        </div>

        <div class="rs-tools">
          <s-btn
            flat round dense
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            :aria-label="tdc('Toggle theme')"
            @click="toggleTheme"
          />
          <s-btn flat round dense icon="code" :aria-label="'GitHub'">
            <q-menu anchor="bottom right" self="top right">
              <q-list dense style="min-width: 220px">
                <q-item clickable tag="a" href="https://github.com/metanochava/django_resaas" target="_blank" rel="noopener noreferrer">
                  <q-item-section avatar><q-icon name="dns" /></q-item-section>
                  <q-item-section>django_resaas</q-item-section>
                </q-item>
                <q-item clickable tag="a" href="https://github.com/metanochava/quasar_resaas" target="_blank" rel="noopener noreferrer">
                  <q-item-section avatar><q-icon name="bolt" /></q-item-section>
                  <q-item-section>quasar_resaas</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </s-btn>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.rs-header { background: color-mix(in srgb, var(--rs-bg) 85%, transparent); backdrop-filter: blur(14px); color: var(--rs-text); border-bottom: 1px solid var(--rs-line); }
.rs-header__inner { height: var(--rs-header); max-width: 1440px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; gap: 22px; }

.rs-brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--rs-font-display); font-weight: 800; font-size: 18px; }
.rs-brand__mark { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, var(--rs-back), var(--rs-front)); }
.rs-brand__tag { font-family: var(--rs-mono); font-weight: 500; font-size: 12px; color: var(--rs-muted); padding: 2px 8px; border: 1px solid var(--rs-line); border-radius: 999px; }

.rs-nav { display: flex; gap: 2px; }
.rs-nav__link { padding: 7px 12px; border-radius: 8px; color: var(--rs-muted); font-weight: 500; font-size: 15px; }
.rs-nav__link:hover { color: var(--rs-text); background: var(--rs-surface); }
.rs-nav__link.is-active { color: var(--rs-text); background: var(--rs-surface-2); }

.rs-search { position: relative; margin-left: auto; width: min(340px, 34vw); }
.rs-search__results {
  position: absolute; right: 0; top: calc(100% + 6px); width: min(560px, 90vw); max-height: 70vh; overflow-y: auto; z-index: 10;
  background: var(--rs-bg); border: 1px solid var(--rs-line); border-radius: 12px; box-shadow: 0 24px 50px -20px rgba(0, 0, 0, .35); padding: 6px;
}
.rs-search__item { display: grid; gap: 2px; width: 100%; text-align: left; padding: 10px 12px; border: 0; border-radius: 8px; background: transparent; color: var(--rs-text); cursor: pointer; font: inherit; }
.rs-search__item:hover { background: var(--rs-surface); }
.rs-search__product { font-family: var(--rs-mono); font-size: 11px; color: var(--rs-muted); }
.rs-search__product--django-resaas { color: var(--rs-back); }
.rs-search__product--quasar-resaas { color: var(--rs-front); }
.rs-search__title { font-weight: 600; font-size: 14.5px; }
.rs-search__title em { font-style: normal; color: var(--rs-muted); font-weight: 500; }
.rs-search__excerpt { font-size: 13px; color: var(--rs-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rs-search__empty { padding: 14px; color: var(--rs-muted); font-size: 14px; }

.rs-tools { display: flex; gap: 2px; }

@media (max-width: 860px) {
  .rs-nav { display: none; }
  .rs-brand__tag { display: none; }
  .rs-search { width: auto; flex: 1; }
}
</style>
