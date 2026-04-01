<template>

<div id="especialidades" class="q-py-xl">

  <!-- TITULO -->
  <div class="text-center q-mb-xl">

    <div
      class="text-weight-bold text-primary"
      :style="{ fontSize: ps.typography?.font_size_h1 + 'px' }"
    >
      {{ tdc('Especialidades') }}
    </div>

  </div>


  <!-- ESPECIALIDADES -->

  <div class="row justify-center q-col-gutter-xl q-px-md">

    <div
      class="col-md-3 col-12"
      v-for="s in services"
      :key="s.title"
    >

      <s-card class="service-card text-center">

        <q-card-section>

          <q-icon
            :name="s.icon"
            size="50px"
            color="primary"
          />

          <div class="text-h6 q-mt-md">
            {{ s.title }}
          </div>

          <div class="text-caption text-grey-7 q-mt-sm">
            {{ s.desc }}
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

const services=[

{
icon:"favorite",
title:"Cardiologia",
desc:"Diagnóstico e tratamento de doenças do coração."
},

{
icon:"visibility",
title:"Oftalmologia",
desc:"Cuidados completos para a saúde dos olhos."
},

{
icon:"psychology",
title:"Neurologia",
desc:"Tratamento especializado do sistema nervoso."
},

{
icon:"healing",
title:"Ortopedia",
desc:"Tratamento de lesões e doenças ósseas."
}

]

return{
tdc,
ps,
services
}

}

})

</script>


<style scoped>

.service-card{
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,.08);
transition:.3s;
}

.service-card:hover{
transform:translateY(-8px);
}

</style>
