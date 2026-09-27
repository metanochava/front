<template>
  <section id="parceiros" class="partners" data-test="docodela-partners">
    <div class="row justify-center">
      <div class="col-12 col-md-10 row q-col-gutter-xl items-center">

        <div class="col-12 col-md-7">
          <div class="section-eyebrow">{{ tdc('Partners') }}</div>
          <h2 class="section-title">{{ tdc('Trusted partners') }}</h2>
          <p class="section-text">
            {{ tdc('We work with clinics and healthcare providers that share our commitment to patients.') }}
          </p>

          <div class="row q-col-gutter-md q-mt-md">
            <div v-for="logo in logos" :key="logo.src" class="col-6">
              <div class="logo-tile">
                <img :src="logo.src" :alt="logo.alt">
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5">
          <s-card class="join">
            <q-icon name="local_hospital" size="40px" />
            <div class="join__title">{{ tdc('Are you a clinic or healthcare provider?') }}</div>
            <p class="join__text">
              {{ tdc('Join our network and help more patients get the care they need.') }}
            </p>
            <s-btn
              unelevated
              no-caps
              color="white"
              text-color="primary"
              icon-right="arrow_forward"
              class="join__btn"
              :label="tdc('Become a partner')"
              :to="{ name: 'contacto' }"
            />
          </s-card>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { tdc } from "quasar_resaas"

import logoText from './../public/logotexte.jpeg'
import logoMedcax from './../public/logo.jpeg'

const logos = [
  { src: logoText, alt: 'Docodela 24 Horas' },
  { src: logoMedcax, alt: 'Medcax' },
]
</script>

<style scoped>
.partners {
  padding: 88px 16px;
  background: #fff;
}

.section-eyebrow {
  color: #1f8f6b;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.section-title {
  margin: 8px 0 0;
  font-size: clamp(28px, 3.4vw, 42px);
  line-height: 1.15;
  font-weight: 800;
  color: #10233f;
}

.section-text {
  margin: 14px 0 0;
  max-width: 560px;
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
}

.logo-tile {
  height: 140px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e3ebf5;
  box-shadow: 0 10px 24px rgba(16, 35, 63, .06);
}
.logo-tile img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.join {
  padding: 32px;
  color: #fff;
  border-radius: 24px !important;
  background: linear-gradient(160deg, #0b3a6e, #185a9d) !important;
  box-shadow: 0 24px 48px rgba(11, 58, 110, .25) !important;
}
.join__title {
  margin-top: 16px;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
}
.join__text {
  margin: 10px 0 20px;
  font-size: 15px;
  line-height: 1.55;
  opacity: .9;
}
.join__btn {
  border-radius: 12px !important;
  font-weight: 700;
}

@media (max-width: 599px) {
  .partners {
    padding: 56px 16px;
  }
  .logo-tile {
    height: 110px;
    padding: 14px;
  }
}
</style>
