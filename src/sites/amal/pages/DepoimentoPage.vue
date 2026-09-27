<template>

<!-- id: the header menu's "Testimonials" (#depoimentos) had no target -->
<div id="depoimentos" class="depoimentos amal-section">


  <div class="row justify-center q-mb-lg q-px-md">
      <div class="text-center col-12">
        <div class="amal-eyebrow">{{ tdc('Testimonials') }}</div>
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Patient testimonials') }}
        </h2>
      </div>
  </div>

  <q-carousel
    v-model="slide"
    animated
    arrows
    navigation
    autoplay
    infinite
    height="340px"
    control-color="primary"
    class="bg-transparent"
  >

    <q-carousel-slide
      v-for="(group, i) in testimonialGroups"
      :key="i"
      :name="i"
      class="row justify-center items-center q-col-gutter-lg"
    >

      <div
        v-for="t in group"
        :key="t.name"
        class="col-md-5 col-12"
      >

        <div class="amal-card testimonial-card">
          <q-icon name="format_quote" size="40px" class="testimonial-quote" />

          <!-- FOTO -->
          <q-avatar size="70px" class="q-mb-md">
            <img :src="t.photo">
          </q-avatar>

          <!-- TEXTO -->
          <div class="testimonial-text">
            "{{ tdc(t.text) }}"
          </div>

          <!-- ESTRELAS -->
          <div class="stars q-mt-md">

            <q-icon
              v-for="n in 5"
              :key="n"
              name="star"
              size="20px"
              :color="n <= t.rating ? 'amber' : 'grey-5'"
            />

          </div>

          <!-- NOME -->
          <div class="q-mt-md text-weight-bold">
            {{ t.name }}
          </div>

        </div>

      </div>

    </q-carousel-slide>

  </q-carousel>

</div>

</template>

<script>

import { defineComponent, ref, computed } from "vue"
import { tdc, useUserStore } from "quasar_resaas"

export default defineComponent({

setup(){

// the title reads the Entity typography (ps) - it was used without being defined
const User = useUserStore()
const ps = computed(() => User.ps || {})

const slide = ref(0)

const testimonials=[

{
name:"Maria João",
text:'Excellent service and very professional doctors.',
rating:5,
photo:"https://randomuser.me/api/portraits/women/44.jpg"
},

{
name:"Carlos Manuel",
text:'Modern clinic with fast and efficient diagnosis.',
rating:5,
photo:"https://randomuser.me/api/portraits/men/32.jpg"
},

{
name:"Ana Costa",
text:'Welcoming environment and a very caring team.',
rating:4,
photo:"https://randomuser.me/api/portraits/women/68.jpg"
},

{
name:"Paulo Mendes",
text:'I highly recommend the clinic, excellent service.',
rating:5,
photo:"https://randomuser.me/api/portraits/men/55.jpg"
}

]

/* AGRUPA EM 2 POR SLIDE */

const testimonialGroups = computed(() => {

const groups=[]

for(let i=0;i<testimonials.length;i+=2){
groups.push(testimonials.slice(i,i+2))
}

return groups

})

return{
  tdc,
  ps,
slide,
testimonials,
testimonialGroups
}

}

})

</script>

<style scoped>
.testimonial-card{
  position:relative;
  padding:32px 28px;
  text-align:center;
}
.testimonial-quote{
  position:absolute;
  top:16px;
  right:18px;
  color:var(--amal-tint-strong);
}
.testimonial-text{
  font-size:16px;
  line-height:1.6;
  font-style:italic;
}
.stars{
  display:flex;
  justify-content:center;
  gap:3px;
}
:deep(.q-carousel__navigation){
  background:transparent;
}
</style>
