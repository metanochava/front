<template>
  <q-layout view="hHh LpR fFf" >
    <!-- CHAT FLUTUANTE -->
    <div class="floating-chat">
      <!-- JANELA DO CHAT -->
      <q-card
        v-if="chatOpen"
        class="chat-window"
        :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'"
      >
        <!-- CABEÇALHO -->
        <q-card-section class="bg-primary text-white row items-center q-py-sm">
          <q-avatar size="38px" color="white" text-color="primary">
            <q-icon name="support_agent" />
          </q-avatar>

          <div class="q-ml-sm">
            <div class="text-subtitle2 text-weight-bold">
              {{ tdc('Support') }}
            </div>

            <div class="text-caption">
              {{ tdc('We\'re online') }}
            </div>
          </div>

          <q-space />

          <q-btn
            flat
            round
            dense
            icon="close"
            @click="chatOpen = false"
          />
        </q-card-section>

        <!-- MENSAGENS.   'Olá! Como podemos ajudá-lo?' -->
        <q-card-section class="chat-messages">
          <q-chat-message
            :name="tdc('Support')"
            :text="[tdc('Hello! Can I help you?'), tdc('How can we help you?'), ]"
            :stamp="tdc('Now')"
            bg-color="grey-3"
            text-color="black"
          />

          <q-chat-message
            v-for="(item, index) in chatMessages"
            :key="index"
            sent
            :name="tdc('You')"
            :text="[item]"
            bg-color="primary"
            text-color="white"
          />
        </q-card-section>

        <q-separator />

        <!-- CAMPO PARA ESCREVER -->
        <q-card-section class="q-pa-sm">
          <q-input
            v-model="chatMessage"
            dense
            outlined
            rounded
            :placeholder="tdc('Write a message...')"
            @keyup.enter="sendChatMessage"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                icon="send"
                color="primary"
                @click="sendChatMessage"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <!-- BOTÃO DO CHAT -->
      <q-btn
        v-if="!chatOpen"
        :label="tdc('Live chat')"
        size="lg"
        color="primary"
        icon="chat"
        class="chat-button"
        @click="chatOpen = true"
      >
        <q-tooltip>
          {{ tdc('Talk to us') }}
        </q-tooltip>
      </q-btn>
    </div>


    <!-- HEADER -->
    <q-header class="bg-white text-black " >
      <q-toolbar
        class=""
        dense
        :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'"
        style="height: 100px"
      >
        <!-- LADO ESQUERDO -->
          <!-- <q-img
            src="./../public/logo_.jpeg"
            width="60px"
            height="60px"
            fit="contain"
            spinner-color="white"
            class="cursor-pointer"
            @click="go({ route: 'home' })"
          />

            v-if="!$q.screen.xs"
          -->

          <q-img
            src="./../public/logotexte.jpeg"
            width="250px"
            height="60px"
            fit="contain"
            spinner-color="white"
            class="cursor-pointer"
            @click="go({ route: 'home' })"
          />


        <!-- DIVISÃO ENTRE OS DOIS LADOS -->
        <q-space />

        <site-language-menu :languages="languages" :current="current" @choose="choose" />

        <s-btn
            flat
            dense
            icon="calculate"
            :round="$q.screen.lt.md"
            :label="$q.screen.lt.md ? '' : tdc('Loan calculator')"
            :class="
              $q.dark.isActive
                ? 'bg-dark text-white'
                : 'bg-primary text-white'
            "
            :to="{ name: 'calculadora' }"
            :size="$q.screen.lt.md ? 'md' : 'lg'"
          >
            <q-tooltip
              :class="
                $q.dark.isActive
                  ? 'bg-dark text-white'
                  : 'bg-primary text-white'
              "
            >
              {{ tdc('Loan calculator') }}
            </q-tooltip>
          </s-btn>
          &nbsp; &nbsp;

        <s-btn
            round
            flat
            icon="fab fa-whatsapp"
            href="https://wa.me/258860555999"
            target="_blank"
            color="green"
            :size="$q.screen.lt.md ? 'lg' : 'xl'"
          >
            <q-tooltip
              :class="
                $q.dark.isActive
                  ? 'bg-dark text-white'
                  : 'bg-primary text-white'
              "
            >
              {{ tdc('Call us on WhatsApp') }}
            </q-tooltip>
          </s-btn>

          <!-- <HeaderDarkMode v-if="!$q.screen.lt.md" />

          <HeaderFullScreen v-if="!$q.screen.lt.md" />

          <HeaderLanguage v-if="!$q.screen.lt.md" /> -->

          <s-btn
          :size="$q.screen.lt.md ? 'lg' : 'xl'"
            flat
            dense
            round
            icon="menu"
            @click="drawer = !drawer"
          />

      </q-toolbar>

    </q-header>

    <!-- DRAWER MOBILE -->



    <q-drawer
      v-model="drawer"
      side="right"
      bordered
      overlay

      :width="280"
      class="no-shadow"
    >

      <q-list padding>

        <q-item
          v-for="item in menuItems"
          :key="item"
          clickable
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

    </q-drawer>

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

      <RodapePage />
    </q-page-container>
  </q-layout>
