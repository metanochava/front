<template>
  <section id="awards" class="awards-section q-py-xl q-pa-md" style="padding-top:100px; padding-bottom:100px;">

    <div class="row justify-center items-center q-col-gutter-xl">
      <div class="col-md-8 col-12 text-center">

        <q-icon name="emoji_events" size="56px" color="amber" class="q-mb-md" />

        <div class="text-weight-bold text-white" style="font-size:40px">
          {{ tdc('Patient Care Awards') }}
        </div>

        <p class="text-white q-mt-md" style="font-size:20px; opacity:.9">
          {{ tdc('Every year we recognise the doctors and partner clinics who go further to look after our patients.') }}
        </p>

        <s-btn
          color="white"
          text-color="primary"
          :label="tdc('Read more')"
          @click="go"
        />

      </div>
    </div>

  </section>
</template>

<script>
import { defineComponent } from "vue"
import { useRouter } from "vue-router"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup () {

    const router = useRouter()

    // the awarded doctors are presented on the Patients page's "Our medical team" list
    function go () {
      router.push({ name: 'utentes' })
    }

    return {
      tdc,
      go,
    }

  }

})
</script>

<style scoped>
.awards-section {
  background: linear-gradient(135deg, #185A9D, #023f2b);
}
</style>
