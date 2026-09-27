<template>

<div id="especialidades" class="amal-section amal-section--surface">

  <!-- TITULO -->
  <div class="row justify-center q-mb-xl q-px-md">
      <div class="text-center col-12">
        <div class="amal-eyebrow">{{ tdc('Amal Clinic') }}</div>
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Specialties') }}
        </h2>
      </div>
  </div>


  <!-- ESPECIALIDADES -->

  <!-- same 10-column width as the other sections (the cards touched the screen edges) -->
  <div class="row justify-center q-px-md">
  <div class="col-12 col-md-10 row q-col-gutter-lg">

    <div
      class="col-md-3 col-sm-6 col-12"
      v-for="s in services"
      :key="s.title"
    >

      <s-card class="amal-card amal-card--hover text-center">

        <q-card-section class="q-pa-lg">

          <span class="amal-icon"><q-icon :name="s.icon" size="28px" /></span>

          <div class="text-h6 text-weight-bold q-mt-md">
            {{ tdc(s.title) }}
          </div>

          <div class="q-mt-sm amal-muted specialty-desc">
            {{ tdc(s.desc) }}
          </div>

        </q-card-section>

      </s-card>

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

const services=[

{
icon:"favorite",
title:'Cardiology',
desc:'Diagnosis and treatment of heart disease.'
},

{
icon:"visibility",
title:"Oftalmologia",
desc:'Complete care for eye health.'
},

{
icon:"psychology",
title:"Neurologia",
desc:'Specialised treatment of the nervous system.'
},

{
icon:"healing",
title:"Ortopedia",
desc:'Treatment of injuries and bone diseases.'
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
.specialty-desc{
  font-size:14px;
  line-height:1.55;
}
</style>
