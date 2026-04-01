
<template>
  <div class="" >
    <s-card  style="background: rgba(12, 233, 234, 0.1); border-radius: 0px;" >
      <q-parallax
        src="./../images/13.jpeg"
        :height="490"

      >
        <div
          class="column flex-center"
        >

        <div
          class="slide-overlay column flex-center text-center"
          :style="{ borderRadius: ps.layout?.rounded ? '30px' : '6px' }"
        >

          <div
            class="text-weight-bold q-mb-md"
            :style="{ fontSize: ps.typography?.font_size_h4 + 'px' }"
          >
            {{ tdc("Texto 1") }}
          </div>

          <div
            class="q-mb-lg"
            :style="{ fontSize: ps.typography?.font_size_h6 + 'px' }"
          >
            {{ tdc('Descricao') }}
          </div>
        </div>
      </div>
    </q-parallax>


    </s-card>
  </div>
</template>


<script>
import { defineComponent, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"

export default defineComponent({

setup(){

  const User =useUserStore()


  const ps = computed(()=>User.ps || {})




  return{
    User,
    ps,
    tdc,

  }

}

})
</script>


<style>

.slide-overlay{
  background: rgba(0,0,0,0.45);
  padding:40px;
  border-radius:10px;
  color:white;
  max-width:600px;
}

</style>
