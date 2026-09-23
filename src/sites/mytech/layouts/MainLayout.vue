<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { tdc, useUserStore, useEntityStore } from 'quasar_resaas'

import '../css/mytech.css'
import { profile, contact, divisions } from '../mytech.config'
import { useSiteLanguage } from '../../shared/useSiteLanguage'
import { useSeo } from '../../shared/useSeo'
import SiteLanguageMenu from '../../shared/SiteLanguageMenu.vue'
import logoMark from '../images/logo-mark.png'

const $q = useQuasar()
const route = useRoute()
const User = useUserStore()
const Entity = useEntityStore()

const { languages, current, choose } = useSiteLanguage({ defaultCode: profile.defaultLanguage })

// per-page title/description/canonical - see routes.js meta and shared/useSeo.js
useSeo(() => ({
  siteName: profile.name,
  title: route.meta.title,
  description: route.meta.description,
  path: route.path,
}))

const scrolled = ref(false)
const menu = ref(false)

const THEME_KEY = 'mt_theme'

function applyTheme(dark) {
  $q.dark.set(dark)
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  } catch {
    // private mode: not remembered
  }
}

function loadFonts() {
  if (document.getElementById('mt-fonts')) return
  const link = document.createElement('link')
  link.id = 'mt-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap'
  document.head.appendChild(link)
}

const onScroll = () => { scrolled.value = window.scrollY > 12 }

// The client portal is the RESAAS admin app itself, not a parallel auth
// system for the corporate site - see nginx's saas.conf: saas.mytech.co.mz
// in production, saas.dev.mytech.co.mz in dev (proxied to the live quasar
// dev server). Not derived from process.env.API - that resolves to
// app.teste.mytech.co.mz in dev, a different host with a different purpose.
function clientArea() {
  const saasDomain = import.meta.env.DEV
    ? 'https://saas.dev.mytech.co.mz'
    : 'https://saas.mytech.co.mz'
  // Entity.getSettings() (below) resolves the tenant from this site's own
  // domain (GET /site) and stores it on User.Entity, not Entity.row - see
  // amal/docodela's same pattern. Passing it on lets the login screen
  // pre-select the right Entity instead of a blank/first-Entity fallback.
  window.location.href = `${saasDomain}/#/auth/login?entity=${User.Entity?.id}`
}

