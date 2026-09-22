<template>
  <q-page>
    <SliderComp />
    <InicioComp />
    <FFYTComp />
    <SobreNosComp />
    <ParceirosComp />
    <ReviewsStripComp />
    <AwardsComp />
    <BlogComp />
    <FAQsComp />
    <GuidesComp />
  </q-page>
</template>


<script>

import { defineComponent } from 'vue'

import SliderComp from "../components/SliderComp.vue"
import InicioComp from "../components/InicioComp.vue"
import SobreNosComp from "../components/SobreNosComp.vue"
import BlogComp from "../components/BlogComp.vue"
import FAQsComp from "../components/FAQsComp.vue"
import FFYTComp from "../components/FFYTComp.vue"
import ParceirosComp from '../components/ParceirosComp.vue'
import ReviewsStripComp from '../components/ReviewsStripComp.vue'
import AwardsComp from '../components/AwardsComp.vue'
import GuidesComp from '../components/GuidesComp.vue'

import { useUserStore } from 'quasar_resaas'


export default defineComponent({

  name:'HomePage',

  components:{
    InicioComp,
    SobreNosComp,
    FFYTComp,
    FAQsComp,
    BlogComp,
    SliderComp,
    ParceirosComp,
    ReviewsStripComp,
    AwardsComp,
    GuidesComp,

  },

  setup(){

    const User =useUserStore()

    return{
      User
    }

  },

  data(){
    return{
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
