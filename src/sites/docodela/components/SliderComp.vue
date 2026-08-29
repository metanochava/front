<template>
  <q-page class="carousel-page">
    <q-carousel
      v-model="currentSlide"
      animated
      swipeable
      infinite
      navigation
      arrows
      control-color="white"
      class="main-carousel"
      :autoplay="autoplay"


    >
      <q-carousel-slide
        v-for="slide in slides"
        :key="slide.name"
        :name="slide.name"
        :img-src="slide.image"
        class="column no-wrap flex-center"
      >
        <div class="slide-overlay absolute-full"></div>

        <div class="slide-content text-center text-white">
          <div
            :class="
              $q.screen.lt.md
                ? 'text-h4 text-weight-bold'
                : 'text-h2 text-weight-bold'
            "
          >
            {{ tdc(slide.title) }}
          </div>

          <div
            :class="
              $q.screen.lt.md
                ? 'text-body1 q-mt-sm'
                : 'text-h6 q-mt-md'
            "
          >
            {{ tdc(slide.desc) }}
          </div>

          <s-btn
            color="primary"
            class="q-mt-lg"
            :label="tdc(slide.button)"
            :size="$q.screen.lt.md ? 'md' : 'lg'"
            no-caps
            @click="goToSlideRoute(slide)"
          />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tdc } from "quasar_resaas"

import foto from './../images/clinica.jpeg'

const router = useRouter()

const currentSlide = ref('pacientes')
const autoplay = ref(5000)

const slides = [
  {
    name: 'pacientes',
    title: 'Gestão de Pacientes',
    desc: 'Registe e consulte os dados dos pacientes.',
    button: 'Ver pacientes',
    route: 'list_paciente',
    image: foto
  },
  {
    name: 'consultas',
    title: 'Gestão de Consultas',
    desc: 'Organize e acompanhe as consultas médicas.',
    button: 'Ver consultas',
    route: 'list_consulta',
    image: 'https://unsplash.com/photos/green-potted-plant-on-white-ceramic-floor-tiles-HuWm7malJ18'
  },
  {
    name: 'exames',
    title: 'Exames Médicos',
    desc: 'Registe pedidos e resultados de exames médicos.',
    button: 'Ver exames',
    route: 'list_pedidoexamemedico',
    image: foto
  }
]

function goToSlideRoute(slide) {
  if (!slide.route) return

  router.push({
    name: slide.route
  })
}
</script>

<style scoped>
.carousel-page {
  min-height: 100vh;
}

.main-carousel {
  width: 100%;
  height: calc(100vh - 50px);
  min-height: 500px;
}

.slide-overlay {
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(5, 128, 228, 0.3),
    rgba(24, 235, 28, 0.2)
  );
}

.slide-content {
  position: relative;
  z-index: 2;
  width: min(850px, 90%);
  padding: 24px;
}

@media (max-width: 599px) {
  .main-carousel {
    height: calc(100vh - 50px);
    min-height: 450px;
  }

  .slide-content {
    width: 95%;
    padding: 16px;
  }
}
</style>




