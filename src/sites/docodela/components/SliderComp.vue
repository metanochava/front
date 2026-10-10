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

// high-resolution photos (1920 px wide): images/clinica.jpeg is a 541 px copy
// of the first one and looked blurred across the full-width slide
const IMAGES = {
  clinic: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80&auto=format&fit=crop',
  consultation: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80&auto=format&fit=crop',
  laboratory: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&q=80&auto=format&fit=crop'
}

const router = useRouter()

const currentSlide = ref('cuidado')
const autoplay = ref(5000)

const slides = [
  {
    name: 'cuidado',
    title: 'Your health should not wait for your liquidity.',
    desc: 'Find the right care. Organise your treatment. Plan the payment.',
    button: 'Start now',
    route: { name: 'utentes' },
    image: IMAGES.clinic
  },
  {
    name: 'financiamento',
    title: 'Take care of yourself now. Organise the payment with peace of mind.',
    desc: 'When you need health care but prefer not to commit all your liquidity right away.',
    button: 'Assess financing',
    route: { name: 'calculadora' },
    image: IMAGES.consultation
  },
  {
    name: 'consultor',
    title: 'A simpler path to caring for your health.',
    desc: 'Less time searching. Less hassle organising. More peace of mind to move forward.',
    button: 'Talk to an advisor',
    route: { name: 'contacto' },
    image: IMAGES.laboratory
  }
]

function goToSlideRoute(slide) {
  if (!slide.route) return

  router.push(slide.route)
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




