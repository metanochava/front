<template>

<div  id="parceiros" style=" padding:100px 2px 100px 2px; background-color: #fff;">

<div class="row justify-center items-center q-col-gutter-xl q-mt-xl" >
  <div class="col-md-10 row">
    <div class="col-md-7 col-12 row">
      <div
        class="text-weight-bold q-mb-md text-grey-9 text-center col-12"
        :style="{ fontSize: '50px' }"
      >
        Trusted Partners
      </div>

      <div
        class="q-pa-md col-12"
      >
        <q-carousel
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="amber"
          navigation
          padding
          height="250px"
          class=""
        >
          <q-carousel-slide :name="1" class="column no-wrap">
            <div
              class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
            >
              <q-img
                class="rounded-borders col-6 full-height"
                src="https://cdn.quasar.dev/img/mountains.jpg"
              />
              <q-img
                class="rounded-borders col-6 full-height"
                src="https://cdn.quasar.dev/img/parallax1.jpg"
              />
            </div>
          </q-carousel-slide>
        </q-carousel>

      </div>
    </div>

    <s-card
      flat
      class="q-pa-sm justify-center col-md-5 col-12 text-center bg-transparent"
    >
      <div class="flip-card-front text-center">
          <div class="slideoverlay text-center">
            <q-icon
              name="local_hospital"
              size="60px"
              class="q-mb-md"
            />

            <div class="text-h4 text-weight-bold">
              Clínica Médica
            </div>

            <div class="text-subtitle1 q-mt-sm">
             {{ tdc(' Cuidamos da sua saúde') }}
            </div>

            <div class="text-caption q-mt-md">
              Passe o rato para conhecer os nossos serviços
            </div>
          </div>
        </div>
    </s-card>
  </div>
</div>




</div>

</template>

<script>

import { defineComponent, computed, ref } from "vue"
import { tdc,useUserStore } from "quasar_resaas"


export default defineComponent({

components:{

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
  background: rgba(0, 0, 0, 0.45);
  color: white;
}

.slideoverlay {
  padding: 40px;
  color: white;
  text-align: center;
  max-width: 600px;
}
</style>
