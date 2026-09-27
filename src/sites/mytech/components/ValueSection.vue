<script setup>
import { tdc } from 'quasar_resaas'

import { divisions } from '../mytech.config'

// each division's own page: the three solutions, then equipment
const target = d => d.id === 'equipment' ? { name: 'equipment' } : { name: 'solution', params: { slug: d.slug } }
</script>

<template>
  <section class="mt-section value" aria-labelledby="value-title">
    <div class="mt-wrap value__inner">
      <p class="mt-eyebrow mt-reveal">{{ tdc('One team, four disciplines') }}</p>
      <h2 id="value-title" class="mt-title mt-reveal" style="max-width:22ch">
        {{ tdc('We build technology, investigate it, teach it and supply it.') }}
      </h2>
      <p class="mt-lead mt-reveal">
        {{ tdc('The same team that designs a management system can trace what went wrong when one fails, train the people who run it day to day, and supply the hardware it runs on - one point of contact instead of four.') }}
      </p>
    </div>

    <div class="mt-wrap">
      <div class="value__grid">
        <router-link
          v-for="(d, i) in divisions"
          :key="d.id"
          :to="target(d)"
          class="mt-card value__card mt-reveal"
          :class="`value__card--${d.color}`"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <span class="value__icon" :class="`bg-${d.color}`"><q-icon :name="d.icon" size="26px" color="white" /></span>
          <h3>{{ tdc(d.title) }}</h3>
          <span class="value__more">
            {{ tdc('Explore') }}
            <q-icon name="arrow_forward" size="16px" />
          </span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.value__inner { max-width: 52rem; }
.value__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin-top: 48px; }
.value__card { display: flex; flex-direction: column; gap: 16px; padding: 26px; color: var(--mt-text); text-decoration: none; overflow: hidden; }
.value__card::after { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--tone); }
.value__card--primary { --tone: var(--mt-blue); }
.value__card--negative { --tone: var(--mt-red); }
.value__card--positive { --tone: var(--mt-green); }
.value__card--warning { --tone: var(--mt-gold); }
.value__icon { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; box-shadow: 0 12px 24px -12px var(--tone); }
.value__card h3 { font-size: 20px; line-height: 1.25; }
.value__more { margin-top: auto; display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14.5px; color: var(--tone); }
.value__card:hover .value__more .q-icon { transform: translateX(4px); }
.value__more .q-icon { transition: transform .2s ease; }
@media (max-width: 900px) { .value__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px) { .value__grid { grid-template-columns: 1fr; } }
</style>
