<template>

  <q-page >

    <SliderPage />
    <InicioPage />
    <ServicosPage />
    <SobreNosPage />
    <DepoimentoPage />
    <EspecialidadesPage />
    <EstiloPage />
    <DoctorsPage />
    <MarcacaoPage />
    <ExamesPage />
    <BlogPage />
    <ContactsPage />

  </q-page>

</template>


<script>

import { defineComponent } from 'vue'

import SliderPage from "./SliderPage.vue"
import InicioPage from "./InicioPage.vue"
import ServicosPage from "./ServicosPage.vue"
import SobreNosPage from "./SobreNosPage.vue"
import EspecialidadesPage from "./EspecialidadesPage.vue"
import DoctorsPage from "./DoctorsPage.vue"
import MarcacaoPage from "./MarcacaoPage.vue"
import ExamesPage from "./ExamesPage.vue"
import BlogPage from "./BlogPage.vue"
import ContactsPage from "./ContactsPage.vue"
import EstiloPage from "./EstiloPage.vue"

import { tdc, UserStore } from 'quasar_resaas'
import DepoimentoPage from './DepoimentoPage.vue'

export default defineComponent({

  name:'MainLayout',

  components:{
    InicioPage,
    ServicosPage,
    EspecialidadesPage,
    MarcacaoPage,
    SobreNosPage,
    ExamesPage,
    ContactsPage,
    DoctorsPage,
    BlogPage,
    SliderPage,
    DepoimentoPage,
    EstiloPage,
  },

  setup(){

    const User = UserStore()

    return{
      User
    }

  },

  data(){
    return{
      tdc,
    }
  },

  computed:{

  },

  async mounted(){


  },

  methods:{

  }

})

</script>


<style>

</style>
