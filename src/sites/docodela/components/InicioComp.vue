
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
        <div v-for="item in benefits" :key="item.title" class="row items-start no-wrap q-mb-md">
          <q-icon :name="item.icon" color="primary" size="32px" class="q-mr-md q-mt-xs" />
          <div>
            <div class="text-h6 text-weight-bold">{{ tdc(item.title) }}</div>
            <div class="text-body1 text-grey-8">{{ tdc(item.desc) }}</div>
          </div>
        </div>

        <s-btn
          color="primary"
          :label="tdc('Start now')"
          :to="{ name: 'contacto' }"
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

const benefits = [
  {
    icon: 'support_agent',
    title: 'A single point of contact',
    desc: 'Start with a conversation. Our team helps you organise the next steps.'
  },
  {
    icon: 'event_available',
    title: 'More organised care',
    desc: 'We help make it easier to get in touch and schedule appointments with providers available in our network.'
  },
  {
    icon: 'savings',
    title: 'More planned payment',
    desc: 'When applicable, we assess financing solutions to spread the cost of care over time.'
  }
]

return{
User,
ps,
tdc,
slide,
benefits,
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

