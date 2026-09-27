<template>
  <div class="carousel-bg col-md-12">
    <div
      class="flip-card"
      :class="{ 'flip-card--flipped': flipped }"
      tabindex="0"
      data-test="docodela-flip-card"
      @click="flipped = !flipped"
      @keyup.enter="flipped = !flipped"
    >
      <div class="flip-card-inner">
        <!-- FRENTE -->
        <div class="flip-card-front">
          <div class="slideoverlay">
            <div class="flip-card-title">
              {{ tdc('Our promise is to simplify your path.') }}
            </div>

            <div class="flip-card-hint q-mt-lg">
              <q-icon name="touch_app" size="18px" class="q-mr-xs" />
              {{ tdc('Hover to discover our services') }}
            </div>
          </div>
        </div>

        <!-- VERSO -->
        <div class="flip-card-back" :style="{ backgroundImage: `url(${banner})` }" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { tdc } from 'quasar_resaas'
import banner from './../images/docodela24.jpeg'

export default {
  name: 'ClinicaFlipCard',

  setup() {
    // hover flips it on desktop; a tap (or Enter) flips it on touch screens
    const flipped = ref(false)

    return {
      tdc,
      banner,
      flipped
    }
  }
}
</script>

<style scoped>
.carousel-bg {
  height: 380px;
  border-radius: 0px;
  background: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
}

/* ÁREA DO CARTÃO */

.flip-card {
  width: 600px;
  max-width: calc(100% - 40px);
  height: 320px;
  perspective: 1200px;
}

/* ELEMENTO QUE RODA */

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;

  transition: transform 0.8s ease;
  transform-style: preserve-3d;
}

/* ROTAÇÃO NO HOVER */

.flip-card:hover .flip-card-inner,
.flip-card--flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card {
  cursor: pointer;
  outline: none;
}

/* FRENTE E VERSO */

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;

  border-radius: 24px;
  overflow: hidden;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.0);
}

/* FRENTE */

.flip-card-front {
  background: linear-gradient(135deg, #185a9d 0%, #1f8f6b 100%);
  color: white;
  box-shadow: 0 24px 48px rgba(24, 90, 157, .28);
}

.flip-card-title {
  font-size: clamp(24px, 2.6vw, 32px);
  font-weight: 800;
  line-height: 1.25;
}

.flip-card-hint {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  background: rgba(255, 255, 255, .16);
}

.slideoverlay {
  padding: 40px;
  color: white;
  text-align: center;
  max-width: 600px;
}

/* VERSO */

.flip-card-back {
  background-color: #0a4a8a;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  color: white;
  transform: rotateY(180deg);
}

/* MOBILE */

@media (max-width: 600px) {
  .carousel-bg {
    height: 450px;
    border-radius: 25px;
  }

  .flip-card {
    height: 330px;
  }

  .slideoverlay {
    padding: 25px;
  }
}
</style>
