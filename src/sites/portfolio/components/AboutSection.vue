<script setup>
import { tdc } from 'quasar_resaas'

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
      <p class="pf-path pf-reveal">~/about</p>
      <h2 id="about-title" class="pf-title pf-reveal">{{ tdc('Three disciplines, one way of working') }}</h2>
      <p class="pf-lead pf-reveal">
        {{ tdc('I studied computer engineering and digital forensics, and I build application software. The three feed each other: an engineer who has investigated incidents writes safer code, and a developer who understands systems investigates them faster.') }}
      </p>

      <div class="about__grid">
        <article v-for="(item, index) in disciplines" :key="item.title" class="pf-card pf-reveal" :style="{ transitionDelay: `${index * 90}ms` }">
          <q-icon :name="item.icon" size="34px" class="about__icon" />
          <h3>{{ tdc(item.title) }}</h3>
          <p>{{ tdc(item.text) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 48px; }
.about__icon { color: var(--pf-accent); margin-bottom: 18px; }
.about__grid h3 { font-size: 22px; margin-bottom: 10px; }
.about__grid p { color: var(--pf-muted); font-size: 16px; }
@media (max-width: 860px) { .about__grid { grid-template-columns: 1fr; } }
</style>
