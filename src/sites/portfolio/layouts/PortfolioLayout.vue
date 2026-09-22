<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { tdc } from 'quasar_resaas'

import '../css/portfolio.css'
import { profile, sections } from '../portfolio.config'
import { useSiteLanguage } from '../../shared/useSiteLanguage'
import SiteLanguageMenu from '../../shared/SiteLanguageMenu.vue'

const $q = useQuasar()

const { languages, current, choose } = useSiteLanguage({ defaultCode: profile.defaultLanguage })

const scrolled = ref(false)
const active = ref('')
const menu = ref(false)

const NAV = {
  about: 'About',
  method: 'How I work',
  stack: 'Stack',
  projects: 'Projects',
  contact: 'Contact'
}

const THEME_KEY = 'pf_theme'

function applyTheme(dark) {
  $q.dark.set(dark)

  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  } catch {
    // private mode: not remembered
  }
}

// Google Fonts, added once. Every family has a system fallback in the CSS, so the page
// reads fine before (or without) them.
function loadFonts() {
  if (document.getElementById('pf-fonts')) return

  const link = document.createElement('link')
  link.id = 'pf-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap'
  document.head.appendChild(link)
}

let observer = null

function watchSections() {
  if (!('IntersectionObserver' in window)) return

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) active.value = entry.target.id
    })
  }, { rootMargin: '-45% 0px -50% 0px' })

  sections.forEach((id) => {
    const element = document.getElementById(id)
    if (element) observer.observe(element)
  })
}

const onScroll = () => { scrolled.value = window.scrollY > 12 }

function go(id) {
  menu.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  let stored = null

  try {
    stored = localStorage.getItem(THEME_KEY)
  } catch {
    stored = null
  }

  // dark is the design's home; a visitor's saved choice wins
  $q.dark.set(stored ? stored === 'dark' : true)

  document.title = `${profile.name} — ${tdc(profile.roles[0])}`
  loadFonts()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  setTimeout(watchSections, 300)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <q-layout view="hHh lpr fFf" class="pf">
    <q-header class="nav" :class="{ 'nav--solid': scrolled || menu }">
      <div class="pf-wrap nav__inner">
        <a class="nav__brand" href="#" :aria-label="profile.name" @click.prevent="go('top')">
          <span class="nav__mark" aria-hidden="true">M</span>
          <span class="nav__name">{{ profile.name }}</span>
        </a>

        <nav class="nav__links" :aria-label="tdc('Main navigation')">
          <a
            v-for="id in sections"
            :key="id"
            :href="`#${id}`"
            :class="{ 'is-active': active === id }"
            @click.prevent="go(id)"
          >{{ tdc(NAV[id]) }}</a>
        </nav>

        <div class="nav__tools">
          <SiteLanguageMenu :languages="languages" :current="current" @choose="choose" />

          <q-btn
            flat round dense
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            :aria-label="tdc('Toggle theme')"
            data-test="theme-toggle"
            @click="applyTheme(!$q.dark.isActive)"
          />

          <q-btn class="nav__burger" flat round dense icon="menu" :aria-label="tdc('Menu')" @click="menu = !menu" />
        </div>
      </div>

      <div v-if="menu" class="nav__drawer">
        <a v-for="id in sections" :key="id" :href="`#${id}`" @click.prevent="go(id)">{{ tdc(NAV[id]) }}</a>
      </div>
    </q-header>

    <q-page-container>
      <q-page id="top">
        <router-view />
      </q-page>
    </q-page-container>

    <footer class="foot">
      <div class="pf-wrap foot__inner">
        <span>© {{ new Date().getFullYear() }} {{ profile.name }}</span>
        <span class="foot__built">{{ tdc('Designed and built with Vue 3 and Quasar.') }}</span>
      </div>
    </footer>
  </q-layout>
</template>

<style scoped>
.nav { background: transparent; color: var(--pf-text); transition: background .25s ease, border-color .25s ease, backdrop-filter .25s ease; border-bottom: 1px solid transparent; }
.nav--solid { background: color-mix(in srgb, var(--pf-bg) 82%, transparent); backdrop-filter: blur(14px); border-bottom-color: var(--pf-line); }
.nav__inner { height: var(--pf-nav); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.nav__brand { display: inline-flex; align-items: center; gap: 12px; font-family: var(--pf-font-display); font-weight: 700; font-size: 18px; }
.nav__mark { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; background: var(--pf-accent); color: var(--pf-accent-ink); font-weight: 800; }
.nav__links { display: flex; gap: 6px; }
.nav__links a { padding: 8px 14px; border-radius: 999px; color: var(--pf-muted); font-size: 15px; font-weight: 500; transition: color .2s ease, background .2s ease; }
.nav__links a:hover, .nav__links a.is-active { color: var(--pf-text); background: var(--pf-surface-2); }
.nav__tools { display: flex; align-items: center; gap: 4px; }
.nav__burger { display: none; }
.nav__drawer { display: none; }

.foot { border-top: 1px solid var(--pf-line); padding-block: 28px; color: var(--pf-muted); font-size: 14px; }
.foot__inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; }

@media (max-width: 860px) {
  .nav__links { display: none; }
  .nav__burger { display: inline-flex; }
  .nav__drawer { display: grid; gap: 4px; padding: 6px 18px 18px; background: var(--pf-bg); border-bottom: 1px solid var(--pf-line); }
  .nav__drawer a { padding: 12px 6px; font-size: 18px; font-family: var(--pf-font-display); }
  .nav__name { display: none; }
}
</style>
