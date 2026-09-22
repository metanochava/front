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
    question: 'How can I book a consultation?',
    answer: 'Call us or send us a message on WhatsApp and our team will schedule your appointment.'
  },
  {
    question: 'Can I finance my treatment at Docodela?',
    answer: 'Yes. We offer payment plans for most treatments, so you can start your care and pay over time.'
  },
  {
    question: 'Which treatments can I finance?',
    answer: 'Consultations, exams, dental care, surgery and most other treatments offered at Docodela can be financed.'
  },
  {
    question: 'How much can I borrow?',
    answer: 'Financing is available from small amounts up to larger treatment costs, depending on your treatment plan and approval.'
  },
  {
    question: 'Do I need a good credit score?',
    answer: 'We look at your application as a whole, not just your credit score. Talk to our team to find the best option for you.'
  },
  {
    question: 'How long does approval take?',
    answer: 'In most cases, you will have a decision the same day you apply.'
  },
  {
    question: 'Is financing available outside Mozambique?',
    answer: 'Our financing is currently available for treatment at Docodela in Mozambique.'
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
