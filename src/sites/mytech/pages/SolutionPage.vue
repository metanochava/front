<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { tdc } from 'quasar_resaas'
import { divisions } from '../mytech.config'

const route = useRoute()

const content = {
  'management-systems': {
    title: 'Management systems',
    lead: 'We design and build management systems for companies and institutions, following the RESAAS platform architecture: multi-tenant, permission-driven and modular from the start.',
    body: [
      'Every system starts with how your organisation actually operates - the people, the approvals, the exceptions - not a generic template. That process becomes the system, not the other way round.',
      'Areas of expertise include business management, human resources, clinics and healthcare, schools and education, inventory and stock, restaurants, hotels, pharmacies, insurance and administrative systems. If your process does not fit an existing area, we build a custom solution around it.'
    ],
    points: ['Multi-tenant and permission-driven from day one', 'Modular - start with what you need, add divisions later', 'Built and supported by the same team, end to end']
  },
  'digital-forensics': {
    title: 'Digital forensics',
    lead: 'A dedicated forensic practice built on methodological discipline: acquisition, preservation, analysis and reporting, documented at every step.',
    body: [
      'Services include digital evidence acquisition, evidence preservation, forensic analysis of storage and devices, data recovery and analysis, forensic consulting, technical reporting and incident-related forensic examination.',
      'We work with integrity hashing and chain-of-custody documentation throughout a case, so results can be verified and explained. We do not claim legal certifications, court-admissibility guarantees or partnerships we do not hold - our reports speak to the technical work performed.'
    ],
    points: ['Chain of custody documented from intake to report', 'Integrity verified at every stage', 'Clear technical reporting, written to be understood']
  },
  'development': {
    title: 'Web & software development',
    lead: 'A development partner for corporate websites, web applications, business platforms and APIs - built to perform and to last.',
    body: [
      'We build institutional websites, web applications, business platforms, custom software, APIs and integrations, and responsive portals - designed around the business outcome you need, not a checklist of technologies.',
      'Every project is built with performance, usability and maintainability in mind, and can integrate with the management systems and infrastructure MyTech already supports.'
    ],
    points: ['Responsive, fast and accessible by default', 'Built for long-term maintainability', 'Integrates with your existing systems and data']
  }
}

const division = computed(() => divisions.find(d => d.slug === route.params.slug) || divisions[0])
const data = computed(() => content[route.params.slug] || content['management-systems'])
</script>

<template>
  <div class="sol-page">
    <section class="mt-section sol-hero">
      <div class="mt-wrap">
        <q-icon :name="division.icon" size="52px" class="sol-hero__icon" :color="division.color" />
        <p class="mt-eyebrow">{{ tdc('Solutions') }}</p>
        <h1 class="mt-title" style="max-width:26ch">{{ tdc(data.title) }}</h1>
        <p class="mt-lead">{{ tdc(data.lead) }}</p>
      </div>
    </section>

    <section class="mt-section">
      <div class="mt-wrap sol-body">
        <p v-for="(p, i) in data.body" :key="i" class="sol-body__p">{{ tdc(p) }}</p>

        <ul class="sol-points">
          <li v-for="point in data.points" :key="point">
            <q-icon name="check_circle" size="18px" :color="division.color" />
            {{ tdc(point) }}
          </li>
        </ul>

        <router-link class="mt-btn mt-btn--primary" :to="{ name: 'contact', query: { service: division.id } }">
          {{ tdc('Request a consultation') }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sol-hero { padding-top: calc(var(--mt-nav) + 48px); }
.sol-hero__icon { margin-bottom: 18px; }

.sol-body { max-width: 46rem; }
.sol-body__p { color: var(--mt-muted); font-size: 17px; line-height: 1.75; margin-bottom: 18px; }
.sol-points { list-style: none; margin: 28px 0 34px; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.sol-points li { display: flex; align-items: center; gap: 10px; color: var(--mt-text); font-size: 15.5px; }
</style>
