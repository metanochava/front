<template>

<div id="sobrenos" class="q-py-xl">

  <!-- TITULO -->
  <div class="text-center q-mb-xl">

    <div
      class="text-weight-bold text-primary"
      :style="{ fontSize: ps?.typography?.font_size_h1 + 'px' }"
    >
      {{ tdc('About us') }}
    </div>

    <div class="text-subtitle1 q-mt-sm text-white " :style="{ fontSize: ps?.typography?.font_size_h3 + 'px' }">
      {{ tdc('We take care of your health with excellence and dedication') }}
    </div>

  </div>


  <!-- HISTORIA + IMAGEM -->

  <div class="row justify-center q-col-gutter-xl q-px-md">

    <div class="col-md-5 col-12">

      <q-img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        style="border-radius:20px"
      />

    </div>


    <div class="col-md-5 col-12 items-center justify-center" :style="{ fontSize: ps?.typography?.font_size_h4 + 'px' }">

      <div class=" text-weight-bold q-mb-md">
        {{ tdc('Amal Clinic') }}
      </div>

      <p class="text-white">
        A Clínica Amal nasceu com o objetivo de oferecer cuidados médicos
        modernos e humanizados. Trabalhamos com especialistas qualificados
        e tecnologia avançada para garantir diagnósticos precisos.
      </p>

      <p class="text-white">
        Nosso compromisso é proporcionar atendimento de excelência,
        colocando sempre o bem-estar e a segurança do paciente em primeiro lugar.
      </p>

    </div>

  </div>


  <!-- MISSÃO VISÃO VALORES -->

  <div class="row justify-center q-col-gutter-md q-mt-xl">

    <div
      class="col-md-3 col-12"
      v-for="item in about"
      :key="item.title"
    >

      <s-card class="about-card text-center">

        <q-card-section>

          <q-icon
            :name="item.icon"
            size="50px"
            color="primary"
          />

          <div class="text-h6 q-mt-md">
            {{ tdc(item.title) }}
          </div>

          <div class="text-caption q-mt-sm text-grey-7">
            {{ tdc(item.desc) }}
          </div>

        </q-card-section>

      </s-card>

    </div>

  </div>

</div>

</template>


<script>

import { defineComponent, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"

export default defineComponent({

setup(){

const User =useUserStore()

const ps = computed(()=>User.ps || {})

const counters=[
{value:1200,label:'Patients treated'},
{value:45,label:"Especialistas"},
{value:15,label:'Years of experience'},
{value:12,label:'Specialties'}
]

const about=[

{
icon:"flag",
title:'Mission',
desc:'Offer quality medical care with humane service.'
},

{
icon:"visibility",
title:'Vision',
desc:'Be a reference in innovation and excellence in healthcare.'
},

{
icon:"favorite",
title:'Values',
desc:'Ethics, commitment, respect and dedication to patients.'
}

]

const doctors=[

{
name:"Dr João Silva",
specialty:'Cardiologist',
img:"https://randomuser.me/api/portraits/men/32.jpg"
},

{
name:"Dra Maria Costa",
specialty:'Neurologist',
img:"https://randomuser.me/api/portraits/women/44.jpg"
},

{
name:"Dr Paulo Mendes",
specialty:'Orthopaedist',
img:"https://randomuser.me/api/portraits/men/65.jpg"
}

]

return{
tdc,
ps,
counters,
about,
doctors
}

}

})

</script>


<style scoped>

.counters{
background:#f6f8fb;
padding:40px 0;
}

.counter-number{
font-size:36px;
font-weight:bold;
color:#1976d2;
}

.about-card{
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,.08);
transition:.3s;
}

.about-card:hover{
transform:translateY(-8px);
}

.doctor-card{
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,.08);
transition:.3s;
}

.doctor-card:hover{
transform:translateY(-6px);
}

</style>
