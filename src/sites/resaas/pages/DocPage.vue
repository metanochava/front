<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'

import { renderDoc, headingId } from '../render'
import { docs, docKey, editUrl, groupedNav, neighbours, productByKey, products, titleOf, versions } from '../docs'

const route = useRoute()
const router = useRouter()

const product = computed(() => route.params.product)
const slug = computed(() => {
  const s = route.params.slug
  const joined = Array.isArray(s) ? s.join('/') : (s || '')
  return joined || (product.value === 'guide' ? 'start-here' : 'README')
})

const raw = computed(() => docs[docKey(product.value, slug.value)])
const rendered = computed(() => raw.value ? renderDoc(raw.value, product.value, slug.value) : null)
const info = computed(() => productByKey[product.value])
const groups = computed(() => groupedNav(product.value))
const around = computed(() => neighbours(product.value, slug.value))
const edit = computed(() => editUrl(product.value, slug.value))
const version = computed(() => versions?.[product.value])

const drawer = ref(false)
const activeId = ref('')
const body = ref(null)

// ------------------------------------------------------------ scrolling
function scrollToId (id, smooth = true) {
  const el = id && document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  return true
}

async function afterRender () {
  // the app router's scrollBehavior resets to the top after navigating: scroll after it
  await router.isReady()
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  const title = rendered.value ? titleOf(raw.value, slug.value) : tdc('Page not found')
  document.title = `${title} — RESAAS`
  const anchor = route.query.a || (route.query.h ? headingId(route.query.h) : '')
  if (!scrollToId(anchor, false)) window.scrollTo({ top: 0 })
  observeHeadings()
}

watch(() => route.fullPath, () => { drawer.value = false; afterRender() })

// ------------------------------------------------------------ table of contents highlight
let observer = null
function observeHeadings () {
  observer?.disconnect()
  if (!body.value || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible.length) activeId.value = visible[0].target.id
  }, { rootMargin: '-80px 0px -70% 0px' })
  body.value.querySelectorAll('h2[id], h3[id]').forEach(h => observer.observe(h))
}

// ------------------------------------------------------------ clicks inside the markdown
function onBodyClick (event) {
  const copy = event.target.closest('[data-copy]')
  if (copy) {
    const code = copy.closest('.rs-code')?.querySelector('code')?.innerText || ''
    navigator.clipboard?.writeText(code).then(() => {
      copy.textContent = tdc('Copied')
      setTimeout(() => { copy.textContent = 'copy' }, 1400)
    }).catch(() => {})
    return
  }

  const link = event.target.closest('a')
  if (!link) return
  if (link.dataset.to) {
    event.preventDefault()
    const query = link.dataset.anchor ? { a: link.dataset.anchor } : {}
    router.push({ path: link.dataset.to, query })
  } else if (link.dataset.hash !== undefined) {
    event.preventDefault()
    router.replace({ path: route.path, query: { a: link.dataset.hash } })
  }
}

function tocClick (id) {
  router.replace({ path: route.path, query: { a: id } })
}

function sidebarTo (item) {
  return `/docs/${item.product}/${item.slug}`
}

