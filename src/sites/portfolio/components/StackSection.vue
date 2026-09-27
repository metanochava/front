<script setup>
import { tdc } from 'quasar_resaas'

import { stack } from '../portfolio.config'

// every tool once, for the moving band (the list is drawn twice so the loop has no seam)
const band = [...new Set(stack.flatMap(group => group.items))]
</script>

<template>
  <section id="stack" class="pf-section" aria-labelledby="stack-title">
    <div class="pf-wrap">
      <p class="pf-path pf-kicker pf-reveal">04 · ~/stack</p>
      <h2 id="stack-title" class="pf-title pf-reveal">{{ tdc('Tools I work with') }}</h2>
      <p class="pf-lead pf-reveal">{{ tdc('Chosen for reliability and for how well they can be tested and audited, not for fashion.') }}</p>
    </div>

    <div class="band pf-reveal" aria-hidden="true">
      <div class="band__track">
        <span v-for="(item, index) in [...band, ...band]" :key="index" class="band__item">
          <span class="band__dot" />{{ tdc(item) }}
        </span>
      </div>
    </div>

    <div class="pf-wrap">

      <div class="stack__grid">
        <article v-for="(group, index) in stack" :key="group.group" class="stack__group pf-spot pf-reveal" :style="{ transitionDelay: `${index * 90}ms` }">
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
.band { position: relative; overflow: hidden; margin-top: 44px; padding-block: 16px; border-block: 1px solid var(--pf-line);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.band__track { display: flex; gap: 36px; width: max-content; animation: band 38s linear infinite; }
.band:hover .band__track { animation-play-state: paused; }
.band__item { display: inline-flex; align-items: center; gap: 12px; font-family: var(--pf-font-display); font-weight: 700; font-size: clamp(18px, 2vw, 24px); white-space: nowrap; color: var(--pf-text); }
.band__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--pf-accent); }
@keyframes band { to { transform: translateX(-50%); } }

.stack__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-top: 48px; }
.stack__group { border: 1px solid var(--pf-line); border-radius: calc(var(--pf-radius) + 4px); padding: 26px; background: linear-gradient(180deg, var(--pf-surface), transparent); }
.stack__group header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; color: var(--pf-accent); }
.stack__group h3 { font-size: 20px; color: var(--pf-text); }
.stack__group ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 9px; }
@media (max-width: 760px) { .stack__grid { grid-template-columns: 1fr; } }
</style>
