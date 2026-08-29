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
              Clínica Médica
            </div>

            <div class="text-subtitle1 q-mt-sm">
              Cuidamos da sua saúde
            </div>

            <div class="text-caption q-mt-md">
              Passe o rato para conhecer os nossos serviços
            </div>
          </div>
        </div>

        <!-- VERSO -->
        <div class="flip-card-back">
          <div class="back-content">
            <q-icon
              name="health_and_safety"
              size="55px"
              class="q-mb-md"
            />

            <div class="text-h5 text-weight-bold">
              Os nossos serviços
            </div>

            <div class="text-body1 q-mt-md">
              Consultas médicas, exames, atendimento especializado
              e acompanhamento personalizado.
            </div>

            <q-btn
              class="q-mt-lg"
              color="white"
              text-color="primary"
              label="Saber mais"
              icon-right="arrow_forward"
              no-caps
              rounded
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tdc } from 'quasar_resaas'

export default {
  name: 'ClinicaFlipCard',

  setup() {
    return {
      tdc
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
  background: linear-gradient(
    135deg,
    rgba(2, 123, 227, 0.95),
    rgba(0, 70, 140, 0.95)
  );

  color: white;
  transform: rotateY(180deg);
}

.back-content {
  padding: 40px;
  text-align: center;
  max-width: 500px;
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

  .slideoverlay,
  .back-content {
    padding: 25px;
  }
}
</style>