onMounted(afterRender)
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="rs-doc">
    <!-- sidebar -->
    <aside class="rs-side" :class="{ 'is-open': drawer }">
      <div class="rs-side__products">
        <router-link
          v-for="p in products"
          :key="p.key"
          :to="p.key === 'guide' ? '/docs/guide/start-here' : `/docs/${p.key}/README`"
          class="rs-side__product"
          :class="[`rs-side__product--${p.key}`, { 'is-active': p.key === product }]"
        >
          <q-icon :name="p.icon" size="18px" />
          <span>
            <strong>{{ p.key === 'guide' ? tdc('Guide') : p.label }}</strong>
            <small>{{ tdc(p.subtitle) }}</small>
          </span>
        </router-link>
      </div>

      <nav class="rs-side__nav" :aria-label="tdc('Documentation')">
        <router-link
          v-if="product !== 'guide'"
          :to="`/docs/${product}/README`"
          class="rs-side__link"
          :class="{ 'is-active': slug === 'README' }"
        >{{ tdc('Overview') }}</router-link>
        <div v-for="group in groups" :key="group.section" class="rs-side__group">
          <div class="rs-side__section">{{ group.section }}</div>
          <router-link
            v-for="item in group.items"
            :key="item.slug"
            :to="sidebarTo(item)"
            class="rs-side__link"
            :class="{ 'is-active': item.slug === slug && item.product === product }"
          >{{ item.title }}</router-link>
        </div>
      </nav>
    </aside>
    <div v-if="drawer" class="rs-side__scrim" @click="drawer = false" />

    <!-- content -->
    <main class="rs-main">
      <button type="button" class="rs-menu-btn" @click="drawer = true">
        <q-icon name="menu" size="18px" /> {{ tdc('Menu') }}
      </button>

      <template v-if="rendered">
        <div class="rs-crumbs">
          <span :class="`rs-crumbs__product rs-crumbs__product--${product}`">{{ product === 'guide' ? tdc('Guide') : info?.label }}</span>
          <span v-if="version" class="rs-crumbs__version">@ {{ version.commit }} · {{ version.date }}</span>
        </div>

        <!-- eslint-disable-next-line vue/no-v-html -- markdown of the libraries' own docs, rendered locally -->
        <article ref="body" class="rs-md" data-test="doc-body" @click="onBodyClick" v-html="rendered.html" />

        <div class="rs-doc__foot">
          <a v-if="edit" :href="edit" target="_blank" rel="noopener noreferrer" class="rs-doc__edit">
            <q-icon name="edit" size="16px" /> {{ tdc('View this page on GitHub') }}
          </a>
          <div class="rs-pager">
            <router-link v-if="around.prev" :to="sidebarTo(around.prev)" class="rs-pager__link">
              <small>{{ tdc('Previous') }}</small><span>{{ around.prev.title }}</span>
            </router-link>
            <span v-else />
            <router-link v-if="around.next" :to="sidebarTo(around.next)" class="rs-pager__link rs-pager__link--next">
              <small>{{ tdc('Next') }}</small><span>{{ around.next.title }}</span>
            </router-link>
          </div>
        </div>
      </template>

      <div v-else class="rs-md rs-missing" data-test="doc-missing">
        <h1>{{ tdc('Page not found') }}</h1>
        <p>{{ tdc('This page does not exist in the documentation.') }}</p>
        <router-link to="/docs/guide/start-here" class="rs-btn rs-btn--primary">{{ tdc('Start here') }}</router-link>
      </div>
    </main>

    <!-- table of contents -->
    <aside v-if="rendered && rendered.toc.length > 1" class="rs-toc">
      <div class="rs-toc__title">{{ tdc('On this page') }}</div>
      <a
        v-for="item in rendered.toc"
        :key="item.id"
        :href="`#${route.path}`"
        class="rs-toc__link"
        :class="[`rs-toc__link--${item.level}`, { 'is-active': activeId === item.id }]"
        @click.prevent="tocClick(item.id)"
      >{{ item.text }}</a>
    </aside>
  </div>
</template>

<style scoped>
.rs-doc {
  max-width: 1440px; margin: 0 auto; padding: 0 20px;
  display: grid; grid-template-columns: 270px minmax(0, 1fr) 220px; gap: 40px;
}

/* sidebar */
.rs-side { position: sticky; top: var(--rs-header); height: calc(100vh - var(--rs-header)); overflow-y: auto; padding: 24px 6px 40px 0; border-right: 1px solid var(--rs-line); }
.rs-side__products { display: grid; gap: 4px; margin-bottom: 18px; padding-right: 14px; }
.rs-side__product { display: flex; gap: 10px; align-items: center; padding: 8px 10px; border-radius: 10px; color: var(--rs-muted); border: 1px solid transparent; }
.rs-side__product span { display: grid; line-height: 1.25; }
.rs-side__product strong { font-size: 14px; color: var(--rs-text); font-weight: 600; }
.rs-side__product small { font-size: 12px; }
.rs-side__product:hover { background: var(--rs-surface); }
.rs-side__product.is-active { background: var(--rs-surface); border-color: var(--rs-line); }
.rs-side__product--django-resaas .q-icon { color: var(--rs-back); }
.rs-side__product--quasar-resaas .q-icon { color: var(--rs-front); }
.rs-side__product--guide .q-icon { color: var(--rs-accent); }

