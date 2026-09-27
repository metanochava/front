<template>

<div id="faqs" class="q-py-md" style="padding-top:100px; padding-bottom:100px; background-color: #fff;  ">

<div class="row justify-center items-center q-col-gutter-xl q-mt-xl" style="">



    <div class="col-md-10 col-12 row ">

      <div
        class="text-weight-bold q-mb-md text-grey-9 text-center col-12"
        :style="{ fontSize: '50px' }"
      >
        {{ tdc('FAQs') }}
      </div>

      <label class=" q-px-xl text-h5">
        {{ tdc('Answers to some of the common questions about financing your treatment') }}
      </label>

      <div
        class=" col-12 text-h6"
      >
        <div class="q-pa-md" style="max-width: 100%">
          <q-list bordered>
            <q-expansion-item
              v-for="(faq, index) in faqs"
              :key="faq.question"
              group="somegroup"
              :label="tdc(faq.question)"
              :default-opened="index === 0"
              header-class="text-primary"
            >
              <q-card>
                <q-card-section>
                  {{ tdc(faq.answer) }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>

      </div>
    </div>

</div>

</div>

</template>

<script>

import { defineComponent, computed, ref } from "vue"
import { tdc,useUserStore } from "quasar_resaas"


export default defineComponent({

components:{

},

setup(){

const User =useUserStore()
const ps = computed(()=>User.ps || {})

const slide= ref(1)

const faqs = [
  {
    question: 'Is Docodela 24horas a health insurance?',
    answer: 'No. Docodela 24horas does not replace health insurance. It is a complementary solution that helps make access to certain healthcare easier and, when applicable, lets you assess financing solutions.'
  },
  {
    question: 'Do I need health insurance?',
    answer: 'Not necessarily. The options available depend on the care you need, the provider network and the applicable conditions.'
  },
  {
    question: 'Can I choose my own doctor?',
    answer: 'Docodela 24horas can help you find and organise care with professionals and providers available in its network. Availability depends on the speciality, location and provider.'
  },
  {
    question: 'Can I finance any treatment?',
    answer: 'No. Financing solutions are only available for eligible care and procedures and are subject to the applicable assessment, eligibility and approval criteria.'
  },
  {
    question: 'How much can I finance?',
    answer: "The amount depends on the cost of the care, the solution available and the assessment of the client's ability to pay."
  },
  {
    question: 'Do I have to pay everything straight away?',
    answer: 'When an applicable financing solution exists and is approved, you can organise the payment according to the approved plan and conditions.'
  },
  {
    question: 'How do I get started?',
    answer: "It's simple. Tell us what you need. Our team will guide you through the options available and the next steps."
  }
]

return{
User,
ps,
tdc,
slide,
faqs,
}

}

})

</script>

<style scoped>
.flip-card-front {
  background: rgba(0, 0, 0, 0.45);
  color: white;
}

.slideoverlay {
  padding: 40px;
  color: white;
  text-align: center;
  max-width: 600px;
}
</style>
