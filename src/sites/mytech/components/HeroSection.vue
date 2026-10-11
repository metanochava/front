<script setup>
import { tdc } from 'quasar_resaas'

import { divisions } from '../mytech.config'

// iCloud-like hero: one centred statement over soft colour light, then the
// "apps" of MyTech - each business division and product as a rounded tile
// (colours of the logo), each opening its own page
const division = id => divisions.find(d => d.id === id)

const apps = [
  ...divisions.slice(0, 3).map(d => ({
    id: d.id, icon: d.icon, label: d.title, tone: d.color,
    to: { name: 'solution', params: { slug: d.slug } }
  })),
  { id: 'equipment', icon: division('equipment')?.icon || 'memory', label: 'IT equipment', tone: 'warning', to: { name: 'equipment' } },
  { id: 'health', icon: 'local_hospital', label: 'Health system', tone: 'negative', href: '#work' },
  { id: 'training', icon: 'school', label: 'Training', tone: 'positive', to: { name: 'training' } },
  { id: 'resaas', icon: 'layers', label: 'RESAAS', tone: 'primary', href: '#work' },
  { id: 'contact', icon: 'mail', label: 'Contact', tone: 'info', to: { name: 'contact' } }
]
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__light" aria-hidden="true"><i /><i /><i /><i /></div>

    <div class="mt-wrap hero__inner">
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

      <nav class="hero__apps" :aria-label="tdc('Solutions')" data-test="hero-apps">
        <component
          :is="app.to ? 'router-link' : 'a'"
          v-for="(app, i) in apps"
          :key="app.id"
          class="app"
          :to="app.to"
          :href="app.href"
          :style="{ animationDelay: `${i * 60}ms` }"
        >
          <span class="app__icon" :class="`app__icon--${app.tone}`">
            <q-icon :name="app.icon" size="34px" color="white" />
          </span>
          <span class="app__label">{{ app.label === 'RESAAS' ? 'RESAAS' : tdc(app.label) }}</span>
        </component>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative; overflow: hidden; text-align: center;
  padding-top: calc(var(--mt-nav) + clamp(40px, 7vw, 96px));
  padding-bottom: clamp(64px, 9vw, 120px);
}

/* soft colour light, like iCloud's page background: the four logo colours,
   blurred far out of focus */
.hero__light { position: absolute; inset: -10% -10% auto; height: 720px; pointer-events: none; filter: blur(80px); opacity: .55; }
.hero__light i { position: absolute; border-radius: 50%; }
.hero__light i:nth-child(1) { width: 520px; height: 420px; left: 6%; top: 8%; background: color-mix(in srgb, var(--mt-blue) 55%, transparent); }
.hero__light i:nth-child(2) { width: 420px; height: 360px; right: 8%; top: 4%; background: color-mix(in srgb, var(--mt-green) 40%, transparent); }
.hero__light i:nth-child(3) { width: 380px; height: 320px; left: 32%; top: 38%; background: color-mix(in srgb, var(--mt-gold) 38%, transparent); }
.hero__light i:nth-child(4) { width: 360px; height: 300px; right: 26%; top: 46%; background: color-mix(in srgb, var(--mt-red) 30%, transparent); }

.hero__inner { position: relative; display: flex; flex-direction: column; align-items: center; }

.hero__badge {
  display: inline-flex; align-items: center; gap: 10px; margin-bottom: 26px;
  padding: 8px 16px 8px 12px; border-radius: 999px; font-size: 14px; font-weight: 600;
  background: color-mix(in srgb, var(--mt-surface) 70%, transparent); backdrop-filter: blur(12px);
  box-shadow: var(--mt-shadow); color: var(--mt-text);
}
.hero__dots { display: inline-flex; gap: 3px; }
.hero__dots i { width: 8px; height: 8px; border-radius: 50%; }
.hero__dots i:nth-child(1) { background: var(--mt-blue); }
.hero__dots i:nth-child(2) { background: var(--mt-green); }
.hero__dots i:nth-child(3) { background: var(--mt-gold); }
.hero__dots i:nth-child(4) { background: var(--mt-red); }

.hero__title {
  font-size: clamp(44px, 7.4vw, 92px); letter-spacing: -.04em; max-width: 14ch;
  background: linear-gradient(180deg, var(--mt-text) 30%, color-mix(in srgb, var(--mt-text) 62%, var(--mt-blue)));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero__lead { margin-top: 26px; max-width: 52ch; color: var(--mt-muted); font-size: clamp(18px, 1.9vw, 22px); line-height: 1.5; }
.hero__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 36px; }

/* THE APPS: rounded tiles in the logo colours */
.hero__apps {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(18px, 3vw, 34px) clamp(14px, 3vw, 40px);
  width: min(760px, 100%); margin-top: clamp(56px, 8vw, 88px);
  padding: clamp(24px, 4vw, 40px); border-radius: 36px;
  background: color-mix(in srgb, var(--mt-surface) 55%, transparent); backdrop-filter: blur(20px) saturate(1.4);
  box-shadow: var(--mt-shadow);
}
.app { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--mt-text); text-decoration: none;
  animation: app-in .6s cubic-bezier(.2, .7, .2, 1) both; }
.app__icon {
  width: clamp(64px, 9vw, 88px); aspect-ratio: 1; border-radius: 24%; display: grid; place-items: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .35), 0 10px 24px -10px rgba(0, 0, 0, .45);
  transition: transform .25s cubic-bezier(.2, .7, .2, 1), box-shadow .25s ease;
}
.app:hover .app__icon { transform: translateY(-4px) scale(1.06); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .35), 0 18px 32px -12px rgba(0, 0, 0, .5); }
.app__icon--primary { background: linear-gradient(160deg, var(--mt-blue-light), var(--mt-blue-dark)); }
.app__icon--negative { background: linear-gradient(160deg, #E8616D, var(--mt-red)); }
.app__icon--positive { background: linear-gradient(160deg, #3FA35C, var(--mt-green)); }
.app__icon--warning { background: linear-gradient(160deg, #F5C542, var(--mt-gold)); }
.app__icon--info { background: linear-gradient(160deg, #7FB8EE, var(--mt-blue)); }
.app__label { font-size: 14px; font-weight: 600; line-height: 1.25; text-align: center; max-width: 100%; overflow-wrap: anywhere; hyphens: auto; }
@keyframes app-in { from { opacity: 0; transform: translateY(14px) scale(.96); } }

@media (prefers-reduced-motion: reduce) { .app { animation: none; } }

@media (max-width: 560px) {
  .hero__apps { grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 20px 12px; border-radius: 28px; }
  .app__label { font-size: 11.5px; }
  .hero__apps { gap: 18px 8px; }
}
</style>
