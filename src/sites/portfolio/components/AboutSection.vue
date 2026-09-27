<script setup>
import { tdc } from 'quasar_resaas'

import { profile } from '../portfolio.config'

const disciplines = [
  {
    icon: 'memory',
    title: 'Computer engineering',
    text: 'Solid foundations: architecture, data, networks and operating systems, applied to real systems that have to be maintained.'
  },
  {
    icon: 'manage_search',
    title: 'Digital forensics',
    text: 'Evidence acquisition, integrity, timeline analysis and clear reporting that holds up to scrutiny.'
  },
  {
    icon: 'developer_mode',
    title: 'Application development',
    text: 'Full-stack products from the database to the interface: APIs, web apps, permissions, translations and tests.'
  }
]
</script>

<template>
  <section id="about" class="pf-section" aria-labelledby="about-title">
    <div class="pf-wrap">
      <p class="pf-path pf-kicker pf-reveal">01 · ~/about</p>
      <h2 id="about-title" class="pf-title pf-reveal">{{ tdc('Three disciplines, one way of working') }}</h2>

      <!-- a bento grid: the story in the large tile, facts from the CV around it -->
      <div class="bento">
        <article class="pf-card bento__intro pf-gradient-border pf-reveal">
          <p class="bento__lead">
            {{ tdc('I studied computer engineering and digital forensics, and I build application software. The three feed each other: an engineer who has investigated incidents writes safer code, and a developer who understands systems investigates them faster.') }}
          </p>
          <ul class="bento__disciplines">
            <li v-for="item in disciplines" :key="item.title">
              <q-icon :name="item.icon" size="22px" />
              {{ tdc(item.title) }}
            </li>
          </ul>
        </article>

        <article class="pf-card bento__fact pf-reveal">
          <q-icon name="school" size="26px" class="bento__icon" />
          <span class="bento__label">{{ tdc('Currently') }}</span>
          <h3>{{ tdc('PhD in Computer Science and Digital Forensics') }}</h3>
          <p>National Forensic Sciences University</p>
        </article>

        <article class="pf-card bento__fact pf-reveal">
          <q-icon name="public" size="26px" class="bento__icon" />
          <span class="bento__label">{{ tdc('Based in') }}</span>
          <h3>{{ profile.location }}</h3>
          <p>{{ tdc('Learns quickly and is available to work inside or outside the country') }}</p>
        </article>

        <article
          v-for="(item, index) in disciplines"
          :key="item.title"
          class="pf-card bento__discipline pf-reveal"
          :style="{ transitionDelay: `${index * 90}ms` }"
        >
          <span class="bento__badge"><q-icon :name="item.icon" size="24px" /></span>
          <h3>{{ tdc(item.title) }}</h3>
          <p>{{ tdc(item.text) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px; margin-top: 48px; }
.bento__intro { grid-column: span 4; grid-row: span 2; display: flex; flex-direction: column; justify-content: space-between; gap: 28px; padding: clamp(28px, 3.4vw, 44px); }
.bento__lead { font-size: clamp(18px, 1.8vw, 22px); line-height: 1.6; color: var(--pf-text); }
.bento__disciplines { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.bento__disciplines li { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; font-size: 14px; font-weight: 600; border: 1px solid var(--pf-line); background: var(--pf-surface-2); }
.bento__disciplines .q-icon { color: var(--pf-accent); }

.bento__fact { grid-column: span 2; display: flex; flex-direction: column; gap: 6px; }
.bento__icon { color: var(--pf-cool); margin-bottom: 8px; }
.bento__label { font-family: var(--pf-font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--pf-muted); }
.bento__fact h3 { font-size: 20px; line-height: 1.25; }
.bento__fact p { color: var(--pf-muted); font-size: 14.5px; }

.bento__discipline { grid-column: span 2; }
.bento__badge { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 14px; margin-bottom: 18px; color: var(--pf-accent); background: color-mix(in srgb, var(--pf-accent) 14%, transparent); border: 1px solid color-mix(in srgb, var(--pf-accent) 30%, transparent); }
.bento__discipline h3 { font-size: 21px; margin-bottom: 10px; }
.bento__discipline p { color: var(--pf-muted); font-size: 15.5px; }

@media (max-width: 900px) {
  .bento__intro { grid-column: span 6; grid-row: auto; }
  .bento__fact { grid-column: span 3; }
  .bento__discipline { grid-column: span 6; }
}
@media (max-width: 560px) { .bento__fact { grid-column: span 6; } }
</style>
