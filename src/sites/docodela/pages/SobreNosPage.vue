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
        {{ tdc('We are a solution for accessing and financing private healthcare.') }}
      </p>

      <p class="text-white">
        {{ tdc('We help our clients find care options, organise their treatment and, when needed, assess financing solutions for eligible healthcare expenses.') }}
      </p>

      <p class="text-white">
        {{ tdc('More than financing, we want to help make the journey to accessing healthcare simpler, more organised and more predictable.') }}
      </p>

      <p class="text-white text-weight-bold">
        {{ tdc('Because a health need should not turn into an unnecessary financial worry.') }}
        {{ tdc('And a temporary cash-flow difficulty should not, on its own, mean putting off important care.') }}
      </p>

      <div class="row q-col-gutter-md q-mt-sm q-mb-lg">
        <div v-for="item in about" :key="item.title" class="col-12">
          <div class="row items-start no-wrap">
            <q-icon :name="item.icon" size="28px" color="white" class="q-mr-md q-mt-xs" />
            <div>
              <div class="text-weight-bold text-white">{{ tdc(item.title) }}</div>
              <div v-if="item.desc" class="text-white" style="opacity: .85">{{ tdc(item.desc) }}</div>
              <ol v-else class="text-white q-my-none q-pl-md" style="opacity: .85">
                <li v-for="value in item.list" :key="value">{{ tdc(value) }}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <s-btn
        color="primary"
        icon="support_agent"
        :label="tdc('Talk to a consultant')"
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
import { about } from '../about'

export default defineComponent({

setup(){

const User =useUserStore()

const ps = computed(()=>User.ps || {})




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
