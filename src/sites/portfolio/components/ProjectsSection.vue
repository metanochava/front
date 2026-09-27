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
      <p class="pf-path pf-kicker pf-reveal">05 · ~/projects</p>
      <h2 id="projects-title" class="pf-title pf-reveal">{{ tdc('Systems I designed and built') }}</h2>

      <div class="projects__grid">
        <article
          v-for="(project, index) in projects"
          :key="project.id"
          class="pf-card project pf-reveal"
          :class="{ 'project--featured pf-gradient-border': project.featured }"
          :style="{ transitionDelay: `${index * 80}ms` }"
          :data-test="`project-${project.id}`"
        >
          <!-- the visual: real screenshots in browser frames when the project has them,
               otherwise an illustrated interface in the project's colour -->
          <div class="project__visual" :class="`project__visual--${project.tone || 'accent'}`">
            <div v-if="project.shots" class="shots">
              <figure v-for="(shot, i) in project.shots" :key="shot.src" class="shot" :class="`shot--${i}`">
                <div class="shot__bar">
                  <span /><span /><span />
                  <em>{{ shot.url }}</em>
                </div>
                <img :src="shot.src" :alt="shot.alt" loading="lazy">
              </figure>
            </div>

            <div v-else class="mock" aria-hidden="true">
              <div class="mock__bar"><span /><span /><span /></div>
              <div class="mock__body">
                <div class="mock__side"><i /><i /><i /><i /></div>
                <div class="mock__main">
                  <div class="mock__cards"><i /><i /><i /></div>
                  <div class="mock__chart">
                    <i v-for="(h, i) in [42, 68, 54, 82, 60, 94, 72]" :key="i" :style="{ height: `${h}%` }" />
                  </div>
                </div>
              </div>
              <span class="mock__badge"><q-icon :name="project.icon" /></span>
            </div>

            <span class="project__kind">{{ tdc(copy[project.id].kind) }}</span>
          </div>

          <div class="project__body">
            <h3>{{ tdc(copy[project.id].title) }}</h3>
            <p class="project__text">{{ tdc(copy[project.id].text) }}</p>

            <ul v-if="copy[project.id].points.length" class="project__points">
              <li v-for="point in copy[project.id].points" :key="point">{{ tdc(point) }}</li>
            </ul>

            <ul class="project__tags">
              <li v-for="tag in project.tags" :key="tag" class="pf-chip">{{ tag }}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px; margin-top: 48px; }
.project { grid-column: span 3; display: flex; flex-direction: column; padding: 0; overflow: hidden; }

.project__visual {
  --tone: var(--pf-accent);
  position: relative; height: 210px; overflow: hidden;
  border-bottom: 1px solid var(--pf-line);
  background:
    radial-gradient(120% 90% at 15% 0%, color-mix(in srgb, var(--tone) 28%, transparent), transparent 60%),
    radial-gradient(90% 80% at 100% 100%, color-mix(in srgb, var(--pf-cool) 18%, transparent), transparent 60%),
    var(--pf-surface-2);
}
.project__visual--cool { --tone: var(--pf-cool); }
.project__visual--ok { --tone: var(--pf-ok); }
.project__visual::before {
  content: ''; position: absolute; inset: 0; opacity: .45;
  background-image: linear-gradient(var(--pf-line) 1px, transparent 1px), linear-gradient(90deg, var(--pf-line) 1px, transparent 1px);
  background-size: 26px 26px; mask-image: radial-gradient(circle at 50% 40%, #000, transparent 80%);
}
.project__kind { position: absolute; z-index: 3; top: 14px; left: 14px; font-family: var(--pf-font-mono); font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--pf-text); background: color-mix(in srgb, var(--pf-bg) 60%, transparent); border: 1px solid var(--pf-line); border-radius: 999px; padding: 4px 10px; backdrop-filter: blur(6px); }

