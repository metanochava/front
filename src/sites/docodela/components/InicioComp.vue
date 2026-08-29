
<template>

<div style=" padding-top:100px; padding-bottom: 100px; background-color: #fff;">

  <div class="row justify-center items-center q-col-gutter-xl q-mt-xl q-pa-md" >

    <div class="col-md-10 col-12 row">
    <div class="col-md-8 col-12">
      <div
        class="text-weight-bold q-mb-md text-grey-9"
        :style="{ fontSize: '50px' }"
      >
        {{ tdc('Largest provider of healthcare finance') }}
      </div>
      <div
        class="q-mb-lg"
      >
        <label class="text-h4"><q-icon name="bolt" color="primary" /> Less than 1 minute to apply </label> <br/>
        <label class="text-h4"><q-icon name="verified" color="primary" /> Instant decision</label> <br/>
        <label class="text-h4"><q-icon name="description" color="primary" /> Simple online application</label> <br/>
        <label class="text-h4"><q-icon name="sentiment_satisfied_alt" color="primary" /> Easy with no hassle </label> <br/><br/>

        <s-btn
          color="primary"
          label="Emquire now"
        />
      </div>
    </div>

    <div class=" col-md-4 col-12   q-pa-sm justify-center items-center text-center">
      <s-card
        flat

      >
        <ReviewPage />
      </s-card>
    </div>
</div>
  </div>
</div>

</template>

<script>

import { defineComponent, computed, ref } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import ReviewPage from "./ReviewComp.vue"


export default defineComponent({

components:{
  ReviewPage
},

setup(){

const User =useUserStore()
const ps = computed(()=>User.ps || {})

const slide= ref(1)

return{
User,
ps,
tdc,
slide,
}

}

})

</script>

<style scoped>
.flip-card-front {
  background: transparent;
  color: white;
}

.slideoverlay {
  padding: 40px;
  color: white;
  text-align: center;
  max-width: 600px;
}
</style>

