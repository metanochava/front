<template>

  <section
    id="exames"
    class="exames-section q-py-xl"
  >

    <!-- TITULO -->

    <div class="row justify-center q-mb-xl">

      <div
        class="text-weight-bold text-primary text-center col-12"
        :style="{ fontSize: ps.typography.font_size_h1 + 'px' }"
      >
        {{ tdc('Exames') }}
      </div>

    </div>



    <!-- LISTA DE EXAMES -->

    <div class="row justify-center">

      <div class="col-md-10 row q-col-gutter-lg">

        <div
          v-for="exam in exams"
          :key="exam.id"
          class="col-md-4 col-sm-6 col-12"
        >

          <s-card
            class="exam-card"
            bordered
          >

            <q-card-section class="text-center">

              <q-icon
                :name="exam.icon"
                size="50px"
                color="primary"
              />

              <div class="text-h6 q-mt-md">
                {{ exam.name }}
              </div>

              <div class="text-caption text-grey-7 q-mt-xs">
                {{ exam.short_desc }}
              </div>

              <div class="q-mt-md">

                <s-btn
                  color="primary"
                  icon="visibility"
                  label="Ver Detalhes"
                  @click="openExam(exam)"
                  unelevated
                />

              </div>

            </q-card-section>

          </s-card>

        </div>

      </div>

    </div>



    <!-- MODAL DETALHES DO EXAME -->

    <q-dialog
      v-model="examModal"
      transition-show="scale"
      transition-hide="scale"
    >

      <s-card
        class="exam-modal"
        style="min-width:420px"
      >

        <q-card-section class="text-center">

          <q-icon
            :name="selectedExam.icon"
            size="60px"
            color="primary"
          />

          <div class="text-h6 q-mt-md">
            {{ selectedExam.name }}
          </div>

          <div class="text-grey q-mt-xs">
            {{ selectedExam.short_desc }}
          </div>

        </q-card-section>


        <q-separator />


        <q-card-section>

          <div class="q-mb-sm">
            <b>Preço:</b> {{ selectedExam.price }}
          </div>

          <div class="q-mb-sm">
            <b>Duração:</b> {{ selectedExam.duration }}
          </div>

          <div class="q-mb-sm">
            <b>Preparação:</b>
            {{ selectedExam.preparation }}
          </div>

          <div class="q-mb-sm">
            <b>Procedimento:</b>
            {{ selectedExam.procedure }}
          </div>

          <div class="q-mb-sm">
            <b>Resultados:</b>
            {{ selectedExam.results }}
          </div>

        </q-card-section>


        <s-card-actions align="center">

          <s-btn
            color="primary"
            icon="event"
            label="Agendar Exame"
          />

          <q-btn
            flat
            label="Fechar"
            v-close-popup
          />

        </s-card-actions>

      </s-card>

    </q-dialog>

  </section>

</template>



<script>

import { defineComponent, ref, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"

export default defineComponent({

  setup () {

    const User =useUserStore()

    const ps = computed(() => User.ps || {})

    const examModal = ref(false)

    const selectedExam = ref({})


    const exams = [

      {
        id:1,
        name:"Análise de Sangue",
        icon:"biotech",
        short_desc:"Exame laboratorial para avaliação geral",
        price:"1200 MZN",
        duration:"15 minutos",
        preparation:"Jejum de 8 horas",
        procedure:"Coleta de sangue por profissional qualificado",
        results:"Resultados disponíveis em 24h"
      },

      {
        id:2,
        name:"Raio-X",
        icon:"medical_services",
        short_desc:"Diagnóstico por imagem",
        price:"2500 MZN",
        duration:"20 minutos",
        preparation:"Sem preparação especial",
        procedure:"Imagem radiológica da área solicitada",
        results:"Disponível no mesmo dia"
      },

      {
        id:3,
        name:"Ultrassonografia",
        icon:"monitor_heart",
        short_desc:"Avaliação interna por imagem",
        price:"3000 MZN",
        duration:"30 minutos",
        preparation:"Dependendo do exame pode exigir jejum",
        procedure:"Avaliação por equipamento de ultrassom",
        results:"Resultados imediatos"
      },

      {
        id:4,
        name:"Eletrocardiograma",
        icon:"favorite",
        short_desc:"Avaliação da atividade elétrica do coração",
        price:"1800 MZN",
        duration:"15 minutos",
        preparation:"Evitar exercício antes do exame",
        procedure:"Sensores são colocados no peito",
        results:"Resultados imediatos"
      },

      {
        id:5,
        name:"Teste de COVID-19",
        icon:"coronavirus",
        short_desc:"Diagnóstico do vírus SARS-CoV-2",
        price:"1500 MZN",
        duration:"10 minutos",
        preparation:"Sem preparação necessária",
        procedure:"Coleta nasal",
        results:"Resultados em 24h"
      },

      {
        id:6,
        name:"Exame de Urina",
        icon:"science",
        short_desc:"Avaliação laboratorial da urina",
        price:"800 MZN",
        duration:"10 minutos",
        preparation:"Coleta de amostra",
        procedure:"Análise laboratorial",
        results:"Resultados em 12h"
      }

    ]


    function openExam (exam) {

      selectedExam.value = exam
      examModal.value = true

    }


    return {
      ps,
      tdc,
      exams,
      examModal,
      selectedExam,
      openExam
    }

  }

})

</script>



<style scoped>

.exames-section{

  padding-top:130px;
  padding-bottom:90px;

  background:
  linear-gradient(
    135deg,
    #a8eed8,
    #a3c6e9
  );

}


/* CARD */

.exam-card{

  border-radius:20px;

  transition:all .35s;

  box-shadow:
  0 10px 25px rgba(0,0,0,.15);

}


.exam-card:hover{

  transform:translateY(-8px);

}


/* MODAL */

.exam-modal{

  border-radius:20px;

}

</style>
