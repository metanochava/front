<template>
  <div class="carousel-bg col-md-12">
    <div class="flip-card">
      <div class="flip-card-inner">
        <!-- FRENTE -->
        <div class="flip-card-front">
          <div class="slideoverlay">
            <q-icon
              name="local_hospital"
              size="60px"
              class="q-mb-md"
            />

            <div class="text-h4 text-weight-bold">
              {{ tdc('Medical clinic') }}
            </div>

            <div class="text-subtitle1 q-mt-sm">
              {{ tdc('Our promise is to simplify your path.') }}
            </div>

            <div class="text-caption q-mt-md">
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
import { tdc } from 'quasar_resaas'
import banner from './../images/docodela24.jpeg'

export default {
  name: 'ClinicaFlipCard',

  setup() {
    return {
      tdc,
      banner
    }
  }
}
</script>

<style scoped>
.carousel-bg {
  height: 500px;
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

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
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
  background: rgba(0, 0, 0, 0.45);
  color: white;
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
