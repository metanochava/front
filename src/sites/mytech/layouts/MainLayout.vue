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
import { siteLoginUrl } from '../../shared/siteLoginUrl'
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

// the card spotlight (.mt-card / .mt-spot in mytech.css): one listener for the page
function onPointerMove(event) {
  const target = event.target.closest?.('.mt-card, .mt-spot')
  if (!target) return
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  target.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

// The client portal is the RESAAS admin app itself, not a parallel auth
// system for the corporate site: the front of this site Entity's type
// (MyTech is a "SaaS" Entity -> saas.<domain>, from process.env.API - see
// shared/siteLoginUrl.js, the same rule as amal/docodela). The Entity comes
// from Entity.getSettings() (GET /site, below) so the login screen
// pre-selects it.
function clientArea() {
  window.location.href = siteLoginUrl(User.Entity)
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
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  Entity.getSettings().then(() => {
    if (User.Entity?.id) {
      console.log('[MyTech] Entity found for this site:', User.Entity)
    } else {
      console.log('[MyTech] No Entity matched this domain (site.py lookup by Origin).')
    }
  })
})

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onPointerMove)
})
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

    <footer class="foot" data-test="mt-footer">
      <!-- the four colours of the logo -->
      <div class="foot__stripe" aria-hidden="true"><span /><span /><span /><span /></div>

      <div class="mt-wrap foot__cta">
        <div>
          <div class="foot__eyebrow">{{ tdc('One team, four disciplines') }}</div>
          <h2 class="foot__cta-title">{{ tdc('Technology built for real business.') }}</h2>
        </div>
        <div class="foot__cta-actions">
          <router-link class="foot__btn foot__btn--light" :to="{ name: 'contact' }">
            <q-icon name="chat" size="18px" />{{ tdc('Talk to MyTech') }}
          </router-link>
          <a
            v-if="contact.whatsapp"
            class="foot__btn foot__btn--ghost"
            :href="`https://wa.me/${contact.whatsapp}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <q-icon name="fab fa-whatsapp" size="18px" />WhatsApp
          </a>
        </div>
      </div>

      <div class="mt-wrap foot__grid">
        <div class="foot__brand">
          <ul class="foot__divisions">
            <li v-for="d in divisions" :key="d.id">
              <q-icon :name="d.icon" size="18px" color="white" />{{ tdc(d.title) }}
            </li>
          </ul>
          <div class="foot__social">
            <a v-if="contact.email" :href="`mailto:${contact.email}`" aria-label="Email"><q-icon name="mail" size="20px" /></a>
            <a v-if="contact.phone" :href="`tel:${contact.phone.replace(/\s+/g, '')}`" :aria-label="tdc('Phone')"><q-icon name="call" size="20px" /></a>
            <a v-if="contact.whatsapp" :href="`https://wa.me/${contact.whatsapp}`" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><q-icon name="fab fa-whatsapp" size="20px" /></a>
            <a v-if="contact.linkedin" :href="contact.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><q-icon name="fab fa-linkedin-in" size="20px" /></a>
          </div>
        </div>

        <div class="foot__col">
          <div class="foot__heading">{{ tdc('Solutions') }}</div>
          <router-link v-for="d in divisions.slice(0,3)" :key="d.id" :to="{ name: 'solution', params: { slug: d.slug } }">{{ tdc(d.title) }}</router-link>
        </div>

        <div class="foot__col">
          <div class="foot__heading">{{ tdc('Company') }}</div>
          <router-link :to="{ name: 'training' }">{{ tdc('Training') }}</router-link>
          <router-link :to="{ name: 'equipment' }">{{ tdc('Equipment') }}</router-link>
          <router-link :to="{ name: 'company' }">{{ tdc('About MyTech') }}</router-link>
          <router-link :to="{ name: 'contact' }">{{ tdc('Contact') }}</router-link>
        </div>

        <div class="foot__col" v-if="contact.email || contact.phone || contact.whatsapp">
          <div class="foot__heading">{{ tdc('Contact') }}</div>
          <a v-if="contact.email" class="foot__contact" :href="`mailto:${contact.email}`"><q-icon name="mail" size="18px" />{{ contact.email }}</a>
          <a v-if="contact.phone" class="foot__contact" :href="`tel:${contact.phone.replace(/\s+/g, '')}`"><q-icon name="call" size="18px" />{{ contact.phone }}</a>
          <a v-if="contact.whatsapp" class="foot__contact" :href="`https://wa.me/${contact.whatsapp}`" target="_blank" rel="noopener noreferrer"><q-icon name="fab fa-whatsapp" size="18px" />WhatsApp</a>
          <span v-if="contact.address" class="foot__contact"><q-icon name="place" size="18px" />{{ contact.address }}</span>
        </div>
      </div>

      <div class="mt-wrap foot__bottom">
        <span>© {{ new Date().getFullYear() }} {{ profile.name }} · {{ tdc('All rights reserved') }}</span>
        <button type="button" class="foot__top" :aria-label="tdc('Back to top')" @click="toTop">
          <q-icon name="arrow_upward" size="20px" />
        </button>
      </div>
    </footer>
  </q-layout>
</template>

