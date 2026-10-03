<template>
  <section id="sobrenos" class="about" data-test="docodela-about">
    <div class="row justify-center">
      <div class="col-12 col-md-10 row q-col-gutter-xl items-center">

        <div class="col-12 col-md-6">
          <div class="section-eyebrow">Docodela 24 Horas</div>
          <h2 class="section-title">{{ tdc('About us') }}</h2>

          <p class="about__lead">
            {{ tdc('We are a solution for accessing and financing private healthcare.') }}
          </p>
          <p class="about__text">
            {{ tdc('We help our clients find care options, organise their treatment and, when needed, assess financing solutions for eligible healthcare expenses.') }}
          </p>
          <p class="about__text">
            {{ tdc('More than financing, we want to help make the journey to accessing healthcare simpler, more organised and more predictable.') }}
          </p>

          <div class="about__quote">
            <q-icon name="favorite" size="22px" class="about__quote-icon" />
            <div>
              {{ tdc('Because a health need should not turn into an unnecessary financial worry.') }}
              {{ tdc('And a temporary cash-flow difficulty should not, on its own, mean putting off important care.') }}
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-md">
            <div v-for="item in about" :key="item.title" class="col-12 col-sm-4">
              <div class="pillar" :data-test="`about-${item.title.toLowerCase()}`">
                <q-icon :name="item.icon" size="24px" />
                <div class="pillar__title">{{ tdc(item.title) }}</div>
                <div v-if="item.desc" class="pillar__text">{{ tdc(item.desc) }}</div>
                <ol v-else class="pillar__list">
                  <li v-for="value in item.list" :key="value">{{ tdc(value) }}</li>
                </ol>
              </div>
            </div>
          </div>

          <s-btn
            unelevated
            no-caps
            color="white"
            text-color="primary"
            size="lg"
            icon="support_agent"
            class="about__btn q-mt-lg"
            :label="tdc('Talk to a consultant')"
            :to="{ name: 'contacto' }"
          />
        </div>

        <div class="col-12 col-md-6">
          <img :src="fotoAbout" :alt="tdc('About us')" class="about__image">
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"
import fotoAbout from './../images/docodela24.jpeg'
import { about } from '../about'

export default defineComponent({

  setup () {


    return {
      tdc,
      about,
      fotoAbout
    }

  }

})
</script>

<style scoped>
.about {
  padding: 88px 16px;
  color: #fff;
  background: linear-gradient(135deg, #1f8f6b 0%, #185a9d 100%);
}

.pillar__list {
  margin: 4px 0 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.5;
  opacity: .9;
}

.section-eyebrow {
  color: #bff3e1;
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
}

.about__lead {
  margin: 20px 0 0;
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.55;
  font-weight: 500;
}

.about__text {
  margin: 12px 0 0;
  font-size: 16px;
  line-height: 1.6;
  opacity: .9;
}

.about__quote {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 20px;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.55;
  background: rgba(255, 255, 255, .14);
  border-left: 4px solid #7ee2c0;
}
.about__quote-icon {
  margin-top: 2px;
  color: #7ee2c0;
}

.pillar {
  height: 100%;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, .1);
  border: 1px solid rgba(255, 255, 255, .18);
}
.pillar__title {
  margin-top: 8px;
  font-weight: 700;
}
.pillar__text {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.5;
  opacity: .88;
}

.about__btn {
  border-radius: 12px !important;
  font-weight: 700;
}

.about__image {
  display: block;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(4, 25, 55, .35);
}

@media (max-width: 599px) {
  .about {
    padding: 56px 16px;
  }
}
</style>
