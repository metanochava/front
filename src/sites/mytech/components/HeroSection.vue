<script setup>
import { tdc } from 'quasar_resaas'
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__grid" aria-hidden="true" />
    <div class="hero__glow" aria-hidden="true" />

    <div class="mt-wrap hero__inner">
      <h1 id="hero-title" class="hero__title">{{ tdc('Technology built for real business.') }}</h1>

      <p class="hero__lead">
        {{ tdc('MyTech builds digital systems, provides digital forensic services, delivers technology training and supplies IT equipment.') }}
      </p>

      <div class="hero__actions">
        <a class="mt-btn mt-btn--primary" href="#solutions">
          {{ tdc('Explore solutions') }}
          <q-icon name="arrow_downward" size="18px" />
        </a>
        <router-link class="mt-btn" :to="{ name: 'contact' }">{{ tdc('Talk to MyTech') }}</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative; overflow: hidden;
  padding-top: calc(var(--mt-nav) + clamp(56px, 10vw, 120px));
  padding-bottom: clamp(72px, 10vw, 130px);
}

.hero__grid {
  position: absolute; inset: 0; opacity: .5;
  background-image:
    linear-gradient(var(--mt-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--mt-line) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse at 25% 20%, #000 0%, transparent 70%);
}

.hero__glow {
  position: absolute; width: 55vw; max-width: 680px; aspect-ratio: 1; right: -10%; top: -20%;
  background: radial-gradient(closest-side, var(--mt-glow), transparent 70%);
  pointer-events: none;
}

.hero__inner { position: relative; max-width: 46rem; }
.hero__title { font-size: clamp(42px, 6.6vw, 76px); }
.hero__lead { margin-top: 26px; max-width: 46ch; color: var(--mt-muted); font-size: clamp(17px, 1.7vw, 20px); }
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px; }
</style>
