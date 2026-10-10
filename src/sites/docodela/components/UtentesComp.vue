<template>
  <!-- Patients page, laid out section by section like a healthcare-finance
       patients page: hero with a care finder, FAQs, trust points, care
       categories, contact channels, testimonials, how it works and a closing
       call to action. Every claim reuses Docodela's own copy - no figures,
       regulators or partner counts are invented here. -->
  <div class="patients" data-test="docodela-patients">

    <!-- hero + care finder -->
    <section class="p-hero">
      <img class="p-hero__video" :src="heroImage" alt="" aria-hidden="true">
      <div class="p-hero__overlay" />

      <div class="p-hero__inner">
        <h1 class="p-hero__title">{{ tdc('Finding the right healthcare payment options') }}</h1>
        <p class="p-hero__text">{{ tdc('Tell us the care you need and we guide you to the right option.') }}</p>

        <s-card class="finder" data-test="patients-finder">
          <div class="finder__label">{{ tdc('What care are you looking for?') }}</div>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-12 col-sm">
              <div class="row q-gutter-sm">
                <s-btn
                  v-for="item in careOptions"
                  :key="item.slug"
                  no-caps
                  unelevated
                  :outline="selected !== item.slug"
                  color="primary"
                  :icon="item.icon"
                  :label="tdc(item.label)"
                  class="finder__chip"
                  @click="selected = item.slug"
                />
              </div>
            </div>
            <div class="col-12 col-sm-auto">
              <s-btn
                unelevated
                color="positive"
                icon="search"
                class="full-width"
                :label="tdc('Search')"
                :disable="!selected"
                @click="search"
              />
            </div>
          </div>
        </s-card>
      </div>
    </section>

    <!-- what Docodela does for the patient + the team behind it -->
    <section class="p-section p-section--white" data-test="patients-intro">
      <div class="p-wrap">
        <div class="row q-col-gutter-lg">
          <div v-for="(block, index) in intro" :key="block.title" class="col-12 col-md-4">
            <div class="intro" :class="{ 'intro--first': index === 0 }">
              <q-icon :name="block.icon" size="38px" class="intro__icon" />
              <h2 class="intro__title">{{ tdc(block.title) }}</h2>
              <p v-for="text in block.texts" :key="text" class="intro__text">{{ tdc(text) }}</p>
            </div>
          </div>
        </div>

        <div class="team" data-test="patients-team">
          <div class="text-center">
            <div class="section-eyebrow">Docodela 24 Horas</div>
            <h2 class="section-title">{{ tdc('Our team') }}</h2>
          </div>
          <div class="row justify-center q-col-gutter-lg q-mt-md">
            <div v-for="member in team" :key="member.role" class="col-12 col-sm-4">
              <div class="member">
                <div class="member__avatar">
                  <q-icon :name="member.icon" size="34px" color="white" />
                </div>
                <div class="member__role">{{ tdc(member.role) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FAQsComp />

    <!-- trust points -->
    <section class="p-section p-section--white">
      <div class="p-wrap row q-col-gutter-lg">
        <div v-for="item in trust" :key="item.title" class="col-12 col-md-4">
          <div class="trust">
            <q-icon :name="item.icon" size="40px" class="trust__icon" />
            <div class="trust__title">{{ tdc(item.title) }}</div>
            <div class="trust__text">{{ tdc(item.desc) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- care categories -->
    <section class="p-section">
      <div class="p-wrap">
        <div class="text-center q-mb-xl">
          <div class="section-eyebrow">{{ tdc('Care in our network') }}</div>
          <h2 class="section-title">{{ tdc('The care we help you organise') }}</h2>
        </div>

        <div class="row q-col-gutter-lg">
          <div v-for="item in careOptions" :key="item.slug" class="col-12 col-sm-6 col-md-4">
            <router-link
              class="care"
              :to="{ name: 'categoria-financiamento', params: { categoria: item.slug } }"
            >
              <q-icon :name="item.icon" size="36px" class="care__icon" />
              <div class="care__title">{{ tdc(item.label) }}</div>
              <div class="care__text">{{ tdc(item.desc) }}</div>
              <div class="care__more">
                {{ tdc('Find out more') }}
                <q-icon name="arrow_forward" size="16px" />
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- contact channels -->
    <section class="p-section p-section--white">
      <div class="p-wrap row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <h2 class="section-title">{{ tdc('Speak to us wherever, however') }}</h2>
          <p class="p-lead">{{ tdc('Contact us when it suits you best: by WhatsApp, phone or email.') }}</p>
          <p class="p-lead">{{ tdc('Talk to real people - a team that follows your case personally.') }}</p>
        </div>
        <div class="col-12 col-md-6">
          <div class="column q-gutter-md">
            <a
              v-for="channel in channels"
              :key="channel.href"
              :href="channel.href"
              :target="channel.external ? '_blank' : undefined"
              :rel="channel.external ? 'noopener' : undefined"
              class="channel"
            >
              <q-icon :name="channel.icon" size="28px" class="channel__icon" />
              <div>
                <div class="channel__title">{{ tdc(channel.title) }}</div>
                <div class="channel__value">{{ channel.value }}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <ReviewsStripComp />

    <!-- how it works -->
    <section class="p-section p-section--white">
      <div class="p-wrap">
        <div class="text-center q-mb-xl">
          <h2 class="section-title">{{ tdc('Your application process') }}</h2>
          <p class="p-lead">{{ tdc('A simple path, with our team at your side at every step.') }}</p>
        </div>

        <div class="row q-col-gutter-lg">
          <div v-for="(step, index) in steps" :key="step" class="col-12 col-sm-6 col-md-3">
            <div class="step">
              <div class="step__number">{{ index + 1 }}</div>
              <div class="step__text">{{ tdc(step) }}</div>
            </div>
          </div>
        </div>

        <div class="text-center q-mt-xl">
          <s-btn unelevated color="primary" icon="chat" :label="tdc('Contact us')" :to="{ name: 'contacto' }" />
        </div>
      </div>
    </section>

    <!-- closing call to action -->
    <section class="p-cta">
      <div class="p-wrap row items-center q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <h2 class="p-cta__title">{{ tdc('Start your treatment now') }}</h2>
          <div v-for="point in ctaPoints" :key="point" class="p-cta__point">
            <q-icon name="check_circle" size="22px" class="q-mr-sm" />
            {{ tdc(point) }}
          </div>
        </div>
        <div class="col-12 col-md-5 row q-gutter-sm justify-md-end">
          <s-btn unelevated color="white" text-color="primary" icon="calculate" :label="tdc('Assess financing')" :to="{ name: 'calculadora' }" />
          <s-btn outline color="white" icon="chat" :label="tdc('Talk to us')" :to="{ name: 'contacto' }" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'
import FAQsComp from './FAQsComp.vue'
import ReviewsStripComp from './ReviewsStripComp.vue'
import { categories } from '../categories'

const router = useRouter()

// docodela24.mp4 has text burned into it, which clashed with the title, so the
// hero uses a plain clinic photo (sharp at full width)
const heroImage = 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80&auto=format&fit=crop'

// the care categories (financing has its own call to action below)
const careOptions = Object.entries(categories)
  .filter(([slug]) => slug !== 'financiamento-saude')
  .map(([slug, item]) => ({ slug, ...item }))

const selected = ref(null)

function search () {
  if (!selected.value) return
  router.push({ name: 'categoria-financiamento', params: { categoria: selected.value } })
}

const intro = [
  {
    icon: 'local_hospital',
    title: 'Find the healthcare you need and the best way to pay for it.',
    texts: [
      'We work with leading clinics to ensure access to the care and treatment you need.',
      'Our team will be by your side throughout the whole process - from start to finish. Your care and well-being matter to us.'
    ]
  },
  {
    icon: 'savings',
    title: 'Take care of your health without compromising your financial balance.',
    texts: [
      'Access the treatment you need with a personalised payment solution, suited to your means and to the term that suits you best.'
    ]
  },
  {
    icon: 'favorite',
    title: 'Take control of your health.',
    texts: [
      'Count on us to make access to the private healthcare you need quick and simple - for you or a family member, including medical treatment and scheduled surgery.'
    ]
  }
]

const team = [
  { icon: 'medical_services', role: 'Clinical Advisor' },
  { icon: 'account_balance', role: 'Financial Advisor' },
  { icon: 'support_agent', role: 'Client Manager' }
]

const trust = [
  {
    icon: 'support_agent',
    title: 'Our team will support you',
    desc: 'A single point of contact, with support at every step.'
  },
  {
    icon: 'local_hospital',
    title: 'A network of providers',
    desc: 'We connect you with providers and specialists available in our network.'
  },
  {
    icon: 'verified',
    title: 'Clear terms, no surprises',
    desc: 'Financing only for eligible care, with the conditions explained from the start.'
  }
]

// same contacts as the contact page and the header WhatsApp button
const channels = [
  { icon: 'fab fa-whatsapp', title: 'WhatsApp', value: '+258 86 055 5999', href: 'https://wa.me/258860555999', external: true },
  { icon: 'call', title: 'Call us', value: '+258 86 055 5999', href: 'tel:+258860555999' },
  { icon: 'mail', title: 'Email', value: 'info@docodela.co.mz', href: 'mailto:info@docodela.co.mz' }
]

const steps = [
  'Tell us what you need',
  'Our team guides you through the options',
  'Assess financing, if applicable',
  'Start your treatment'
]

const ctaPoints = [
  'Be smart about how you spend your money',
  'Take control of your health'
]
</script>

<style scoped>
.p-wrap {
  max-width: 1140px;
  margin: 0 auto;
}

.p-hero {
  position: relative;
  overflow: hidden;
  min-height: 560px;
  padding: 120px 16px 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.p-hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.p-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(11, 58, 110, .85), rgba(31, 143, 107, .7));
}
.p-hero__inner {
  position: relative;
  z-index: 1;
  width: min(860px, 100%);
  text-align: center;
}
.p-hero__title {
  margin: 0;
  font-size: clamp(30px, 4.5vw, 52px);
  line-height: 1.15;
  font-weight: 800;
}
.p-hero__text {
  margin: 16px auto 32px;
  max-width: 640px;
  font-size: 18px;
  opacity: .92;
}

.finder {
  padding: 20px;
  border-radius: 16px;
  text-align: left;
}
.finder__label {
  margin-bottom: 12px;
  font-weight: 700;
  color: #10233f;
}

.p-section {
  padding: 88px 16px;
  background: #f4f8fc;
}
.p-section--white {
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
  font-size: clamp(24px, 2.8vw, 34px);
  line-height: 1.25;
  font-weight: 800;
  color: #10233f;
}
.p-lead {
  margin: 12px 0 0;
  font-size: 17px;
  line-height: 1.6;
  color: #4b5563;
}

.intro {
  height: 100%;
  padding: 32px 28px;
  border-radius: 20px;
  background: #f4f8fc;
  border-top: 4px solid #1f8f6b;
}
.intro--first {
  border-top-color: #185a9d;
}
.intro__icon {
  color: #185a9d;
}
.intro__title {
  margin: 14px 0 10px;
  font-size: 21px;
  line-height: 1.3;
  font-weight: 800;
  color: #10233f;
}
.intro__text {
  margin: 0 0 10px;
  font-size: 15.5px;
  line-height: 1.6;
  color: #4b5563;
}

.team {
  margin-top: 72px;
}
.member {
  height: 100%;
  padding: 28px 20px;
  border-radius: 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #e3ebf5;
  box-shadow: 0 12px 28px rgba(16, 35, 63, .07);
}
.member__avatar {
  width: 76px;
  height: 76px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #185a9d, #1f8f6b);
}
.member__role {
  font-size: 18px;
  font-weight: 800;
  color: #10233f;
}

.trust {
  height: 100%;
  padding: 28px;
  border-radius: 16px;
  text-align: center;
  background: #f4f8fc;
}
.trust__icon,
.care__icon,
.channel__icon {
  color: #185a9d;
}
.trust__title,
.care__title {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 800;
  color: #10233f;
}
.trust__text,
.care__text {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.55;
  color: #4b5563;
}

.care {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #e3ebf5;
  background: #fff;
  text-decoration: none;
  transition: transform .2s, box-shadow .2s;
}
.care:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(16, 35, 63, .1);
}
.care__more {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #1f8f6b;
}

.channel {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid #e3ebf5;
  text-decoration: none;
  color: inherit;
}
.channel:hover {
  border-color: #185a9d;
}
.channel__title {
  font-weight: 800;
  color: #10233f;
}
.channel__value {
  color: #4b5563;
}

.step {
  height: 100%;
  padding: 24px;
  border-radius: 16px;
  background: #f4f8fc;
  text-align: center;
}
.step__number {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  background: #185a9d;
}
.step__text {
  font-weight: 700;
  color: #10233f;
}

.p-cta {
  padding: 72px 16px;
  color: #fff;
  background: linear-gradient(135deg, #0b3a6e 0%, #185a9d 55%, #1f8f6b 100%);
}
.p-cta__title {
  margin: 0 0 16px;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
}
.p-cta__point {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 17px;
}

@media (max-width: 599px) {
  .p-hero {
    min-height: 480px;
    padding: 96px 16px 56px;
  }
  .p-section {
    padding: 56px 16px;
  }
}
</style>
