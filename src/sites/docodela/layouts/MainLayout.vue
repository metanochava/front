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
              Atendimento
            </div>

            <div class="text-caption">
              Estamos online
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
            name="Atendimento"
            :text="['Olá! sou o chat?', 'Como podemos ajudá-lo?', ]"
            stamp="Agora"
            bg-color="grey-3"
            text-color="black"
          />

          <q-chat-message
            v-for="(item, index) in chatMessages"
            :key="index"
            sent
            name="Você"
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
            placeholder="Escreva uma mensagem..."
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
        label="Live Chat"
        size="lg"
        color="primary"
        icon="chat"
        class="chat-button"
        @click="chatOpen = true"
      >
        <q-tooltip>
          Falar connosco
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

        <!-- Grande e Longo -->

          <s-btn
            flat
            dense
            icon="calculate"
            :round="$q.screen.lt.md"
            :label="$q.screen.lt.md ? '' : 'Loan Calculator'"
            :class="
              $q.dark.isActive
                ? 'bg-dark text-white'
                : 'bg-primary text-white'
            "
            @click="drawer = !drawer"
            :size="$q.screen.lt.md ? 'md' : 'lg'"

          >
            <q-tooltip
              :class="
                $q.dark.isActive
                  ? 'bg-dark text-white'
                  : 'bg-primary text-white'
              "
            >
              Loan Calculator
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
              Liga no WhatsApp
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
import { tdc,useUserStore, useEntityStore } from 'quasar_resaas'
import { useRouter } from 'vue-router'

export default defineComponent({

  name:'MainDocodelaLayout',

  components:{
    RodapePage,
  },

  setup(){
    const router = useRouter()
    const User = useUserStore()
    const Entity = useEntityStore()

    return{
      User,
      Entity,
      router
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
          label: 'Sobre Nós',
          icon: 'groups',
          route: 'sobrenos'
        },
        {
          label: 'Utentes',
          icon: 'person',
          route: 'utentes'
        },
        {
          label: 'Parceiros',
          icon: 'handshake',
          route: 'parceiros'
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
        window.location.href = `${dominio}/#/auth/login?entity=${this.Entity?.row?.id}`
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
