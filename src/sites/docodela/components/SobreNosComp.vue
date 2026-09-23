<template>

<div id="sobrenos" class="q-py-xl bg" style="padding-top:100px; padding-bottom:100px; ">

  <div class="row justify-center q-col-gutter-xl q-px-md">

    <div class="col-md-5 col-12 items-center justify-center" style="font-size: 22px ">

      <div class="text-left col-12">

        <div
          class="text-weight-bold text-white"
          style="font-size:40px"
        >
          {{ tdc('About us') }}
        </div>
      </div>

      <p class="text-white">
        {{ tdc('We help you get quick access to the treatment you need, even when your insurance or health plan does not cover the costs.') }}
      </p>

      <p class="text-white">
        {{ tdc('We offer responsible financing and follow your process from start to finish, so you can look after your health with peace of mind.') }}
      </p>

      <p class="text-white">
        {{ tdc('Clear terms, support at every step and a simple commitment: helping more people receive the healthcare they need.') }}
      </p>

      <p class="text-white">
        {{ tdc('Because health should not wait.') }}
      </p>

      <div class="row q-col-gutter-md q-mt-sm q-mb-lg">
        <div v-for="item in about" :key="item.title" class="col-12">
          <div class="row items-start no-wrap">
            <q-icon :name="item.icon" size="28px" color="white" class="q-mr-md q-mt-xs" />
            <div>
              <div class="text-weight-bold text-white">{{ tdc(item.title) }}</div>
              <div class="text-white" style="opacity: .85">{{ tdc(item.desc) }}</div>
            </div>
          </div>
        </div>
      </div>

      <s-btn
        color="primary"
        :label="tdc('Contact us')"
        :to="{ name: 'contacto' }"
      />


    </div>

    <div class="col-md-5 col-12">

      <q-img
        :src="fotoAbout"
        style="border-radius:20px"
      />

    </div>

  </div>

</div>

</template>


<script>

import { defineComponent, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import fotoAbout from './../images/docodela24.jpeg'

export default defineComponent({

setup(){

const User =useUserStore()

const ps = computed(()=>User.ps || {})


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
about,
doctors,
fotoAbout
}

}

})

</script>


<style scoped>

.bg{

  background:
  linear-gradient(
    135deg,
    #43CEA2,
    #185A9D
  );
}


</style>
