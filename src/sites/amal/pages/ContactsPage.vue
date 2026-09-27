<template>

  <section
    id="contactos"
    class="contact-section amal-section amal-section--surface"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div class="text-center col-12">
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Contacts') }}
        </h2>
      </div>

    </div>


    <div class="row justify-center">

      <div class="col-md-10 row q-col-gutter-xl">

        <!-- FORM -->
        <div class="col-md-6 col-12">

          <s-card class="amal-card contact-card">

            <q-card-section>

              <div class="text-h6 text-weight-bold contact-heading q-mb-md">
                {{ tdc('Send us a message') }}
              </div>

              <q-form ref="formRef" data-test="contact-form" @submit.prevent="submit">

                <s-input
                  v-model="form.name"
                  label="Name"
                  required
                  maxlength="150"
                  :error="errors.name"
                  class="q-mb-sm"
                />

                <s-input
                  v-model="form.phone"
                  label="Phone"
                  type="tel"
                  maxlength="30"
                  :error="errors.phone"
                  class="q-mb-sm"
                />

                <s-input
                  v-model="form.email"
                  label="Email"
                  type="email"
                  :error="errors.email"
                  class="q-mb-sm"
                />

                <s-input
                  v-model="form.message"
                  label="Message"
                  type="textarea"
                  autogrow
                  required
                  maxlength="2000"
                  :error="errors.message"
                  class="q-mb-sm"
                />

                <!-- honeypot: hidden from people, bots fill it in (the server drops those) -->
                <input
                  v-model="form.website"
                  type="text"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                  aria-hidden="true"
                  class="contact-honeypot"
                >

                <div class="text-caption text-grey-7 q-mb-md">
                  {{ tdc('Leave a phone number or an email so we can reply.') }}
                </div>

                <s-btn
                  type="submit"
                  color="primary"
                  icon="send"
                  unelevated
                  no-caps
                  :loading="sending"
                  :label="tdc('Send message')"
                  class="full-width"
                  data-test="contact-submit"
                />

              </q-form>

            </q-card-section>

          </s-card>

        </div>


        <!-- INFO -->
        <div class="col-md-6 col-12">

          <s-card class="amal-card contact-card">

            <q-card-section>

              <div class="text-h6 text-weight-bold contact-heading q-mb-md">
                {{ tdc('Contact information') }}
              </div>

              <!-- TELEFONE -->
              <div class="info-item">
                <q-icon name="call" color="primary" size="24px"/>
                <div>+258 86 555 0550</div>
              </div>

              <!-- EMAIL -->
              <div class="info-item">
                <q-icon name="email" color="primary" size="24px"/>
                <div>info@clinicaamal.co.mz</div>
              </div>

              <!-- LOCAL -->
              <div class="info-item">
                <q-icon name="location_on" color="primary" size="24px"/>
                <div>{{ tdc('Maputo, Mozambique') }}</div>
              </div>

              <!-- HORARIO -->
              <div class="info-item">
                <q-icon name="schedule" color="primary" size="24px"/>
                <div>{{ tdc('Open 24h') }}</div>
              </div>


              <!-- WHATSAPP -->
              <q-btn
                color="green"
                icon="chat"
                :label="tdc('Chat on WhatsApp')"
                class="q-mt-md full-width"
                href="https://wa.me/258865550550"
                target="_blank"
              />

            </q-card-section>

          </s-card>

        </div>

      </div>

    </div>

  </section>

</template>



<script>
import { defineComponent, computed, reactive, ref } from "vue"
import { tdc, useUserStore, HTTPClient, url, AlertSuccess, parseFieldErrors } from "quasar_resaas"

export default defineComponent({

  name: "ContactsPage",

  setup () {

    const User =useUserStore()

    const ps = computed(() => User.ps || {})

    const blank = () => ({ name: "", phone: "", email: "", message: "", website: "" })

    const form = reactive(blank())
    const errors = reactive({})
    const sending = ref(false)
    const formRef = ref(null)

    // POST site/contact/ (public): the backend finds the clinic from this
    // site's Origin, stores the message and notifies the clinic. The error
    // toast comes from the API client (HTTPClient); field errors go on their
    // fields here.
    async function submit () {
      for (const key of Object.keys(errors)) delete errors[key]
      sending.value = true

      try {
        await HTTPClient.post(url({ type: "u", url: "site/contact/" }), { ...form })

        AlertSuccess(tdc("Thank you! Your message was sent. We will contact you soon."))
        Object.assign(form, blank())
        formRef.value?.resetValidation()
      } catch (error) {
        const fields = parseFieldErrors(error?.response?.data)
        for (const [key, messages] of Object.entries(fields)) {
          errors[key] = [].concat(messages)[0]
        }
      } finally {
        sending.value = false
      }
    }

    return {
      tdc,
      ps,
      form,
      errors,
      sending,
      formRef,
      submit
    }

  }

})
</script>



<style scoped>
.contact-honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  opacity: 0;
}


.contact-card {
  padding: 8px;
}

.contact-heading {
  color: var(--amal-primary);
}

/* INFO */

.info-item {

  display:flex;
  align-items:center;
  gap:10px;

  margin-bottom:12px;

}

</style>
