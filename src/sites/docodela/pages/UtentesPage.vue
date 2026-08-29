<template>
  <div>
    <Utentes />
  </div>
</template>


<script>

import { defineComponent, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import  Utentes  from "../components/UtentesComp.vue"

export default defineComponent({
  components:{
    Utentes
  },

setup(){

  const User =useUserStore()

  const ps = computed(()=>User.ps || {})

  return{
  tdc,
  ps,
  }

}

})

</script>


<style scoped>

</style>