</template>


<script>

import { defineComponent} from 'vue'
import RodapePage from '../pages/RodapePage.vue'
import SiteLanguageMenu from '../../shared/SiteLanguageMenu.vue'
import { useSiteLanguage } from '../../shared/useSiteLanguage'
import { tdc,useUserStore, useEntityStore } from 'quasar_resaas'
import { useRouter } from 'vue-router'

export default defineComponent({

  name:'MainDocodelaLayout',

  components:{
    RodapePage,
    SiteLanguageMenu,
  },

  setup(){
    const router = useRouter()
    const User = useUserStore()
    const Entity = useEntityStore()
    const { languages, current, choose } = useSiteLanguage({ defaultCode: 'pt-pt' })

    return{
      User,
      Entity,
      router,
      languages,
      current,
      choose
    }

  },

  data(){
    return{
      chatOpen: false,
      chatMessage: '',
      chatMessages: [],
      visibleItems:[],
      hiddenItems:[],
      comments:false,
      drawer:false,
      tdc,
      menuItems:[
        {
          label: 'Home',
          icon: 'home',
          route: 'home'
        },
        {
          label: 'About us',
          icon: 'groups',
          route: 'sobrenos'
        },
        {
          label: 'Patients',
          icon: 'person',
          route: 'utentes'
        },
        {
          label: 'Partners',
          icon: 'handshake',
          route: 'parceiros'
        },
        {
          label: 'Health blog',
          icon: 'article',
          route: 'blog'
        },
        {
          label: 'Loan calculator',
          icon: 'calculate',
          route: 'calculadora'
        },
        {
          label: 'FAQs',
          icon: 'quiz',
          route: 'faqs'
        },
        {
          label: 'Get in touch',
          icon: 'chat',
          route: 'contacto'
        },
        {
          label: 'Login',
          icon: 'login',
          route: 'login'
        }
      ]
    }
  },

  computed:{

    ps(){
      return this.User.ps || {}
    }

  },

  async mounted(){
    await this.Entity.getSettings()
    if (this.User.Entity?.id) {
      console.log('[Docodela] Entity found for this site:', this.User.Entity)
    } else {
      console.log('[Docodela] No Entity matched this domain (site.py lookup by Origin).')
    }
  },

  methods:{
    sendChatMessage() {
      const message = this.chatMessage.trim()

      if (!message) {
        return
      }

      this.chatMessages.push(message)
      this.chatMessage = ''
    },


    go(item){

      console.log(item?.route)
      if(item?.route === 'login'){
        const dominio = process.env.API.replace('docodela','app')
        // Entity.getSettings() (called on mount) never populates Entity.row -
        // only User.Entity, from the same /site response. Entity.row.id was
        // always undefined here.
        window.location.href = `${dominio}/#/auth/login?entity=${this.User?.Entity?.id}`
      }else {
          this.router.push({
          name: item?.route
        })

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



/* CHAT FLUTUANTE */

.floating-chat {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}

.chat-button {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  margin-bottom: 0px;
}

.chat-window {
  width: 360px;
  max-width: calc(100vw - 30px);
  height: 500px;
  max-height: calc(100vh - 140px);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
}

.body--dark .chat-messages {
  background: #1d1d1d;
}

@media (max-width: 600px) {
  .floating-chat {
    right: 12px;
    bottom: 12px;
  }

  .chat-window {
    width: calc(100vw - 24px);
    height: 70vh;
  }
}
</style>
