<template>
  <section id="guides" class="guides" data-test="docodela-guides">

    <div class="row justify-center">
      <div class="col-md-10 col-12">

        <div class="section-eyebrow">{{ tdc('Guides') }}</div>
        <h2 class="guides__title">{{ tdc('Guides to plan your care') }}</h2>

        <div class="row q-col-gutter-md">
          <div v-for="guide in guides" :key="guide.slug" class="col-lg col-md-4 col-sm-6 col-12">
            <router-link
              class="guide-card"
              :to="{ name: 'guia', params: { slug: guide.slug } }"
              :data-test="`guide-card-${guide.slug}`"
            >
              <q-icon :name="guide.icon" size="26px" class="guide-card__icon" />
              <div class="guide-card__eyebrow">{{ tdc('Guide') }} {{ guide.number }} · {{ tdc(guide.category) }}</div>
              <div class="guide-card__title">{{ tdc(guide.title) }}</div>
              <div class="guide-card__more">
                {{ tdc('Read the guide') }} <q-icon name="arrow_forward" size="16px" />
              </div>
            </router-link>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script>
import { defineComponent } from "vue"
import { tdc } from "quasar_resaas"
import { guides } from "../guides"

export default defineComponent({

  setup () {
    return {
      tdc,
      guides,
    }
  }

})
</script>

<style scoped>
.guides {
  padding: 72px 16px;
  background: #f6f9fc;
}

.section-eyebrow {
  color: #1f8f6b;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.guides__title {
  margin: 6px 0 24px;
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 800;
  line-height: 1.2;
  color: #10233f;
}

.guide-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e3ebf5;
  background: #fff;
  color: #10233f;
  text-decoration: none;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}

.guide-card:hover {
  border-color: #b9d3ee;
  box-shadow: 0 12px 28px rgba(24, 90, 157, .12);
  transform: translateY(-2px);
}

.guide-card__icon {
  color: #185A9D;
  margin-bottom: 12px;
}

.guide-card__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: #1f8f6b;
}

.guide-card__title {
  margin-top: 6px;
  font-weight: 700;
  line-height: 1.35;
  flex: 1;
}

.guide-card__more {
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #185A9D;
}

.body--dark .guides { background: #121212; }
.body--dark .guides__title,
.body--dark .guide-card { color: #eef2f7; }
.body--dark .guide-card { background: #1d1d1d; border-color: #2c3440; }
</style>
