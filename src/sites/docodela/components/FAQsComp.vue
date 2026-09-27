<template>
  <section id="faqs" class="faqs" data-test="docodela-faqs">
    <div class="row justify-center">
      <div class="col-12 col-md-8">

        <div class="text-center q-mb-xl">
          <div class="section-eyebrow">{{ tdc('FAQs') }}</div>
          <h2 class="section-title">
            {{ tdc('Answers to some of the common questions about financing your treatment') }}
          </h2>
        </div>

        <q-list class="faq-list">
          <q-expansion-item
            v-for="(faq, index) in faqs"
            :key="faq.question"
            group="docodela-faqs"
            :label="tdc(faq.question)"
            :default-opened="index === 0"
            expand-icon="add"
            expanded-icon="remove"
            header-class="faq__question"
            class="faq"
          >
            <div class="faq__answer">
              {{ tdc(faq.answer) }}
            </div>
          </q-expansion-item>
        </q-list>

        <div class="faqs__more">
          {{ tdc('Still have questions?') }}
          <router-link :to="{ name: 'contacto' }">{{ tdc('Talk to us') }}</router-link>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { tdc } from "quasar_resaas"

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
</script>

<style scoped>
.faqs {
  padding: 88px 16px;
  background: #f4f8fc;
}

.section-eyebrow {
  color: #1f8f6b;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.section-title {
  margin: 8px 0 0;
  font-size: clamp(24px, 2.8vw, 34px);
  line-height: 1.25;
  font-weight: 800;
  color: #10233f;
}

.faq {
  margin-bottom: 12px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e3ebf5;
}
.faq :deep(.faq__question) {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 700;
  color: #10233f;
}
/* long questions wrap instead of being cut with an ellipsis on phones */
.faq :deep(.q-item__label) {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  -webkit-line-clamp: unset;
}
.faq :deep(.q-expansion-item__toggle-icon) {
  color: #185a9d;
}
.faq__answer {
  padding: 0 20px 18px;
  white-space: normal;
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
}

.faqs__more {
  margin-top: 24px;
  text-align: center;
  font-size: 15px;
  color: #4b5563;
}
.faqs__more a {
  margin-left: 6px;
  font-weight: 700;
  color: #185a9d;
}

@media (max-width: 599px) {
  .faqs {
    padding: 56px 16px;
  }
}
</style>
