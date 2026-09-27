<template>

<div id="sobrenos" class="amal-section amal-section--surface">

  <!-- TITULO -->
  <div class="row justify-center q-mb-xl q-px-md">
      <div class="text-center col-12">
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('About us') }}
        </h2>
        <p class="amal-subtitle">
          {{ tdc('We take care of your health with excellence and dedication') }}
        </p>
      </div>
  </div>


  <!-- HISTORIA + IMAGEM -->

  <div class="row justify-center items-center q-col-gutter-xl">

    <div class="col-md-5 col-12">

      <q-img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80&auto=format&fit=crop"
        :ratio="4/3"
        class="about-image"
      />

    </div>


    <div class="col-md-5 col-12 items-center justify-center" :style="ps?.typography?.font_size_h4 ? { fontSize: ps.typography.font_size_h4 + 'px' } : { fontSize: '17px' }">

      <div class="about-name q-mb-md">
        {{ tdc('Amal Clinic') }}
      </div>

      <p class="about-text">
        {{ tdc('Amal Clinic was created to offer modern, humanised medical care. We work with qualified specialists and advanced technology to ensure accurate diagnoses.') }}
      </p>

      <p class="about-text">
        {{ tdc('Our commitment is to provide excellent care, always putting patient well-being and safety first.') }}
      </p>

    </div>

  </div>


  <!-- MISSÃO VISÃO VALORES -->

  <div class="row justify-center q-col-gutter-lg q-mt-xl">

    <div
      class="col-md-3 col-sm-4 col-12"
      v-for="item in about"
      :key="item.title"
    >

      <s-card class="amal-card amal-card--hover text-center">

        <q-card-section class="q-pa-lg">

          <span class="amal-icon"><q-icon :name="item.icon" size="28px" /></span>

          <div class="text-h6 text-weight-bold q-mt-md">
            {{ tdc(item.title) }}
          </div>

          <div class="q-mt-sm amal-muted about-desc">
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
.about-image{
  border-radius:var(--amal-radius-lg);
  box-shadow:var(--amal-shadow);
}
.about-name{
  font-size:22px;
  font-weight:800;
  color:var(--amal-primary);
}
.about-text{
  line-height:1.7;
  color:var(--amal-text);
}
.about-desc{
  font-size:14px;
  line-height:1.55;
}
</style>
