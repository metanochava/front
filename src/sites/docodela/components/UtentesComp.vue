<template>

<div id="utentes" class="q-py-xl bg" style="padding-top:100px; padding-bottom:100px; ">

  <div class="row justify-center q-col-gutter-xl q-px-md">

    <div class="col-md-5 col-12 items-center justify-center" style="font-size: 22px ">

      <div class="text-left col-12">

        <div
          class="text-weight-bold text-white"
          style="font-size:40px"
        >
          {{ tdc('Patients') }}
        </div>
      </div>

      <p class="text-white">
        {{ tdc('Everything you need as a Docodela patient, from your first visit to ongoing care.') }}
      </p>

      <div class="row q-col-gutter-md q-mt-sm q-mb-lg">
        <div v-for="item in info" :key="item.title" class="col-12">
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

      <div class="text-weight-bold text-white q-mb-md" style="font-size:24px">
        {{ tdc('Our medical team') }}
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="doctor in doctors" :key="doctor.name" class="col-12">
          <s-card flat class="row items-center no-wrap q-pa-sm">
            <q-avatar size="64px">
              <img :src="doctor.img">
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-weight-bold">{{ doctor.name }}</div>
              <div class="text-grey-7">{{ tdc(doctor.specialty) }}</div>
            </div>
          </s-card>
        </div>
      </div>

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


const info=[

{
icon:"app_registration",
title:'Registration',
desc:'Quick registration at your first visit, in person or via WhatsApp.'
},

{
icon:"folder_shared",
title:'Medical records',
desc:'Your history stored securely and available at every visit.'
},

{
icon:"support_agent",
title:'Ongoing support',
desc:'Our team is available on WhatsApp for any questions about your care.'
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
info,
doctors
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
