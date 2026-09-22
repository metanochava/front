<script setup>
import { tdc } from 'quasar_resaas'

import { projects } from '../portfolio.config'

// The words of each project (English source; tdc translates). The metadata (icon, tags,
// which one is the flagship) is data in portfolio.config.js.
const copy = {
  resaas: {
    title: 'RESAAS platform',
    kind: 'Flagship',
    text: 'A reusable multi-tenant SaaS platform: a Django framework and a Quasar / Vue framework that give every business system metadata-driven CRUD, permissions, dashboards, notifications and four languages.',
    points: [
      'Tenant isolation by entity and branch, enforced in the backend',
      'Forms and tables generated from the model metadata',
      'Per-action authorization with groups and effective permissions'
    ]
  },
  health: {
    title: 'Health information system',
    kind: 'Product',
    text: 'Patient records, appointments, exam requests, prescriptions and medical documents for clinics, built on top of the platform.',
    points: []
  },
  pharmacy: {
    title: 'Pharmacy, inventory and sales',
    kind: 'Product',
    text: 'Prescription review and dispensing, stock with movements and counts, sales and payments.',
    points: []
  },
  security: {
    title: 'Account security',
    kind: 'Security',
    text: 'Two-factor authentication with policy levels, hashed recovery codes, session control, temporary passwords and an audit trail.',
    points: []
  },
  sites: {
    title: 'Public websites',
    kind: 'Product',
    text: 'Branded websites for clinics, served by the same application by domain and available in several languages.',
    points: []
  }
}
</script>

<template>
  <section id="projects" class="pf-section projects" aria-labelledby="projects-title">
    <div class="pf-wrap">
      <p class="pf-path pf-reveal">~/projects</p>
      <h2 id="projects-title" class="pf-title pf-reveal">{{ tdc('Systems I designed and built') }}</h2>

      <div class="projects__grid">
        <article
          v-for="(project, index) in projects"
          :key="project.id"
          class="pf-card project pf-reveal"
          :class="{ 'project--featured': project.featured }"
          :style="{ transitionDelay: `${index * 80}ms` }"
          :data-test="`project-${project.id}`"
        >
          <header class="project__head">
            <q-icon :name="project.icon" size="30px" class="project__icon" />
            <span class="project__kind">{{ tdc(copy[project.id].kind) }}</span>
          </header>

          <h3>{{ tdc(copy[project.id].title) }}</h3>
          <p class="project__text">{{ tdc(copy[project.id].text) }}</p>

          <ul v-if="copy[project.id].points.length" class="project__points">
            <li v-for="point in copy[project.id].points" :key="point">{{ tdc(point) }}</li>
          </ul>

          <ul class="project__tags">
            <li v-for="tag in project.tags" :key="tag" class="pf-chip">{{ tag }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px; margin-top: 48px; }
.project { grid-column: span 3; display: flex; flex-direction: column; }
.project--featured { grid-column: span 6; padding: clamp(28px, 4vw, 44px); background: linear-gradient(135deg, var(--pf-surface), var(--pf-surface-2)); }
.project__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.project__icon { color: var(--pf-accent); }
.project__kind { font-family: var(--pf-font-mono); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--pf-muted); border: 1px solid var(--pf-line); border-radius: 999px; padding: 4px 10px; }
.project h3 { font-size: 24px; margin-bottom: 12px; }
.project--featured h3 { font-size: clamp(30px, 4vw, 44px); }
.project__text { color: var(--pf-muted); font-size: 16px; max-width: 70ch; }
.project__points { list-style: none; margin: 22px 0 0; padding: 0; display: grid; gap: 10px; }
.project__points li { position: relative; padding-left: 26px; }
.project__points li::before { content: '→'; position: absolute; left: 0; color: var(--pf-accent); font-family: var(--pf-font-mono); }
.project__tags { list-style: none; margin: auto 0 0; padding: 22px 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 760px) { .project, .project--featured { grid-column: span 6; } }
</style>