onMounted(() => {
  let stored = null
  try {
    stored = localStorage.getItem(THEME_KEY)
  } catch {
    stored = null
  }
  $q.dark.set(stored ? stored === 'dark' : false)

  loadFonts()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  Entity.getSettings().then(() => {
    if (User.Entity?.id) {
      console.log('[MyTech] Entity found for this site:', User.Entity)
    } else {
      console.log('[MyTech] No Entity matched this domain (site.py lookup by Origin).')
    }
  })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <q-layout view="hHh lpr fFf" class="mt" :data-theme="$q.dark.isActive ? 'dark' : 'light'">
    <q-header class="nav" :class="{ 'nav--solid': scrolled || menu }">
      <div class="mt-wrap nav__inner">
        <router-link class="nav__brand" :to="{ name: 'home' }" :aria-label="profile.name">
          <img :src="logoMark" class="nav__mark" :alt="profile.name">
        </router-link>

        <nav class="nav__links" :aria-label="tdc('Main navigation')">
          <q-btn flat no-caps class="nav__link" :label="tdc('Solutions')" icon-right="expand_more">
            <q-menu>
              <q-list style="min-width:240px">
                <q-item v-for="d in divisions.slice(0,3)" :key="d.id" clickable v-close-popup :to="{ name: 'solution', params: { slug: d.slug } }">
                  <q-item-section avatar><q-icon :name="d.icon" /></q-item-section>
                  <q-item-section>{{ tdc(d.title) }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <router-link class="nav__link" :to="{ name: 'training' }">{{ tdc('Training') }}</router-link>
          <router-link class="nav__link" :to="{ name: 'equipment' }">{{ tdc('Equipment') }}</router-link>
          <router-link class="nav__link" :to="{ name: 'company' }">{{ tdc('Company') }}</router-link>
        </nav>

        <div class="nav__tools">
          <SiteLanguageMenu :languages="languages" :current="current" @choose="choose" />
          <q-btn
            flat round dense
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            :aria-label="tdc('Toggle theme')"
            @click="applyTheme(!$q.dark.isActive)"
          />
          <a class="mt-btn mt-btn--primary nav__cta" href="#" @click.prevent="clientArea">{{ tdc('Client area') }}</a>
          <q-btn class="nav__burger" flat round dense icon="menu" :aria-label="tdc('Menu')" @click="menu = !menu" />
        </div>
      </div>

      <div v-if="menu" class="nav__drawer">
        <router-link v-for="d in divisions.slice(0,3)" :key="d.id" :to="{ name: 'solution', params: { slug: d.slug } }" @click="menu = false">{{ tdc(d.title) }}</router-link>
        <router-link :to="{ name: 'training' }" @click="menu = false">{{ tdc('Training') }}</router-link>
        <router-link :to="{ name: 'equipment' }" @click="menu = false">{{ tdc('Equipment') }}</router-link>
        <router-link :to="{ name: 'company' }" @click="menu = false">{{ tdc('Company') }}</router-link>
        <router-link :to="{ name: 'contact' }" @click="menu = false">{{ tdc('Contact') }}</router-link>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="foot">
      <div class="mt-wrap foot__grid">
        <div class="foot__brand">
          <img :src="logoMark" class="foot__mark" :alt="profile.name">
        </div>

        <div class="foot__col">
          <div class="foot__heading">{{ tdc('Solutions') }}</div>
          <router-link v-for="d in divisions.slice(0,3)" :key="d.id" :to="{ name: 'solution', params: { slug: d.slug } }">{{ tdc(d.title) }}</router-link>
        </div>

        <div class="foot__col">
          <div class="foot__heading">{{ tdc('Learn') }}</div>
          <router-link :to="{ name: 'training' }">{{ tdc('Training') }}</router-link>
        </div>

        <div class="foot__col">
          <div class="foot__heading">{{ tdc('Technology') }}</div>
          <router-link :to="{ name: 'equipment' }">{{ tdc('Equipment') }}</router-link>
        </div>

        <div class="foot__col">
          <div class="foot__heading">{{ tdc('Company') }}</div>
          <router-link :to="{ name: 'company' }">{{ tdc('About MyTech') }}</router-link>
          <router-link :to="{ name: 'contact' }">{{ tdc('Contact') }}</router-link>
        </div>

        <div class="foot__col" v-if="contact.email || contact.phone || contact.whatsapp">
          <div class="foot__heading">{{ tdc('Contact') }}</div>
          <a v-if="contact.email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
          <a v-if="contact.phone" :href="`tel:${contact.phone}`">{{ contact.phone }}</a>
        </div>
      </div>

      <div class="mt-wrap foot__bottom">
        <span>© {{ new Date().getFullYear() }} {{ profile.name }}</span>
      </div>
    </footer>
  </q-layout>
</template>

<style scoped>
.nav { background: transparent; color: var(--mt-text); transition: background .25s ease, border-color .25s ease, backdrop-filter .25s ease; border-bottom: 1px solid transparent; }
.nav--solid { background: color-mix(in srgb, var(--mt-bg) 86%, transparent); backdrop-filter: blur(14px); border-bottom-color: var(--mt-line); }
.nav__inner { height: var(--mt-nav); display: flex; align-items: center; gap: 20px; }
.nav__brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mt-font-display); font-weight: 700; font-size: 19px; color: var(--mt-text); text-decoration: none; }
.nav__mark { height: 64px; width: auto; object-fit: contain; }
.nav__links { display: flex; align-items: center; gap: 4px; margin-left: 12px; flex: 1; }
.nav__link { padding: 8px 14px; border-radius: 999px; color: var(--mt-muted); font-size: 15px; font-weight: 500; text-decoration: none; transition: color .2s ease, background .2s ease; }
.nav__link:hover, .nav__link.router-link-active { color: var(--mt-text); background: var(--mt-surface-2); }
.nav__tools { display: flex; align-items: center; gap: 10px; }
.nav__cta { padding: 9px 18px; font-size: 14px; }
.nav__burger { display: none; }
.nav__drawer { display: none; }

.foot { border-top: 1px solid var(--mt-line); padding-block: 48px 24px; color: var(--mt-muted); font-size: 14px; background: var(--mt-surface); }
.foot__grid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 28px; }
.foot__brand { display: flex; align-items: center; gap: 10px; font-family: var(--mt-font-display); font-weight: 700; font-size: 18px; color: var(--mt-text); }
.foot__mark { height: 34px; width: auto; object-fit: contain; }
.foot__col { display: flex; flex-direction: column; gap: 10px; }
.foot__heading { color: var(--mt-text); font-weight: 600; margin-bottom: 4px; }
.foot__col a { color: var(--mt-muted); text-decoration: none; }
.foot__col a:hover { color: var(--mt-accent); }
.foot__bottom { margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--mt-line); }

@media (max-width: 900px) {
  .nav__links { display: none; }
  .nav__burger { display: inline-flex; }
  .nav__cta { display: none; }
  .nav__drawer { display: grid; gap: 4px; padding: 6px 18px 18px; background: var(--mt-bg); border-bottom: 1px solid var(--mt-line); }
  .nav__drawer a { padding: 12px 6px; font-size: 17px; font-family: var(--mt-font-display); color: var(--mt-text); text-decoration: none; }
  .foot__grid { grid-template-columns: 1fr 1fr; }
}
</style>
