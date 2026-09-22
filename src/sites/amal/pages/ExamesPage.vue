<template>

  <section
    id="exames"
    class="exames-section q-py-xl"
  >

    <!-- TITULO -->

    <div class="row justify-center q-mb-xl">

      <div
        class="text-weight-bold text-primary text-center col-12"
        :style="{ fontSize: ps?.typography.font_size_h1 + 'px' }"
      >
        {{ tdc('Exams') }}
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
                {{ tdc(exam.name) }}
              </div>

              <div class="text-caption text-grey-7 q-mt-xs">
                {{ tdc(exam.short_desc) }}
              </div>

              <div class="q-mt-md">

                <s-btn
                  color="primary"
                  icon="visibility"
                  :label="tdc('View details')"
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

      <s-modal-card :title="tdc(selectedExam.name)" :icon="selectedExam.icon" width="480px">
        <div class="text-grey q-mb-md">
          {{ tdc(selectedExam.short_desc) }}
        </div>

          <div class="q-mb-sm">
            <b>{{ tdc('Price:') }}</b> {{ selectedExam.price }}
          </div>

          <div class="q-mb-sm">
            <b>{{ tdc('Duration:') }}</b> {{ tdc(selectedExam.duration) }}
          </div>

          <div class="q-mb-sm">
            <b>{{ tdc('Preparation:') }}</b>
            {{ tdc(selectedExam.preparation) }}
          </div>

          <div class="q-mb-sm">
            <b>{{ tdc('Procedure:') }}</b>
            {{ tdc(selectedExam.procedure) }}
          </div>

          <div class="q-mb-sm">
            <b>{{ tdc('Results:') }}</b>
            {{ tdc(selectedExam.results) }}
          </div>


        <template #footer>
          <s-btn
            color="primary"
            icon="event"
            :label="tdc('Schedule exam')"
          />

          <q-btn
            flat
            :label="tdc('Close')"
            v-close-popup
          />
        </template>
      </s-modal-card>

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
        name:'Blood test',
        icon:"biotech",
        short_desc:'Laboratory test for general assessment',
        price:"1200 MZN",
        duration:'15 minutes',
        preparation:'8-hour fast',
        procedure:'Blood drawn by a qualified professional',
        results:'Results available within 24h'
      },

      {
        id:2,
        name:'X-ray',
        icon:"medical_services",
        short_desc:'Diagnostic imaging',
        price:"2500 MZN",
        duration:'20 minutes',
        preparation:'No special preparation',
        procedure:'Radiological image of the requested area',
        results:'Available the same day'
      },

      {
        id:3,
        name:'Ultrasound',
        icon:"monitor_heart",
        short_desc:'Internal imaging assessment',
        price:"3000 MZN",
        duration:'30 minutes',
        preparation:'Depending on the exam, fasting may be required',
        procedure:'Assessment with ultrasound equipment',
        results:'Immediate results'
      },

      {
        id:4,
        name:'Electrocardiogram',
        icon:"favorite",
        short_desc:'Assessment of the heart\'s electrical activity',
        price:"1800 MZN",
        duration:'15 minutes',
        preparation:'Avoid exercise before the exam',
        procedure:'Sensors are placed on the chest',
        results:'Immediate results'
      },

      {
        id:5,
        name:'COVID-19 test',
        icon:"coronavirus",
        short_desc:'Diagnosis of the SARS-CoV-2 virus',
        price:"1500 MZN",
        duration:'10 minutes',
        preparation:'No preparation needed',
        procedure:'Nasal swab',
        results:'Results within 24h'
      },

      {
        id:6,
        name:'Urine test',
        icon:"science",
        short_desc:'Laboratory assessment of urine',
        price:"800 MZN",
        duration:'10 minutes',
        preparation:'Sample collection',
        procedure:'Laboratory analysis',
        results:'Results within 12h'
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


</style>
