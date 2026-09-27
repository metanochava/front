<template>

  <q-layout view="hHh lpR fFf" class="amal-site">

    <!-- DRAWER MOBILE -->
    <q-drawer
      v-model="drawer"
      side="left"
      bordered
      overlay
      class="lt-md"
      :width="ps.layout?.sidebar_width || 260"
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'"
    >

      <q-list padding>

        <q-item
          v-for="item in menuItems"
          :key="item"
          clickable
          :ripple="ps.animation?.button_animation === 'ripple'"
          @click="go(item)"
          :class="ps.animation?.hover_effect ? 'hover-' + ps.animation?.hover_style : ''"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon"/>
          </q-item-section>

          <q-item-section>
            {{ tdc(item.label) }}
          </q-item-section>
        </q-item>

      </q-list>

    </q-drawer>


    <!-- HEADER -->
    <q-header class="bg-transparent text-white">

      <q-toolbar
        class="no-wrap q-px-md"
        :dense="ps.layout?.toolbar_dense"
        :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'"
        style="height:70px"
      >

        <s-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="drawer = !drawer"
        />

        <q-img
          src="./../public/logo.png"
          width="60px"
          height="60px"
          fit="contain"
          spinner-color="white"
          @click="go({ route: 'home' })"
        />

        <label class="q-ml-sm text-h6">{{ tdc('Amal Clinic') }}</label>

        <q-space/>

        <div class="q-pr-md text-h6" v-show="!$q.screen.lt.md">
        </div>

        <s-header-dark-mode />
        <s-header-full-screen />
        <site-language-menu :languages="languages" :current="current" @choose="choose" />

      </q-toolbar>


      <!-- MENU DESKTOP -->
      <q-bar
        v-show="!$q.screen.lt.md"
        class="q-pa-0 row items-center bg-transparent text-white"

        style="height:50px"
      >

        <q-space/>

        <div
          ref="menuContainer"
          class="row items-center q-px-md shadow-3 q-px-xl no-wrap"
          style="height:50px"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
        >

          <!-- BOTÕES VISÍVEIS -->
          <s-btn
            v-for="item in visibleItems"
            :key="item"
            outline
            flat

            size="md"
            :icon="item.icon"
            :label="tdc(item.label)"
            @click="go(item)"
            style="margin-right:8px;"
          />



          <!-- BOTÃO MAIS -->
          <q-btn
            v-if="hiddenItems.length"
            flat
            round
            dense
            icon="more_vert"
          >
            <q-menu>

              <q-list style="min-width:150px">

                <q-item
                  v-for="item in hiddenItems"
                  :key="item"
                  clickable
                  v-close-popup
                  @click="go(item)"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon"/>
                  </q-item-section>

                  <q-item-section>
                    {{ tdc(item.label) }}
                  </q-item-section>

                </q-item>

              </q-list>

            </q-menu>

          </q-btn>

        </div>

        <q-space/>

      </q-bar>

    </q-header>


    <!-- PAGE -->
    <q-page-container>

      <transition
        v-if="ps.animation?.enable_animations"
        :name="ps.animation?.page_transition || 'fade'"
        mode="out-in"
      >
        <router-view/>
      </transition>

      <router-view v-else/>



    </q-page-container>

    <!-- the home page is rendered by the router-view above (/home); a second
         <HomePage /> here sat outside q-page-container, so Quasar never showed
         it and only logged "QPage needs to be child of QPageContainer" -->

    <RodapePage />

    <!-- SCROLL -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="50"
      :offset="[18,18]"
    >
      <s-btn icon="keyboard_arrow_up" round color="primary"/>
    </q-page-scroller>

  </q-layout>

</template>


<script>

import { defineComponent } from 'vue'

import RodapePage from '../pages/RodapePage.vue'
import SiteLanguageMenu from '../../shared/SiteLanguageMenu.vue'
import { useSiteLanguage } from '../../shared/useSiteLanguage'


import { tdc,useUserStore, useEntityStore } from 'quasar_resaas'

