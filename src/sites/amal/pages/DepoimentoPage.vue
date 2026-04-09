<template>

<div class="depoimentos">


  <div
      class="text-weight-bold text-primary"
      :style="{ fontSize: ps?.typography?.font_size_h1 + 'px' }"
    >
      {{ tdc('Depoimentos dos Pacientes') }}
    </div>

  <q-carousel
    v-model="slide"
    animated
    arrows
    navigation
    autoplay
    infinite
    height="300px"
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

        <div class="testimonial-card">

          <!-- FOTO -->
          <q-avatar size="70px" class="q-mb-md">
            <img :src="t.photo">
          </q-avatar>

          <!-- TEXTO -->
          <div class="text-subtitle1 text-center">
            "{{ t.text }}"
          </div>

          <!-- ESTRELAS -->
          <div class="stars q-mt-md">

            <q-icon
              v-for="n in 5"
              :key="n"
              name="star"
              size="20px"
              :color="n <= t.rating ? 'amber' : 'grey-4'"
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
import { tdc } from "quasar_resaas"

export default defineComponent({

setup(){

const slide = ref(0)

const testimonials=[

{
name:"Maria João",
text:"Excelente atendimento e médicos muito profissionais.",
rating:5,
photo:"https://randomuser.me/api/portraits/women/44.jpg"
},

{
name:"Carlos Manuel",
text:"Clínica moderna com diagnóstico rápido e eficiente.",
rating:5,
photo:"https://randomuser.me/api/portraits/men/32.jpg"
},

{
name:"Ana Costa",
text:"Ambiente acolhedor e equipa muito atenciosa.",
rating:4,
photo:"https://randomuser.me/api/portraits/women/68.jpg"
},

{
name:"Paulo Mendes",
text:"Recomendo muito a clínica, atendimento excelente.",
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
slide,
testimonials,
testimonialGroups
}

}

})

</script>

<style scoped>

.depoimentos{

padding:80px 0;

background:
linear-gradient(
135deg,
#43CEA2,
#185A9D
);

}

/* CARD APPLE STYLE */

.testimonial-card{

background:rgba(255,255,255,.12);

backdrop-filter:blur(12px);

padding:30px;

border-radius:22px;

text-align:center;

color:white;

box-shadow:
0 10px 30px rgba(0,0,0,.2);

transition:.3s;

}

.testimonial-card:hover{
transform:translateY(-6px);
}

/* ESTRELAS */

.stars{
display:flex;
justify-content:center;
gap:3px;
}

/* BARRA DO CAROUSEL TRANSPARENTE */

:deep(.q-carousel__navigation){
background:transparent;
}

</style>
