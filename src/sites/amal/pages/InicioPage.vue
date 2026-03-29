<template>

<div class="inicio">

<div class="row justify-center items-center q-col-gutter-xl q-mt-xl" style="margin-top:20px">

  <div class="col-md-10 row">

    <div class="col-md-6 col-12 row">

      <div class="col-12 col-md-8">
        <s-card flat class="preview-mini-card text-h6 text-primary justify-center">
          <q-card-section>
            <b class="text-h6">Atendimento moderno e humanizado</b>
          </q-card-section>
        </s-card>
      </div>

      <div
        class="text-weight-bold q-mb-md text-grey-9"
        :style="{ fontSize: '50px' }"
      >
        {{ tdc('CUIDAMOS ') }}
        <b style="color:#E60000;font-size:50px"> + </b>
        {{ tdc(' DE PERTO') }}
      </div>

      <div
        class="q-mb-lg"
        :style="{ fontSize: ps.typography?.font_size_h5 + 'px' }"
      >
        {{ tdc('Atendimento humanizado, especialistas qualificados, tecnologia moderna e marcação simples para consultas, exames e check-ups.') }}

        <label
          :style="{ fontSize: ps.typography?.font_size_h4 + 'px' }"
          class="text-white"
        >
          <b>
            <br>
            Aberto 24 horas<br>
            Maternidade e Bloco operatório<br>
            Consultas de diferentes especialidades<br>
          </b>
        </label>
      </div>

      <s-btn
        color="primary"
        icon="event"
        label="Marcar Consulta"
      />

      &nbsp;&nbsp;&nbsp;

      <s-btn
        color="primary"
        outline
        label="Ver Especialidades"
      />

      <div class="row col-md-12 q-pa-0 q-col-gutter-sm q-mt-xl">

        <div class="col-md-6 justify-center">
          <s-card flat class="q-pa-md">
            <b class="text-h6 text-primary">Telefone</b>
            <br>
            +258 86 555 0550
          </s-card>
        </div>

        <div class="col-md-6 justify-center">
          <s-card flat class="q-pa-md">
            <b class="text-h6 text-primary">Localização</b>
            <br>
            Maputo, Moçambique
          </s-card>
        </div>

      </div>

    </div>

    <s-card
      flat
      class="q-pa-0 justify-center col-md-6 col-12 text-center bg-transparent"
      style="border:solid #cdcdcd00 2px"
    >
      <ReviewPage />
    </s-card>

  </div>

</div>


<!-- CONTADORES -->

<div class="row justify-center q-pa-xl counters q-mt-xl">

  <div
    class="col-md-3 col-6 text-center"
    v-for="c in counters"
    :key="c.label"
  >

    <div class="counter-number">
      {{ c.value }}+
    </div>

    <div style="font-size:18px">
      {{ c.label }}
    </div>

  </div>

</div>

</div>

</template>

<script>

import { defineComponent, computed } from "vue"
import { tdc, UserStore } from "quasar_resaas"
import ReviewPage from "./ReviewPage.vue"

export default defineComponent({

components:{
  ReviewPage
},

setup(){

const User = UserStore()
const ps = computed(()=>User.ps || {})

const counters=[

{value:1200,label:"Pacientes"},
{value:45,label:"Especialistas"},
{value:12,label:"Especialidades"},
{value:15,label:"Anos de Experiência"}

]

return{
User,
ps,
tdc,
counters
}

}

})

</script>

<style scoped>

.counters{
background:#f5f7fb;
}

.counter-number{
font-size:36px;
font-weight:bold;
color:#1976d2;
}

</style>
