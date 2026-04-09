<template>
  <div id="slider">

    <!-- SLIDER -->
    <q-carousel
      style="margin-top:-70px; border-bottom-right-radius:200px; border-bottom-left-radius:200px;"
      v-model="slide"
      animated
      arrows
      navigation
      infinite
      height="550px"
      autoplay
    >

      <q-carousel-slide
        v-for="(s, i) in slides"
        :key="i"
        :name="i"
        :img-src="s.img"
        class="column flex-center"
      >

        <div
          class="slide-overlay column flex-center text-center"
          :style="{ borderRadius: ps?.layout?.rounded ? '30px' : '6px' }"
        >

          <div
            class="text-weight-bold q-mb-md"
            :style="{ fontSize: ps?.typography?.font_size_h1 + 'px' }"
          >
            {{ tdc(s.title) }}
          </div>

          <div
            class="q-mb-lg"
            :style="{ fontSize: ps?.typography?.font_size_body + 'px' }"
          >
            {{ tdc(s.desc) }}
          </div>

          <s-btn
            color="primary"
            class="text-white"
            :label="s.button"
            @click="$router.push({ name: s.route })"
            style="border-radius:70%;"
          />

        </div>

      </q-carousel-slide>

    </q-carousel>

  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import foto from "./../images/13.jpeg"

export default defineComponent({

  setup () {

    const User =useUserStore()

    const slide = ref(0)

    const ps = computed(() => User.ps || {})

    const slides = [
      {
        img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2000",
        title: "Clínica moderna",
        desc: "Tecnologia avançada para cuidar da sua saúde",
        button: "Marcar Consulta",
        route: "marcarconsulta"
      },

      {
        img: foto,
        title: "Especialistas qualificados",
        desc: "Médicos experientes em várias especialidades",
        button: "Conhecer Médicos",
        route: "medicos"
      },

      {
        img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000",
        title: "Atendimento humanizado",
        desc: "Cuidamos de cada paciente com atenção",
        button: "Contactar Clínica",
        route: "contactos"
      }
    ]

    return {
      User,
      ps,
      tdc,
      slide,
      slides
    }

  }

})
</script>

<style>
.slide-overlay {
  background: rgba(0,0,0,0.45);
  padding: 40px;
  border-radius: 10px;
  color: white;
  max-width: 600px;
}
</style>
