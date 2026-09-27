<script setup>
import { tdc } from 'quasar_resaas'

import { divisions } from '../mytech.config'

// the right-hand composition: the management platform in a window, the other
// three divisions as floating cards around it (logo colours, see mytech.config)
const platform = divisions.find(d => d.id === 'management-systems')
const floating = divisions.filter(d => d.id !== 'management-systems')

const bars = [46, 70, 58, 84, 64, 92, 76]
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__grid" aria-hidden="true" />
    <div class="hero__glow" aria-hidden="true" />

    <div class="mt-wrap hero__inner">
      <div class="hero__copy">
        <p class="hero__badge">
          <span class="hero__dots" aria-hidden="true"><i /><i /><i /><i /></span>
          {{ tdc('One team, four disciplines') }}
        </p>

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

      <div class="hero__visual" aria-hidden="true">
        <div class="mt-window hero__window">
          <div class="mt-window__bar"><span /><span /><span /><em>{{ tdc(platform.title) }}</em></div>
          <div class="hero__app">
            <div class="hero__side"><i /><i /><i /><i /><i /></div>
            <div class="hero__main">
              <div class="hero__kpis"><i /><i /><i /></div>
              <div class="hero__chart">
                <i v-for="(h, i) in bars" :key="i" :style="{ height: `${h}%` }" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(d, i) in floating"
          :key="d.id"
          class="hero__float mt-spot"
          :class="`hero__float--${i}`"
        >
          <span class="hero__float-icon" :class="`bg-${d.color}`"><q-icon :name="d.icon" size="20px" color="white" /></span>
          <span class="hero__float-title">{{ tdc(d.title) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative; overflow: hidden;
  padding-top: calc(var(--mt-nav) + clamp(40px, 7vw, 88px));
  padding-bottom: clamp(72px, 10vw, 130px);
}

.hero__grid {
  position: absolute; inset: 0; opacity: .5;
  background-image:
    linear-gradient(var(--mt-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--mt-line) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(ellipse at 70% 30%, #000 0%, transparent 70%);
}

.hero__glow {
  position: absolute; width: 60vw; max-width: 760px; aspect-ratio: 1; right: -12%; top: -18%;
  background: radial-gradient(closest-side, var(--mt-glow), transparent 70%);
  pointer-events: none;
}

.hero__inner { position: relative; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: clamp(32px, 5vw, 72px); align-items: center; }

.hero__badge {
  display: inline-flex; align-items: center; gap: 10px; margin-bottom: 22px;
  padding: 7px 14px 7px 10px; border-radius: 999px; font-size: 13.5px; font-weight: 600;
  border: 1px solid var(--mt-line); background: var(--mt-surface); color: var(--mt-text);
}
.hero__dots { display: inline-flex; gap: 3px; }
.hero__dots i { width: 8px; height: 8px; border-radius: 50%; }
.hero__dots i:nth-child(1) { background: var(--mt-blue); }
.hero__dots i:nth-child(2) { background: var(--mt-green); }
.hero__dots i:nth-child(3) { background: var(--mt-gold); }
.hero__dots i:nth-child(4) { background: var(--mt-red); }

.hero__title { font-size: clamp(40px, 5.6vw, 70px); letter-spacing: -.03em; }
.hero__lead { margin-top: 24px; max-width: 46ch; color: var(--mt-muted); font-size: clamp(17px, 1.7vw, 20px); }
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }

/* THE VISUAL */
.hero__visual { position: relative; padding: 36px 24px 56px 40px; }
.hero__window { transform: perspective(1400px) rotateY(-8deg) rotateX(3deg); transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
.hero__visual:hover .hero__window { transform: perspective(1400px) rotateY(-3deg) rotateX(1deg); }
.hero__app { display: grid; grid-template-columns: 24% 1fr; min-height: 280px; }
.hero__side { display: grid; align-content: start; gap: 12px; padding: 16px 14px; border-right: 1px solid var(--mt-line); }
.hero__side i { height: 9px; border-radius: 5px; background: var(--mt-line); }
.hero__side i:first-child { width: 80%; background: var(--mt-blue); }
.hero__main { padding: 16px; display: grid; grid-template-rows: auto 1fr; gap: 14px; }
.hero__kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.hero__kpis i { height: 52px; border-radius: 10px; border: 1px solid var(--mt-line); background: color-mix(in srgb, var(--mt-blue) 8%, var(--mt-surface)); }
.hero__chart { display: flex; align-items: flex-end; gap: 8px; }
.hero__chart i { flex: 1; border-radius: 5px 5px 0 0; background: linear-gradient(to top, color-mix(in srgb, var(--mt-blue) 30%, transparent), var(--mt-blue)); }

.hero__float {
  position: absolute; display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 16px 10px 10px; border-radius: 16px; font-weight: 600; font-size: 14px;
  background: var(--mt-surface); border: 1px solid var(--mt-line); color: var(--mt-text);
  box-shadow: 0 20px 40px -22px rgba(10, 20, 35, .4);
  animation: float 6s ease-in-out infinite;
}
.hero__float-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; }
.hero__float--0 { left: 0; top: 0; }
.hero__float--1 { right: 0; top: 38%; animation-delay: -2s; }
.hero__float--2 { left: 10%; bottom: 6px; animation-delay: -4s; }
@keyframes float { 50% { transform: translateY(-10px); } }

@media (prefers-reduced-motion: reduce) { .hero__float { animation: none; } }

@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; }
  /* on a narrow screen the cards stop floating over the window: a row below it */
  .hero__visual { padding: 8px 0 0; display: flex; flex-wrap: wrap; gap: 10px; }
  .hero__window { transform: none; width: 100%; }
  .hero__float { position: static; animation: none; }
}
</style>