.rs-side__nav { padding-right: 14px; }
.rs-side__group { margin-top: 16px; }
.rs-side__section { font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--rs-muted); padding: 0 10px 6px; }
.rs-side__link { display: block; padding: 5px 10px; border-radius: 7px; font-size: 14.5px; color: var(--rs-muted); line-height: 1.4; }
.rs-side__link:hover { color: var(--rs-text); background: var(--rs-surface); }
.rs-side__link.is-active { color: var(--rs-accent); background: color-mix(in srgb, var(--rs-accent) 10%, transparent); font-weight: 600; }

/* main */
.rs-main { padding: 32px 0 80px; min-width: 0; }
.rs-menu-btn { display: none; }
.rs-crumbs { display: flex; gap: 10px; align-items: center; margin-bottom: 14px; font-family: var(--rs-mono); font-size: 12.5px; }
.rs-crumbs__product { font-weight: 500; color: var(--rs-accent); }
.rs-crumbs__product--django-resaas { color: var(--rs-back); }
.rs-crumbs__product--quasar-resaas { color: var(--rs-front); }
.rs-crumbs__version { color: var(--rs-muted); }

.rs-doc__foot { max-width: 780px; margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--rs-line); }
.rs-doc__edit { display: inline-flex; align-items: center; gap: 6px; color: var(--rs-muted); font-size: 14px; }
.rs-doc__edit:hover { color: var(--rs-accent); }
.rs-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; }
.rs-pager__link { display: grid; padding: 14px 16px; border: 1px solid var(--rs-line); border-radius: 12px; transition: border-color .15s ease; }
.rs-pager__link:hover { border-color: var(--rs-accent); }
.rs-pager__link small { color: var(--rs-muted); font-size: 12.5px; }
.rs-pager__link span { font-weight: 600; color: var(--rs-accent); }
.rs-pager__link--next { text-align: right; }
.rs-missing { padding-top: 40px; }

/* toc */
.rs-toc { position: sticky; top: var(--rs-header); align-self: start; max-height: calc(100vh - var(--rs-header)); overflow-y: auto; padding: 32px 0 40px; }
.rs-toc__title { font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--rs-muted); margin-bottom: 10px; }
.rs-toc__link { display: block; font-size: 13.5px; line-height: 1.4; padding: 4px 0 4px 12px; border-left: 2px solid var(--rs-line); color: var(--rs-muted); }
.rs-toc__link--3 { padding-left: 24px; font-size: 13px; }
.rs-toc__link:hover { color: var(--rs-text); }
.rs-toc__link.is-active { color: var(--rs-accent); border-left-color: var(--rs-accent); }

@media (max-width: 1200px) {
  .rs-doc { grid-template-columns: 250px minmax(0, 1fr); }
  .rs-toc { display: none; }
}
@media (max-width: 860px) {
  .rs-doc { grid-template-columns: minmax(0, 1fr); gap: 0; padding: 0 16px; }
  .rs-side {
    position: fixed; z-index: 2001; left: 0; top: 0; height: 100vh; width: min(300px, 86vw);
    background: var(--rs-bg); padding: 20px 6px 40px 14px; transform: translateX(-100%); transition: transform .2s ease;
  }
  .rs-side.is-open { transform: none; box-shadow: 0 0 60px rgba(0, 0, 0, .35); }
  .rs-side__scrim { position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, .4); }
  .rs-menu-btn {
    display: inline-flex; align-items: center; gap: 6px; margin-bottom: 16px; padding: 7px 12px; border-radius: 8px;
    border: 1px solid var(--rs-line); background: var(--rs-surface); color: var(--rs-text); font: inherit; font-size: 14px; cursor: pointer;
  }
  .rs-main { padding-top: 18px; }
  .rs-pager { grid-template-columns: 1fr; }
}
</style>
