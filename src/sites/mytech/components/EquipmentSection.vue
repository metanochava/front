<script setup>
import { tdc } from 'quasar_resaas'

const categories = ['Desktops', 'Laptops', 'Mini PCs', 'Monitors', 'Storage', 'Networking']

// one device per kind of hardware in the categories above
const devices = ['desktop_windows', 'laptop_mac', 'monitor', 'router']
</script>

<template>
  <section id="equipment" class="mt-section equipment" aria-labelledby="equipment-title">
    <div class="mt-wrap equipment__inner">
      <div class="mt-reveal">
        <p class="mt-eyebrow">{{ tdc('Equipment') }}</p>
        <h2 id="equipment-title" class="mt-title">{{ tdc('The hardware behind the software.') }}</h2>
        <p class="mt-lead">
          {{ tdc('MyTech supplies IT equipment for the businesses it builds systems for - from individual workstations to networking for a full office. Request a quotation for what you need.') }}
        </p>

        <div class="equipment__tags">
          <span v-for="c in categories" :key="c" class="mt-btn" style="pointer-events:none; padding:8px 16px; font-size:13.5px">{{ tdc(c) }}</span>
        </div>

        <router-link class="mt-btn mt-btn--primary" :to="{ name: 'equipment' }">
          {{ tdc('Explore equipment') }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>

      <!-- the kinds of hardware supplied, as a small grid of devices -->
      <div class="equipment__visual mt-reveal" aria-hidden="true">
        <div v-for="(icon, i) in devices" :key="icon" class="equipment__device mt-spot" :style="{ animationDelay: `${i * -1.5}s` }">
          <q-icon :name="icon" size="44px" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.equipment__inner { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,0.6fr); gap: clamp(32px,5vw,72px); align-items: center; }
.equipment__tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 22px 0 28px; }
.equipment__visual {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 22px;
  border-radius: calc(var(--mt-radius) + 6px); border: 1px solid var(--mt-line);
  background: linear-gradient(155deg, color-mix(in srgb, var(--q-warning) 16%, var(--mt-surface)), var(--mt-surface));
}
.equipment__device {
  aspect-ratio: 1; border-radius: 16px; display: grid; place-items: center;
  color: var(--mt-gold); background: var(--mt-surface); border: 1px solid var(--mt-line);
  box-shadow: 0 16px 32px -22px rgba(10, 20, 35, .35);
  animation: device 6s ease-in-out infinite;
}
.equipment__device:nth-child(2), .equipment__device:nth-child(3) { color: var(--mt-blue); }
@keyframes device { 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .equipment__device { animation: none; } }
@media (max-width: 860px) { .equipment__inner { grid-template-columns: 1fr; } }
</style>
