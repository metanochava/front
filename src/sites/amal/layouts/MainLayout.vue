<template>

  <q-layout view="hHh lpR fFf" class="grediente">

    <!-- DRAWER MOBILE -->
    <q-drawer
      v-model="drawer"
      side="left"
      bordered
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

        <label class="q-ml-sm text-h6">Clínica Amal</label>

        <q-space/>

        <div class="q-pr-md text-h6" v-show="!$q.screen.lt.md">
        </div>

        <HeaderDarkMode/>
        <HeaderFullScreen/>
        <HeaderLanguage/>

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
          style="height:50px;border-bottom-left-radius:60px;border-bottom-right-radius:60px"
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

    <HomePage />

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

import HomePage from "../pages/HomePage.vue"
import RodapePage from '../pages/RodapePage.vue'


import {
  HeaderDarkMode,
  HeaderLanguage,
  HeaderFullScreen
} from 'quasar_resaas'

import { tdc,useUserStore, useEntidadeStore } from 'quasar_resaas'

export default defineComponent({

  name:'MainLayout',

  components:{
    HeaderDarkMode,
    HeaderLanguage,
    HeaderFullScreen,
    HomePage,
    RodapePage,
  },

  setup(){

    const User = useUserStore()
    const Entidade = useEntidadeStore()

    return{
      User,
      Entidade
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

        {label:'Início',icon:'home',route:'home'},
        {label:'Sobre Nós',icon:'info',link:'#sobrenos'},
        {label:'Especialidades',icon:'health_and_safety',link:'#especialidades'},
        {label:'Médicos',icon:'groups',link:'#medicos'},
        {label:'Serviços',icon:'layout',link:'#servicos'},
        {label:'Marcação',icon:'event',link:'#marcacao'},
        {label:'Exames',icon:'biotech',link:'#exames'},
        {label:'Blog',icon:'article',link:'#blog'},
        {label:'Contactos',icon:'call',link:'#contactos'},
        {label:'Depoimentos',icon:'people',link:'#depoimentos'},
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
    await this.Entidade.getSettings()
    this.calculateMenu()
    window.addEventListener("resize",this.calculateMenu)
  },

  methods:{
    calculateMenu(){

      const max = Math.floor(window.innerWidth / 140)

      this.visibleItems = this.menuItems.slice(0,max)

      this.hiddenItems = this.menuItems.slice(max)

    },

    go(item){

      if(item?.route === 'Login'){
        const dominio = process.env.API.replace('app','clinica')
        window.location.href = `${dominio}/#/auth/login?entidade=${this.Entidade?.row?.id}`
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

body.body--light{
  background:#f6f8f7;
}

body.body--dark{
  background:#121212;
}

.s-btn:hover{
  opacity:.85;
}

html{
  scroll-behavior:smooth;
}

</style>
