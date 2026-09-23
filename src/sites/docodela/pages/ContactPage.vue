<template>
  <div class="contact-page" style="padding-top:100px; padding-bottom:100px;">

    <div class="row justify-center q-px-md">
      <div class="col-md-6 col-12 text-center">

        <div class="text-weight-bold text-white" style="font-size:40px">
          {{ tdc('Get in touch') }}
        </div>

        <p class="text-white q-mt-md" style="font-size:20px; opacity:.9">
          {{ tdc('Have a question about financing your treatment? Our team is here to help.') }}
        </p>

        <div class="row justify-center q-gutter-md q-mt-lg">
          <s-btn
            color="white"
            text-color="primary"
            icon="fab fa-whatsapp"
            label="WhatsApp"
            href="https://wa.me/258860555999"
            target="_blank"
          />
          <s-btn
            outline
            color="white"
            text-color="white"
            icon="mail"
            label="info@docodela.co.mz"
            href="mailto:info@docodela.co.mz"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {
    return {
      tdc,
    }
  }

})
</script>

<style scoped>
.contact-page {
  background: linear-gradient(135deg, #43CEA2, #185A9D);
  min-height: 50vh;
}
</style>
