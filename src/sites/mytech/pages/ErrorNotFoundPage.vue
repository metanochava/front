<script setup>
import { tdc } from 'quasar_resaas'

// the same destinations as the home page's app tiles
const tiles = [
  { to: '/home', icon: 'home', label: 'Home', tone: 'var(--mt-blue)' },
  { to: '/equipment', icon: 'devices', label: 'IT equipment', tone: 'var(--mt-green)' },
  { to: '/training', icon: 'school', label: 'Training', tone: 'var(--mt-gold)' },
  { to: '/contact', icon: 'chat', label: 'Contact', tone: 'var(--mt-red)' },
]
</script>

<template>
  <div class="notfound" data-test="site-not-found">
    <div class="notfound__light notfound__light--a" />
    <div class="notfound__light notfound__light--b" />

    <div class="mt-wrap notfound__inner">
      <p class="mt-eyebrow">{{ tdc('Error') }} 404</p>
      <h1 class="notfound__code" aria-hidden="true">404</h1>
      <h2 class="mt-title notfound__title">{{ tdc('Page not found') }}</h2>
      <p class="mt-lead">{{ tdc("The page you're looking for doesn't exist or has moved.") }}</p>

      <div class="notfound__tiles">
        <router-link v-for="tile in tiles" :key="tile.to" :to="tile.to" class="mt-card notfound__tile">
          <span class="notfound__tile-icon" :style="{ background: tile.tone }">
            <q-icon :name="tile.icon" />
          </span>
          <span class="notfound__tile-label">{{ tdc(tile.label) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: calc(var(--mt-nav) + 40px) 0 72px;
  overflow: hidden;
}
.notfound__light {
  position: absolute;
  width: 40vmax;
  height: 40vmax;
  border-radius: 50%;
  filter: blur(90px);
  opacity: .28;
  pointer-events: none;
}
.notfound__light--a { top: -12vmax; left: -10vmax; background: var(--mt-blue); }
.notfound__light--b { bottom: -16vmax; right: -12vmax; background: var(--mt-red); }

.notfound__inner { position: relative; text-align: center; max-width: 44rem; margin-inline: auto; }
.notfound__code {
  margin: 0;
  font-size: clamp(96px, 20vw, 180px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -.05em;
  background: linear-gradient(135deg, var(--mt-blue), var(--mt-red));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.notfound__title { margin-inline: auto; margin-top: 8px; }
.notfound .mt-lead { margin-inline: auto; }

.notfound__tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;
}
.notfound__tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 12px;
  color: inherit;
  text-decoration: none;
}
.notfound__tile-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  font-size: 26px;
  color: #fff;
}
.notfound__tile-label { font-weight: 600; font-size: 14px; }

@media (max-width: 600px) {
  .notfound__tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