<style scoped>
/* a floating pill: transparent at the top, frosted glass once the page scrolls */
.nav { background: transparent; color: var(--mt-text); border-bottom: 0; }
/* a full-width bar, the same background as the footer (--mt-chrome, mytech.css) */
.nav__inner {
  height: calc(var(--mt-nav) - 24px); display: flex; align-items: center; gap: 20px;
  max-width: none; width: 100%; margin: 0; padding-inline: max(16px, calc((100% - var(--mt-max)) / 2 + 16px));
  border: 0; border-radius: 0;
  color: #fff;
  background: color-mix(in srgb, var(--mt-chrome) var(--mt-chrome-opacity), transparent);
  backdrop-filter: blur(16px) saturate(1.4);
  transition: background .25s ease, border-color .25s ease, box-shadow .25s ease;
}
.nav--solid .nav__inner { box-shadow: 0 18px 40px -26px rgba(10, 20, 35, .45); }
.nav__brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mt-font-display); font-weight: 700; font-size: 19px; color: var(--mt-text); text-decoration: none; }
.nav__mark { height: 52px; width: auto; object-fit: contain; }
.nav__links { display: flex; align-items: center; gap: 4px; margin-left: 12px; flex: 1; }
.nav__link { padding: 8px 14px; border-radius: 999px; color: rgba(255, 255, 255, .82); font-size: 15px; font-weight: 500; text-decoration: none; transition: color .2s ease, background .2s ease; }
.nav__link:hover, .nav__link.router-link-active { color: #fff; background: rgba(255, 255, 255, .16); }
.nav__tools { display: flex; align-items: center; gap: 10px; }
.nav__cta { padding: 9px 18px; font-size: 14px; background: #fff; color: var(--q-primary); }
.nav__burger { display: none; }
.nav__drawer { display: none; }


@media (max-width: 900px) {
  .nav__links { display: none; }
  .nav__burger { display: inline-flex; }
  .nav__cta { display: none; }
  .nav__drawer { display: grid; gap: 4px; margin: 8px 12px 0; padding: 10px 18px 18px; background: var(--mt-surface); border: 1px solid var(--mt-line); border-radius: 22px; }
  .nav__drawer a { padding: 12px 6px; font-size: 17px; font-family: var(--mt-font-display); color: var(--mt-text); text-decoration: none; }
}

/* footer: the brand navy, the logo's four colours on top */
/* the same background as the header (--mt-chrome, mytech.css) */
.foot {
  position: relative; color: rgba(255, 255, 255, .82); font-size: 14.5px;
  background: color-mix(in srgb, var(--mt-chrome) var(--mt-chrome-opacity), transparent);
  backdrop-filter: blur(16px) saturate(1.4); }
.foot__stripe { display: grid; grid-template-columns: repeat(4, 1fr); height: 4px; }
.foot__stripe span:nth-child(1) { background: var(--mt-blue); }
.foot__stripe span:nth-child(2) { background: var(--mt-green); }
.foot__stripe span:nth-child(3) { background: var(--mt-gold); }
.foot__stripe span:nth-child(4) { background: var(--mt-red); }
.foot a { color: inherit; text-decoration: none; transition: color .2s ease, background .2s ease, transform .2s ease; }

.foot__cta { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
  padding-block: 56px 40px; border-bottom: 1px solid rgba(255, 255, 255, .12); }
.foot__eyebrow { font-family: var(--mt-font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #9cc6f2; }
.foot__cta-title { margin: 10px 0 0; color: #fff; font-family: var(--mt-font-display); font-size: clamp(26px, 3.4vw, 40px); line-height: 1.15; font-weight: 700; }
.foot__cta-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.foot__btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 15px; }
.foot__btn--light { background: #fff; color: var(--mt-blue-dark) !important; }
.foot__btn--light:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -12px rgba(0, 0, 0, .6); }
.foot__btn--ghost { border: 1px solid rgba(255, 255, 255, .35); color: #fff !important; }
.foot__btn--ghost:hover { background: rgba(255, 255, 255, .1); }

.foot__grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.3fr; gap: 36px; padding-block: 44px; }
.foot__divisions { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.foot__divisions li { display: flex; align-items: center; gap: 10px; color: rgba(255, 255, 255, .86); }
.foot__social { display: flex; gap: 10px; margin-top: 22px; }
.foot__social a { width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .14); color: #fff; }
.foot__social a:hover { background: #fff; color: var(--mt-blue-dark); transform: translateY(-2px); }
.foot__col { display: flex; flex-direction: column; gap: 11px; }
.foot__heading { color: #fff; font-family: var(--mt-font-display); font-weight: 600; font-size: 15px; margin-bottom: 6px; }
.foot__col a:hover { color: #fff; }
.foot__contact { display: inline-flex; align-items: center; gap: 10px; word-break: break-word; }
.foot__contact .q-icon { color: #9cc6f2; }

.foot__bottom { display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding-block: 18px 22px; border-top: 1px solid rgba(255, 255, 255, .12); font-size: 13.5px; color: rgba(255, 255, 255, .6); }
.foot__top { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .25); background: transparent;
  color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background .2s ease, transform .2s ease; }
.foot__top:hover { background: rgba(255, 255, 255, .12); transform: translateY(-2px); }

@media (max-width: 900px) {
  .foot__grid { grid-template-columns: 1fr 1fr; }
  .foot__brand { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .foot__grid { grid-template-columns: 1fr; }
  .foot__cta { padding-block: 40px 28px; }
}
</style>