export default defineComponent({

  name:'MainAmalLayout',

  components:{
    RodapePage,
    SiteLanguageMenu,
  },

  setup(){

    const User = useUserStore()
    const Entity = useEntityStore()
    const { languages, current, choose } = useSiteLanguage({ defaultCode: 'pt-pt' })

    return{
      User,
      Entity,
      languages,
      current,
      choose
    }

  },

  data(){
    return{

      visibleItems:[],
      hiddenItems:[],

      comments:false,
      drawer:false,
      tdc,

      menuItems:[

        {label:'Home',icon:'home',route:'home'},
        {label:'About us',icon:'info',link:'#sobrenos'},
        {label:'Specialties',icon:'health_and_safety',link:'#especialidades'},
        {label:'Doctors',icon:'groups',link:'#medicos'},
        {label:'Services',icon:'layout',link:'#servicos'},
        {label:'Booking',icon:'event',link:'#marcacao'},
        {label:'Exams',icon:'biotech',link:'#exames'},
        {label:'Blog',icon:'article',link:'#blog'},
        {label:'Contacts',icon:'call',link:'#contactos'},
        {label:'Testimonials',icon:'people',link:'#depoimentos'},
        {label:'Login',icon:'admin_panel_settings',route:'Login'}

      ]
    }
  },

  computed:{

    ps(){
      return this.User.ps || {}
    }

  },

  async mounted(){
    this.calculateMenu()
    window.addEventListener("resize",this.calculateMenu)
    await this.Entity.getSettings()
    if (this.User.Entity?.id) {
      console.log('[Amal] Entity found for this site:', this.User.Entity)
    } else {
      console.log('[Amal] No Entity matched this domain (site.py lookup by Origin).')
    }
  },

  unmounted(){
    window.removeEventListener("resize",this.calculateMenu)
  },

  methods:{
    calculateMenu(){

      const max = Math.floor(window.innerWidth / 140)

      this.visibleItems = this.menuItems.slice(0,max)

      this.hiddenItems = this.menuItems.slice(max)

    },

    go(item){

      if(item?.route === 'Login'){
        const dominio = process.env.API.replace('app','saude')
        // Entity.getSettings() (called on mount) never populates Entity.row -
        // only User.Entity, from the same /site response. Entity.row.id was
        // always undefined here.
        window.location.href = `${dominio}/#/auth/login?entity=${this.User?.Entity?.id}`
      }else{
        const el = document.querySelector(item.link)
        if(el){
          el.scrollIntoView({
            behavior:'smooth'
          })
        }

        this.drawer = false

      }

    },

  }


})

</script>


<style>

.no-wrap{
  flex-wrap:nowrap;
}

/* PAGE TRANSITIONS */

.fade-enter-active,
.fade-leave-active{
  transition:opacity .3s;
}

.fade-enter-from,
.fade-leave-to{
  opacity:0;
}

.slide-left-enter-active{
  transition:all .3s;
}

.slide-left-enter-from{
  transform:translateX(40px);
  opacity:0;
}

/* HOVER EFFECTS */

.hover-lift:hover{
  transform:translateY(-4px);
  transition:all .2s;
}

.hover-shadow:hover{
  box-shadow:0 10px 25px rgba(0,0,0,.2);
}

.hover-grow:hover{
  transform:scale(1.05);
}


.s-btn:hover{
  opacity:.85;
}

/* no global scroll-behavior:smooth: Quasar locks the page while a dialog is
   open and puts it back with window.scrollTo() when it closes - with smooth
   scrolling on <html> that restore became a long visible scroll from the top.
   Links in this site ask for smooth scrolling themselves (scrollIntoView). */

/* =====================================================================
   AMAL SITE DESIGN SYSTEM
   Every colour comes from the Entity's Theme (GET site/ -> applyTheme,
   which sets one --q-<key> CSS variable per theme colour), the corner
   radius from its LayoutSetting (--s-radius) and the font from its
   Typography (applyTypography). The fallbacks are only used until the
   theme arrives. Dark mode (Quasar adds body--dark) switches the surface,
   background, text and border tokens to the theme's dark values.
   ===================================================================== */
