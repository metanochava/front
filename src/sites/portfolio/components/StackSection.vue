<script setup>
import { tdc } from 'quasar_resaas'

import { stack } from '../portfolio.config'
</script>

<template>
  <section id="stack" class="pf-section" aria-labelledby="stack-title">
    <div class="pf-wrap">
      <p class="pf-path pf-reveal">~/stack</p>
      <h2 id="stack-title" class="pf-title pf-reveal">{{ tdc('Tools I work with') }}</h2>
      <p class="pf-lead pf-reveal">{{ tdc('Chosen for reliability and for how well they can be tested and audited, not for fashion.') }}</p>

      <div class="stack__grid">
        <article v-for="(group, index) in stack" :key="group.group" class="stack__group pf-reveal" :style="{ transitionDelay: `${index * 90}ms` }">
          <header>
            <q-icon :name="group.icon" size="22px" />
            <h3>{{ tdc(group.group) }}</h3>
          </header>

          <ul>
            <li v-for="item in group.items" :key="item" class="pf-chip">{{ tdc(item) }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-top: 48px; }
.stack__group { border: 1px solid var(--pf-line); border-radius: var(--pf-radius); padding: 26px; background: linear-gradient(180deg, var(--pf-surface), transparent); }
.stack__group header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; color: var(--pf-accent); }
.stack__group h3 { font-size: 20px; color: var(--pf-text); }
.stack__group ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 9px; }
@media (max-width: 760px) { .stack__grid { grid-template-columns: 1fr; } }
</style>
