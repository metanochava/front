<template>
  <section class="intro" data-test="docodela-intro">
    <div class="row justify-center">
      <div class="col-12 col-md-10 row q-col-gutter-xl items-center">

        <div class="col-12 col-md-7">
          <div class="section-eyebrow">{{ tdc('Why Docodela24horas') }}</div>
          <h2 class="section-title">
            {{ tdc('Simpler, more organised and more convenient access to healthcare') }}
          </h2>

          <div class="q-mt-lg">
            <div v-for="item in benefits" :key="item.title" class="benefit">
              <div class="benefit__icon">
                <q-icon :name="item.icon" size="26px" />
              </div>
              <div>
                <div class="benefit__title">{{ tdc(item.title) }}</div>
                <div class="benefit__text">{{ tdc(item.desc) }}</div>
              </div>
            </div>
          </div>

          <s-btn
            unelevated
            no-caps
            color="primary"
            size="lg"
            icon-right="arrow_forward"
            class="intro__btn q-mt-md"
            :label="tdc('Start now')"
            :to="{ name: 'contacto' }"
          />
        </div>

        <div class="col-12 col-md-5">
          <FlipCard />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { tdc } from 'quasar_resaas'
import FlipCard from './ReviewComp.vue'

const benefits = [
  {
    icon: 'support_agent',
    title: 'A single point of contact',
    desc: 'Start with a conversation. Our team helps you organise the next steps.'
  },
  {
    icon: 'event_available',
    title: 'More organised care',
    desc: 'We help make it easier to get in touch and schedule appointments with providers available in our network.'
  },
  {
    icon: 'savings',
    title: 'More planned payment',
    desc: 'When applicable, we assess financing solutions to spread the cost of care over time.'
  }
]
</script>

<style scoped>
.intro {
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
  letter-spacing: -.01em;
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}
.benefit__icon {
  flex: 0 0 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #185a9d;
  background: #e8f1fb;
}
.benefit__title {
  font-size: 18px;
  font-weight: 700;
  color: #10233f;
}
.benefit__text {
  margin-top: 2px;
  font-size: 15px;
  line-height: 1.55;
  color: #4b5563;
}

.intro__btn {
  border-radius: 12px !important;
  font-weight: 700;
}

@media (max-width: 599px) {
  .intro {
    padding: 56px 16px;
  }
}
</style>
