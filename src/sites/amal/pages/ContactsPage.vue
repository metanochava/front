<template>

  <section
    id="contactos"
    class="contact-section q-py-xl"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div
        class="text-weight-bold text-primary text-center col-12"
        :style="{ fontSize: ps.typography?.font_size_h1 + 'px' }"
      >
        {{ tdc('Contactos') }}
      </div>

    </div>


    <div class="row justify-center">

      <div class="col-md-10 row q-col-gutter-xl">

        <!-- FORM -->
        <div class="col-md-6 col-12">

          <s-card class="contact-card">

            <q-card-section>

              <div class="text-h6 text-primary q-mb-md">
                Envie-nos uma mensagem
              </div>

              <q-form @submit.prevent="submit">

                <q-input
                  v-model="form.name"
                  outlined
                  label="Nome"
                  class="q-mb-md"
                />

                <q-input
                  v-model="form.phone"
                  outlined
                  label="Telefone"
                  class="q-mb-md"
                />

                <q-input
                  v-model="form.email"
                  outlined
                  label="Email"
                  class="q-mb-md"
                />

                <q-input
                  v-model="form.message"
                  outlined
                  type="textarea"
                  label="Mensagem"
                  autogrow
                  class="q-mb-md"
                />

                <q-btn
                  type="submit"
                  color="primary"
                  icon="send"
                  label="Enviar Mensagem"
                  class="full-width"
                />

              </q-form>

            </q-card-section>

          </s-card>

        </div>


        <!-- INFO -->
        <div class="col-md-6 col-12">

          <s-card class="contact-card">

            <q-card-section>

              <div class="text-h6 text-primary q-mb-md">
                Informações de Contacto
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
                <div>Maputo, Moçambique</div>
              </div>

              <!-- HORARIO -->
              <div class="info-item">
                <q-icon name="schedule" color="primary" size="24px"/>
                <div>Aberto 24h</div>
              </div>


              <!-- WHATSAPP -->
              <q-btn
                color="green"
                icon="chat"
                label="Falar no WhatsApp"
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
import { defineComponent, reactive, computed } from "vue"
import { tdc, UserStore } from "quasar_resaas"
import { Notify } from "quasar"

export default defineComponent({

  name: "ContactsPage",

  setup () {

    const User = UserStore()

    const ps = computed(() => User.ps || {})

    const form = reactive({
      name: "",
      phone: "",
      email: "",
      message: ""
    })


    function submit () {

      Notify.create({
        type: "positive",
        message: "Mensagem enviada com sucesso"
      })

      console.log(form)

    }


    return {
      tdc,
      ps,
      form,
      submit
    }

  }

})
</script>



<style scoped>

.contact-section {

  background:
  linear-gradient(
    135deg,
    #43CEA2,
    #185A9D
  );

  padding-top:80px;
  padding-bottom:80px;

}


/* CARD */

.contact-card {

  border-radius:20px;

  backdrop-filter:blur(12px);

  background:rgba(255,255,255,.9);

  box-shadow:
  0 10px 25px rgba(0,0,0,.15);

}


/* INFO */

.info-item {

  display:flex;
  align-items:center;
  gap:10px;

  margin-bottom:12px;

}

</style>
