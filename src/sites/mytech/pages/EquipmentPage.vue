<script setup>
import { tdc } from 'quasar_resaas'

const categories = [
  { icon: 'desktop_windows', title: 'Desktop computers' },
  { icon: 'laptop_mac', title: 'Laptops' },
  { icon: 'developer_board', title: 'Mini PCs' },
  { icon: 'monitor', title: 'Monitors' },
  { icon: 'storage', title: 'Storage' },
  { icon: 'router', title: 'Networking equipment' },
  { icon: 'memory', title: 'Components' },
  { icon: 'headset_mic', title: 'Peripherals & accessories' },
]
</script>

<template>
  <div class="equip-page">
    <section class="mt-section" style="padding-top: calc(var(--mt-nav) + 48px)">
      <div class="mt-wrap">
        <p class="mt-eyebrow">{{ tdc('Equipment') }}</p>
        <h1 class="mt-title" style="max-width:22ch">{{ tdc('The hardware behind the software.') }}</h1>
        <p class="mt-lead">{{ tdc('MyTech supplies IT equipment for the businesses it builds systems for. This is a professional catalogue by quotation - tell us what you need and we will get back to you with options and pricing.') }}</p>
      </div>
    </section>

    <section class="mt-section" style="padding-top:0">
      <div class="mt-wrap">
        <div class="equip-grid">
          <article v-for="c in categories" :key="c.title" class="mt-card equip-card">
            <q-icon :name="c.icon" size="30px" color="warning" />
            <div class="equip-card__title">{{ tdc(c.title) }}</div>
          </article>
        </div>

        <router-link class="mt-btn mt-btn--primary" style="margin-top:36px" :to="{ name: 'contact', query: { service: 'equipment' } }">
          {{ tdc('Request a quotation') }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.equip-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
.equip-card { padding: 24px 18px; text-align: center; }
.equip-card__title { margin-top: 12px; font-weight: 600; font-size: 15px; }
@media (max-width: 860px) { .equip-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
</style>