.amal-site{
  --amal-primary:var(--q-primary, #1976d2);
  --amal-secondary:var(--q-secondary, #26a69a);
  --amal-accent:var(--q-accent, #9c27b0);
  --amal-bg:var(--q-background, #f6f8f7);
  --amal-surface:var(--q-card, #ffffff);
  --amal-text:var(--q-text_primary, #0f172a);
  --amal-muted:var(--q-text_secondary, #5b6475);
  --amal-border:var(--q-border, #e5e7eb);
  --amal-on-brand:var(--q-text_light, #ffffff);
  --amal-footer:var(--q-footer, var(--amal-primary));
  --amal-footer-text:var(--q-footer_text, #ffffff);
  --amal-radius:var(--s-radius, 16px);
  --amal-radius-lg:calc(var(--amal-radius) + 8px);
  --amal-tint:color-mix(in srgb, var(--amal-primary) 10%, transparent);
  --amal-tint-strong:color-mix(in srgb, var(--amal-primary) 18%, transparent);
  --amal-gradient:linear-gradient(135deg, var(--amal-primary) 0%, var(--amal-secondary) 100%);
  --amal-shadow:0 1px 2px rgba(15, 23, 42, .04), 0 12px 32px rgba(15, 23, 42, .08);
  --amal-shadow-hover:0 2px 4px rgba(15, 23, 42, .06), 0 20px 44px rgba(15, 23, 42, .14);
  color:var(--amal-text);
  background:var(--amal-bg);
}

.body--dark .amal-site{
  --amal-bg:var(--q-background_dark, #121212);
  --amal-surface:var(--q-dark, #1d1d1d);
  --amal-text:var(--q-text_light, #f5f7fa);
  --amal-muted:color-mix(in srgb, var(--amal-text) 70%, transparent);
  --amal-border:color-mix(in srgb, var(--amal-text) 14%, transparent);
  --amal-tint:color-mix(in srgb, var(--amal-primary) 22%, transparent);
  --amal-tint-strong:color-mix(in srgb, var(--amal-primary) 32%, transparent);
  --amal-shadow:0 1px 2px rgba(0, 0, 0, .3), 0 12px 32px rgba(0, 0, 0, .35);
  --amal-shadow-hover:0 2px 4px rgba(0, 0, 0, .35), 0 20px 44px rgba(0, 0, 0, .5);
}

/* SECTIONS: background / surface / brand, alternated down the page */
.amal-section{
  position:relative;
  padding:96px 16px;
  background:var(--amal-bg);
  color:var(--amal-text);
}
.amal-section--surface{
  background:var(--amal-surface);
}
.amal-section--brand{
  background:var(--amal-gradient);
  color:var(--amal-on-brand);
}
@media (max-width:599px){
  .amal-section{ padding:64px 16px; }
}
/* the header (toolbar + menu bar) is fixed: a section reached from the menu
   must start below it, not under it */
.amal-site [id]{
  scroll-margin-top:128px;
}
@media (max-width:1023px){
  .amal-site [id]{ scroll-margin-top:76px; }
}

/* SECTION TITLES (sizes: the Entity's typography when loaded, else these) */
.amal-eyebrow{
  display:inline-block;
  padding:6px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  letter-spacing:.1em;
  text-transform:uppercase;
  color:var(--amal-primary);
  background:var(--amal-tint);
}
.amal-title{
  margin:12px 0 0;
  font-size:clamp(28px, 3.4vw, 42px);
  line-height:1.15;
  font-weight:800;
  letter-spacing:-.02em;
  color:var(--amal-text);
}
.amal-subtitle{
  margin:12px auto 0;
  max-width:680px;
  font-size:clamp(16px, 1.5vw, 18px);
  line-height:1.6;
  color:var(--amal-muted);
}
.amal-section--brand .amal-eyebrow{
  color:var(--amal-on-brand);
  background:rgba(255, 255, 255, .16);
}
.amal-section--brand .amal-title{ color:var(--amal-on-brand); }
.amal-section--brand .amal-subtitle{ color:color-mix(in srgb, var(--amal-on-brand) 85%, transparent); }

/* CARDS */
.amal-card{
  height:100%;
  background:var(--amal-surface) !important;
  color:var(--amal-text);
  border:1px solid var(--amal-border);
  border-radius:var(--amal-radius-lg) !important;
  box-shadow:var(--amal-shadow) !important;
  transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.amal-card--hover:hover{
  transform:translateY(-4px);
  border-color:color-mix(in srgb, var(--amal-primary) 35%, var(--amal-border));
  box-shadow:var(--amal-shadow-hover) !important;
}
.amal-section--surface .amal-card{
  background:var(--amal-bg) !important;
}
/* glass cards on the brand gradient */
.amal-section--brand .amal-card{
  background:rgba(255, 255, 255, .12) !important;
  border-color:rgba(255, 255, 255, .22);
  color:var(--amal-on-brand);
  backdrop-filter:blur(10px);
}
.amal-muted{ color:var(--amal-muted); }
.amal-section--brand .amal-muted{ color:color-mix(in srgb, var(--amal-on-brand) 82%, transparent); }

/* ICON BADGE */
.amal-icon{
  width:56px;
  height:56px;
  border-radius:calc(var(--amal-radius) - 2px);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  color:var(--amal-primary);
  background:var(--amal-tint);
}
.amal-section--brand .amal-icon{
  color:var(--amal-primary);
  background:#ffffff;
}

/* PILL BUTTONS */
.amal-btn{
  border-radius:999px !important;
  font-weight:700;
  letter-spacing:.01em;
}

/* the old helper, kept for sections that still use it */
.amal-on-light{}

</style>
