<template>

<div class="footer-wrapper">

  <!-- MAPA -->
  <div class="map-container">

    <iframe
      width="100%"
      height="380"
      style="border:0"
      loading="lazy"
      allowfullscreen
      src="https://www.google.com/maps?q=-25.9639738,32.5866938&z=17&output=embed"
    ></iframe>

  </div>


  <!-- FOOTER -->
  <div class="footer-glass q-pa-xl text-white">

    <div class="row q-col-gutter-xl">

      <!-- CLINICA -->
      <div class="col-md-4 col-12">

        <div class="text-h6 text-weight-bold q-mb-md">
          Clínica Amal
        </div>

        <div>
          Atendimento médico moderno com tecnologia avançada
          e especialistas qualificados para cuidar da sua saúde.
        </div>

      </div>


      <!-- HORARIO -->
      <div class="col-md-4 col-12">

        <div class="text-h6 text-weight-bold q-mb-md">
          Horário
        </div>

        <div>Segunda - Sexta: 08:00 - 18:00</div>
        <div>Sábado: 08:00 - 13:00</div>
        <div>Domingo: Encerrado</div>

      </div>


      <!-- CONTACTOS -->
      <div class="col-md-4 col-12">

        <div class="text-h6 text-weight-bold q-mb-md">
          Contactos
        </div>

        <div>📧 info@clinicaamal.co.mz</div>
        <div>📞 +258 865550550</div>

        <div class="q-mt-md">

          <q-btn
            color="green"
            icon="fab fa-whatsapp"
            label="WhatsApp"
            href="https://wa.me/258865550550"
            target="_blank"
          />

        </div>

      </div>

    </div>


    <!-- REDES SOCIAIS -->
    <div class="row justify-center q-mt-xl social">

      <q-btn flat round icon="fab fa-facebook"/>
      <q-btn flat round icon="fab fa-instagram"/>
      <q-btn flat round icon="fab fa-twitter"/>
      <q-btn flat round icon="fab fa-linkedin"/>

    </div>


    <!-- COPYRIGHT -->
    <div class="text-center q-mt-xl text-caption">

      © {{ new Date().getFullYear() }}
      {{ tdc('Todos os direitos reservados') }}

    </div>

  </div>


  <!-- BOTAO WHATSAPP FLUTUANTE -->
  <q-page-sticky position="bottom-right" :offset="[10,65]">

    <q-btn
      round
      size="lg"
      color="green"
      icon="fab fa-whatsapp"
      class="whatsapp-btn"
      href="https://wa.me/258865550550"
      target="_blank"
    />

  </q-page-sticky>

</div>

</template>


<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"

export default defineComponent({

  setup(){
    return{
      tdc
    }
  }

})
</script>


<style scoped>

/* GRADIENTE MEDICO */

.footer-wrapper{

  background:
  linear-gradient(
    135deg,
    #43CEA2,
    #185A9D
  );

}


/* MAPA */

.map-container iframe{

  /* border-bottom-left-radius:60px;
  border-bottom-right-radius:60px; */

  filter:contrast(1.1) saturate(1.1);

}


/* GLASS EFFECT */

.footer-glass{

  backdrop-filter: blur(14px);
  background: rgba(255,255,255,0.08);

  border-top:1px solid rgba(255,255,255,.15);

  box-shadow:
  0 8px 32px rgba(0,0,0,.15);

}


/* REDES SOCIAIS */

.social q-btn{

  margin:0 8px;

}

.social q-btn:hover{

  transform:scale(1.2);
  transition:.2s;

}


/* WHATSAPP */

.whatsapp-btn{

  box-shadow:0 8px 25px rgba(0,0,0,.3);

}

.whatsapp-btn:hover{

  transform:scale(1.1);
  transition:.2s;

}

</style>
