<template>

<div id="sobrenos" class="q-py-xl bg" style="padding-top:100px; padding-bottom:100px; ">

  <div class="row justify-center q-col-gutter-xl q-px-md">

    <div class="col-md-5 col-12 items-center justify-center" style="font-size: 22px ">

      <div class="text-left col-12">

        <div
          class="text-weight-bold text-white"
          style="font-size:40px"
        >
          {{ tdc('Utentes') }}
        </div>
      </div>

      <s-btn
        color="primary"
        label="Utentes"
      />


    </div>

    <div class="col-md-5 col-12">

      <q-img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        style="border-radius:20px"
      />

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


const about=[

{
icon:"flag",
title:"Missão",
desc:"Oferecer cuidados médicos de qualidade com atendimento humanizado."
},

{
icon:"visibility",
title:"Visão",
desc:"Ser referência em inovação e excelência em saúde."
},

{
icon:"favorite",
title:"Valores",
desc:"Ética, compromisso, respeito e dedicação aos utentes."
}

]


const doctors=[

{
name:"Dr João Silva",
specialty:"Cardiologista",
img:"https://randomuser.me/api/portraits/men/32.jpg"
},

{
name:"Dra Maria Costa",
specialty:"Neurologista",
img:"https://randomuser.me/api/portraits/women/44.jpg"
},

{
name:"Dr Paulo Mendes",
specialty:"Ortopedista",
img:"https://randomuser.me/api/portraits/men/65.jpg"
}

]

return{
tdc,
ps,
about,
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
