<script setup>
import { tdc } from 'quasar_resaas'

const categories = ['Desktops', 'Laptops', 'Mini PCs', 'Monitors', 'Storage', 'Networking']
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

      <div class="equipment__visual mt-reveal" aria-hidden="true">
        <q-icon name="memory" size="72px" color="warning" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.equipment__inner { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,0.6fr); gap: clamp(32px,5vw,72px); align-items: center; }
.equipment__tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 22px 0 28px; }
.equipment__visual {
  aspect-ratio: 1; border-radius: var(--mt-radius); border: 1px solid var(--mt-line);
  background: linear-gradient(155deg, color-mix(in srgb, var(--q-warning) 16%, var(--mt-surface)), var(--mt-surface));
  display: grid; place-items: center;
}
@media (max-width: 860px) { .equipment__inner { grid-template-columns: 1fr; } }
</style>
