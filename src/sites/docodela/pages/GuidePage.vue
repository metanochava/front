<template>
  <div class="guide-page" style="padding-top:100px; padding-bottom:100px; background-color:#fff;">

    <div class="row justify-center q-px-md">
      <div class="col-md-6 col-12">

        <div class="text-weight-bold text-grey-9" style="font-size:34px">
          {{ tdc(guide.title) }}
        </div>

        <p class="text-body1 text-grey-8 q-mt-md" style="font-size:18px; line-height:1.7">
          {{ tdc(guide.text) }}
        </p>

        <s-btn
          color="primary"
          :label="tdc('Enquire now')"
          :to="{ name: 'calculadora' }"
          class="q-mt-md"
        />

      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, computed } from "vue"
import { useRoute } from "vue-router"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {

    const route = useRoute()

    const guides = {
      'dental-implants-finance': {
        title: 'Dental implants finance',
        text: 'Dental implants are one of the more costly dental treatments, but they do not have to be paid for all at once. A payment plan spreads the cost over several months, so you can get your implants sooner and pay at a pace that suits you.'
      },
      'treatment-payment-plans-credit-checks': {
        title: 'Treatment payment plans and credit checks',
        text: 'Applying for a payment plan involves a credit check, but we look at your application as a whole rather than a single score. Talk to our team about your situation and we will help you find the right option.'
      },
      'cosmetic-surgery-finance-bad-credit': {
        title: 'Cosmetic surgery finance with bad credit',
        text: 'A less-than-perfect credit history does not automatically rule out financing. We assess each application individually, so it is always worth applying to see what options are available to you.'
      },
      'treatment-finance-bad-credit': {
        title: 'Treatment finance with bad credit',
        text: 'Whatever your treatment, a difficult credit history is only one part of your application. Speak to our team - we will look at your full circumstances before making a decision.'
      },
      'how-treatment-finance-works': {
        title: 'How treatment finance works',
        text: 'You apply online or through your clinic, we review your application and, in most cases, give a decision the same day. Once approved, you pay a fixed amount each month until your treatment is paid off.'
      },
    }

    const guide = computed(() => guides[route.params.slug] || guides['how-treatment-finance-works'])

    return {
      tdc,
      guide,
    }

  }

})
</script>

<style scoped>
</style>