/* illustrated interface */
.mock {
  position: absolute; left: 12%; right: 12%; top: 42px; bottom: -18px;
  border-radius: 12px 12px 0 0; overflow: hidden;
  background: color-mix(in srgb, var(--pf-bg) 70%, var(--pf-surface));
  border: 1px solid var(--pf-line); box-shadow: 0 24px 50px -24px rgba(0, 0, 0, .6);
  transition: transform .45s cubic-bezier(.2, .7, .2, 1);
}
.project:hover .mock { transform: translateY(-8px); }
.mock__bar { display: flex; gap: 5px; padding: 8px 10px; border-bottom: 1px solid var(--pf-line); }
.mock__bar span { width: 7px; height: 7px; border-radius: 50%; background: var(--pf-line); }
.mock__body { display: grid; grid-template-columns: 22% 1fr; height: 100%; }
.mock__side { display: grid; align-content: start; gap: 8px; padding: 12px 10px; border-right: 1px solid var(--pf-line); }
.mock__side i { height: 7px; border-radius: 4px; background: var(--pf-line); }
.mock__side i:first-child { background: color-mix(in srgb, var(--tone) 70%, transparent); width: 80%; }
.mock__main { padding: 12px; display: grid; grid-template-rows: auto 1fr; gap: 10px; }
.mock__cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.mock__cards i { height: 34px; border-radius: 7px; border: 1px solid var(--pf-line); background: color-mix(in srgb, var(--tone) 10%, transparent); }
.mock__chart { display: flex; align-items: flex-end; gap: 6px; padding-bottom: 26px; }
.mock__chart i { flex: 1; border-radius: 4px 4px 0 0; background: linear-gradient(to top, color-mix(in srgb, var(--tone) 35%, transparent), var(--tone)); opacity: .85; }
.mock__badge { position: absolute; right: 12px; top: 10px; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; font-size: 20px; color: var(--pf-accent-ink); background: var(--tone); box-shadow: 0 8px 20px -8px var(--tone); }

/* real screenshots in browser frames, overlapping */
.shots { position: absolute; inset: 0; }
.shot { position: absolute; margin: 0; width: 56%; border-radius: 10px; overflow: hidden; border: 1px solid var(--pf-line); background: var(--pf-surface); box-shadow: 0 24px 50px -22px rgba(0, 0, 0, .65); transition: transform .45s cubic-bezier(.2, .7, .2, 1); }
.shot--0 { left: 5%; top: 46px; transform: rotate(-4deg); z-index: 1; }
.shot--1 { right: 5%; top: 78px; transform: rotate(4deg); z-index: 2; }
.project:hover .shot--0 { transform: rotate(-4deg) translate(-6px, -6px); }
.project:hover .shot--1 { transform: rotate(4deg) translate(6px, -8px); }
.shot__bar { display: flex; align-items: center; gap: 4px; padding: 6px 8px; background: var(--pf-surface-2); border-bottom: 1px solid var(--pf-line); }
.shot__bar span { width: 6px; height: 6px; border-radius: 50%; background: var(--pf-line); }
.shot__bar em { margin-left: 8px; font-style: normal; font-family: var(--pf-font-mono); font-size: 9.5px; color: var(--pf-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.shot img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }

.project__body { display: flex; flex-direction: column; flex: 1; padding: 26px 28px 28px; }
.project h3 { font-size: 23px; margin-bottom: 10px; }
.project__text { color: var(--pf-muted); font-size: 15.5px; max-width: 70ch; }
.project__points { list-style: none; margin: 20px 0 0; padding: 0; display: grid; gap: 10px; }
.project__points li { position: relative; padding-left: 26px; }
.project__points li::before { content: '→'; position: absolute; left: 0; color: var(--pf-accent); font-family: var(--pf-font-mono); }
.project__tags { list-style: none; margin: auto 0 0; padding: 22px 0 0; display: flex; flex-wrap: wrap; gap: 8px; }

/* the flagship: the visual on the right, taller, in two columns */
.project--featured { grid-column: span 6; display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); }
.project--featured .project__visual { order: 2; height: auto; min-height: 320px; border-bottom: 0; border-left: 1px solid var(--pf-line); }
.project--featured .mock { top: 56px; left: 10%; right: 8%; }
.project--featured .project__body { padding: clamp(28px, 4vw, 48px); }
.project--featured h3 { font-size: clamp(30px, 4vw, 46px); }

@media (max-width: 760px) {
  .project, .project--featured { grid-column: span 6; }
  .project--featured { grid-template-columns: 1fr; }
  .project--featured .project__visual { order: 0; min-height: 220px; border-left: 0; border-bottom: 1px solid var(--pf-line); }
}
</style>
