<template>
  <!-- Home hero: what Docodela24horas is and the two main paths (simulate a
       plan / talk to us). It used to be a carousel of internal system screens
       (patients, appointments, exams) that sent visitors to admin routes. -->
  <section class="hero" data-test="docodela-hero">
    <div class="hero__shape hero__shape--a" />
    <div class="hero__shape hero__shape--b" />

    <div class="row justify-center">
      <div class="col-12 col-md-10 row items-center q-col-gutter-xl hero__inner">

        <div class="col-12 col-md-6">
          <div class="hero__eyebrow">
            <q-icon name="schedule" size="16px" class="q-mr-xs" />
            Docodela 24 Horas
          </div>

          <h1 class="hero__title">
            {{ tdc('Healthcare now, a payment you can plan') }}
          </h1>

          <p class="hero__text">
            {{ tdc('We help you get quick access to the treatment you need, even when your insurance or health plan does not cover the costs.') }}
          </p>

          <div class="row q-gutter-sm q-mt-lg hero__actions">
            <s-btn
              unelevated
              no-caps
              color="white"
              text-color="primary"
              icon="calculate"
              size="lg"
              class="hero__btn"
              :label="tdc('Simulate your plan')"
              :to="{ name: 'calculadora' }"
            />
            <s-btn
              outline
              no-caps
              color="white"
              icon="chat"
              size="lg"
              class="hero__btn"
              :label="tdc('Talk to us')"
              :to="{ name: 'contacto' }"
            />
          </div>

          <div class="hero__points q-mt-xl">
            <div v-for="point in points" :key="point" class="hero__point">
              <q-icon name="check_circle" size="20px" class="q-mr-sm" />
              {{ tdc(point) }}
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="hero__visual">
            <img :src="foto" :alt="tdc('Medical clinic')" class="hero__image">

            <div class="hero__badge hero__badge--top">
              <q-icon name="health_and_safety" size="26px" color="primary" />
              <div>
                <div class="hero__badge-title">{{ tdc('Care in our network') }}</div>
                <div class="hero__badge-text">{{ tdc('Medical appointments') }} · {{ tdc('Exams and diagnostics') }}</div>
              </div>
            </div>

            <div class="hero__badge hero__badge--bottom">
              <q-icon name="payments" size="26px" color="positive" />
              <div>
                <div class="hero__badge-title">{{ tdc('Healthcare financing') }}</div>
                <div class="hero__badge-text">{{ tdc('Clear terms, no surprises') }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { tdc } from 'quasar_resaas'

// the clinic photo at a resolution that stays sharp on high-density screens
// (images/clinica.jpeg is only 541 px wide)
const foto = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop'

const points = [
  'A single point of contact',
  'Support at every step',
  'Clear terms, no surprises'
]
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 72px 16px 88px;
  color: #fff;
  background: linear-gradient(135deg, #0b3a6e 0%, #185a9d 55%, #1f8f6b 100%);
}

.hero__inner {
  position: relative;
  z-index: 1;
}

.hero__shape {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.hero__shape--a {
  width: 520px;
  height: 520px;
  right: -160px;
  top: -200px;
  background: radial-gradient(circle, rgba(67, 206, 162, .35), transparent 70%);
}
.hero__shape--b {
  width: 420px;
  height: 420px;
  left: -180px;
  bottom: -220px;
  background: radial-gradient(circle, rgba(255, 255, 255, .12), transparent 70%);
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .14);
  border: 1px solid rgba(255, 255, 255, .25);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
}

.hero__title {
  margin: 20px 0 0;
  font-size: clamp(32px, 4.6vw, 56px);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -.02em;
}

.hero__text {
  margin: 20px 0 0;
  max-width: 540px;
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.6;
  opacity: .92;
}

.hero__btn {
  border-radius: 12px !important;
  font-weight: 700;
}

.hero__points {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
}
.hero__point {
  display: inline-flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
}
.hero__point .q-icon {
  color: #7ee2c0;
}

.hero__visual {
  position: relative;
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 0;
}

.hero__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 28px;
  box-shadow: 0 30px 60px rgba(4, 25, 55, .45);
  border: 6px solid rgba(255, 255, 255, .9);
}

.hero__badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  background: #fff;
  color: #1f2937;
  box-shadow: 0 16px 36px rgba(4, 25, 55, .28);
  max-width: 290px;
}
.hero__badge--top {
  top: 0;
  left: -24px;
}
.hero__badge--bottom {
  bottom: 0;
  right: -16px;
}
.hero__badge-title {
  font-weight: 700;
  font-size: 14px;
}
.hero__badge-text {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 1023px) {
  .hero {
    padding: 48px 16px 64px;
  }
  .hero__badge--top {
    left: 8px;
  }
  .hero__badge--bottom {
    right: 8px;
  }
}

@media (max-width: 599px) {
  .hero__actions {
    flex-direction: column;
  }
  .hero__btn {
    width: 100%;
  }
  .hero__badge {
    position: static;
    margin-top: 12px;
    max-width: none;
  }
  .hero__visual {
    padding: 0;
  }
}
</style>
