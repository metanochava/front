<script setup>
import { tdc } from 'quasar_resaas'
</script>

<template>
  <section class="mt-section cta" aria-labelledby="cta-title">
    <div class="mt-wrap cta__inner">
      <p class="mt-eyebrow mt-reveal">{{ tdc('Start a project') }}</p>
      <h2 id="cta-title" class="cta__title mt-reveal">{{ tdc("Let's build something dependable.") }}</h2>
      <p class="mt-lead mt-reveal">{{ tdc('Tell us what you need - a system, a forensic case, a website or your next order of equipment - and MyTech will take it from there.') }}</p>

      <div class="mt-reveal" style="margin-top:32px">
        <router-link class="mt-btn mt-btn--primary" :to="{ name: 'contact' }">
          {{ tdc('Contact MyTech') }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta { position: relative; border-top: 1px solid var(--mt-line); overflow: hidden; }
.cta::before { content:''; position:absolute; inset:auto -10% -40% auto; width:60vw; max-width:720px; aspect-ratio:1; background: radial-gradient(closest-side, var(--mt-glow), transparent 70%); pointer-events:none; }
.cta__inner { position: relative; max-width: 44rem; }
.cta__title { font-size: clamp(34px, 5.6vw, 60px); font-family: var(--mt-font-display); font-weight: 700; text-wrap: balance; }
</style>
