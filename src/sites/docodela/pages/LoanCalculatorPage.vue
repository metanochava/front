<template>
  <!-- /calculadora: the institution's contacts only. The loan calculator that
       lived here was removed on request - financing is assessed by the team,
       so every "Assess financing" button now lands on these channels. -->
  <div id="calculadora" class="contacts" data-test="docodela-contacts">

    <section class="c-hero">
      <div class="c-hero__shape c-hero__shape--a" />
      <div class="c-hero__shape c-hero__shape--b" />

      <div class="c-hero__inner">
        <div class="c-hero__eyebrow">
          <q-icon name="schedule" size="16px" class="q-mr-xs" />
          Docodela 24 Horas
        </div>
        <h1 class="c-hero__title">{{ tdc('Talk to our team') }}</h1>
        <p class="c-hero__text">
          {{ tdc('Have a question about financing your treatment? Our team is here to help.') }}
        </p>
      </div>
    </section>

    <section class="c-channels">
      <div class="c-wrap row q-col-gutter-lg">
        <div
          v-for="channel in channels"
          :key="channel.key"
          class="col-12 col-md-4"
        >
          <div
            class="channel"
            :class="{ 'channel--featured': channel.featured }"
            :data-test="`contact-${channel.key}`"
          >
            <div class="channel__icon" :style="{ background: channel.color }">
              <q-icon :name="channel.icon" size="34px" color="white" />
            </div>

            <div class="channel__title">{{ tdc(channel.title) }}</div>
            <div class="channel__text">{{ tdc(channel.desc) }}</div>

            <div class="channel__value">
              <span>{{ channel.value }}</span>
              <s-btn
                flat
                round
                dense
                size="sm"
                :icon="copied === channel.key ? 'check' : 'content_copy'"
                :color="copied === channel.key ? 'positive' : 'grey-7'"
                @click="copy(channel)"
              >
                <q-tooltip>{{ tdc(copied === channel.key ? 'Copied' : 'Copy') }}</q-tooltip>
              </s-btn>
            </div>

            <s-btn
              unelevated
              no-caps
              size="lg"
              class="channel__action full-width"
              :style="{ background: channel.color }"
              text-color="white"
              :icon="channel.icon"
              :label="tdc(channel.action)"
              :href="channel.href"
              :target="channel.external ? '_blank' : undefined"
              :rel="channel.external ? 'noopener noreferrer' : undefined"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="c-points">
      <div class="c-wrap row justify-center q-col-gutter-md">
        <div v-for="point in points" :key="point.text" class="col-12 col-sm-4">
          <div class="point">
            <q-icon :name="point.icon" size="26px" class="point__icon" />
            {{ tdc(point.text) }}
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { copyToClipboard } from 'quasar'
import { tdc } from 'quasar_resaas'

// same contacts as the footer (RodapePage.vue) and the header WhatsApp button
const PHONE = '+258 86 055 5999'
const EMAIL = 'info@docodela.co.mz'

const channels = [
  {
    key: 'whatsapp',
    featured: true,
    icon: 'fab fa-whatsapp',
    color: '#25d366',
    title: 'WhatsApp',
    desc: 'Chat with our team on WhatsApp.',
    value: PHONE,
    action: 'Send a message',
    href: 'https://wa.me/258860555999',
    external: true,
  },
  {
    key: 'phone',
    icon: 'call',
    color: '#185a9d',
    title: 'Phone',
    desc: 'Speak directly with our team.',
    value: PHONE,
    action: 'Call now',
    href: `tel:${PHONE.replace(/\s/g, '')}`,
  },
  {
    key: 'email',
    icon: 'mail',
    color: '#1f8f6b',
    title: 'Email',
    desc: 'Send us your questions or documents.',
    value: EMAIL,
    action: 'Send an email',
    href: `mailto:${EMAIL}`,
  },
]

const points = [
  { icon: 'support_agent', text: 'A single point of contact' },
  { icon: 'route', text: 'Support at every step' },
  { icon: 'verified', text: 'Clear terms, no surprises' },
]

const copied = ref(null)
let timer = null

async function copy (channel) {
  try {
    await copyToClipboard(channel.value)
  } catch {
    return
  }
  copied.value = channel.key
  clearTimeout(timer)
  timer = setTimeout(() => { copied.value = null }, 2000)
}
</script>

<style scoped>
.c-wrap {
  max-width: 1140px;
  margin: 0 auto;
}

.c-hero {
  position: relative;
  overflow: hidden;
  padding: 120px 16px 150px;
  text-align: center;
  color: #fff;
  background: linear-gradient(135deg, #0b3a6e 0%, #185a9d 55%, #1f8f6b 100%);
}
.c-hero__shape {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(255, 255, 255, .06);
}
.c-hero__shape--a {
  width: 460px;
  height: 460px;
  top: -180px;
  right: -120px;
}
.c-hero__shape--b {
  width: 320px;
  height: 320px;
  bottom: -160px;
  left: -100px;
}
.c-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}
.c-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, .14);
}
.c-hero__title {
  margin: 20px 0 0;
  font-size: clamp(32px, 5vw, 56px);
  line-height: 1.1;
  font-weight: 800;
}
.c-hero__text {
  margin: 18px auto 0;
  font-size: 19px;
  line-height: 1.55;
  opacity: .92;
}

/* the cards overlap the bottom of the hero */
.c-channels {
  position: relative;
  z-index: 2;
  margin-top: -96px;
  padding: 0 16px 72px;
}

.channel {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 28px 28px;
  border-radius: 24px;
  text-align: center;
  background: #fff;
  border: 1px solid #e3ebf5;
  box-shadow: 0 18px 40px rgba(16, 35, 63, .1);
  transition: transform .25s, box-shadow .25s;
}
.channel:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 50px rgba(16, 35, 63, .16);
}
.channel--featured {
  border: 2px solid #25d366;
}
.channel__icon {
  width: 76px;
  height: 76px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 22px rgba(16, 35, 63, .18);
}
.channel__title {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 800;
  color: #10233f;
}
.channel__text {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.5;
  color: #4b5563;
}
.channel__value {
  margin: 18px 0 22px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 700;
  color: #10233f;
  word-break: break-all;
}
.channel__action {
  margin-top: auto;
  border-radius: 14px;
  font-weight: 700;
}

.c-points {
  padding: 0 16px 88px;
}
.point {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  color: #10233f;
  background: #f4f8fc;
}
.point__icon {
  color: #1f8f6b;
}

@media (max-width: 599px) {
  .c-hero {
    padding: 96px 16px 128px;
  }
  .c-channels {
    padding-bottom: 48px;
  }
  .c-points {
    padding-bottom: 56px;
  }
}
</style>
