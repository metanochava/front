<script setup>
import { tdc } from 'quasar_resaas'

// A real sequence: the same four steps in a forensic examination and in fixing a bug.
const steps = [
  { title: 'Preserve', text: 'Never destroy the original. Reproduce the problem before touching anything.' },
  { title: 'Analyse', text: 'Follow the data end to end and find the root cause, not the symptom.' },
  { title: 'Fix', text: 'The smallest complete change that keeps the system consistent and safe.' },
  { title: 'Verify', text: 'Tests and a written record, so the result can be checked by anyone.' }
]
</script>

<template>
  <section id="method" class="pf-section method" aria-labelledby="method-title">
    <div class="pf-wrap">
      <p class="pf-path pf-kicker pf-reveal">03 · ~/method</p>
      <h2 id="method-title" class="pf-title pf-reveal">{{ tdc('The same method in the lab and in the code') }}</h2>

      <ol class="method__steps">
        <li v-for="(step, index) in steps" :key="step.title" class="pf-reveal" :style="{ transitionDelay: `${index * 100}ms` }">
          <span class="method__n" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ tdc(step.title) }}</h3>
          <p>{{ tdc(step.text) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.method { background: color-mix(in srgb, var(--pf-surface) 70%, transparent); border-block: 1px solid var(--pf-line); }
.method__steps { position: relative; list-style: none; margin: 56px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
/* the thread that joins the four steps */
.method__steps::before { content: ''; position: absolute; left: 4%; right: 4%; top: 38px; height: 1px; background: linear-gradient(90deg, transparent, var(--pf-accent), var(--pf-cool), transparent); opacity: .5; }
.method__steps li { position: relative; padding: 0 8px; }
.method__n {
  display: block; margin-bottom: 18px; font-family: var(--pf-font-display); font-weight: 800; font-size: clamp(56px, 6vw, 78px); line-height: 1;
  color: var(--pf-bg); -webkit-text-stroke: 1.5px var(--pf-accent);
  background: linear-gradient(135deg, var(--pf-accent), var(--pf-cool)); -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; transition: -webkit-text-fill-color .3s ease;
}
.method__steps li:hover .method__n { -webkit-text-fill-color: var(--pf-accent); }
.method__steps h3 { font-size: 24px; margin-bottom: 10px; }
.method__steps p { color: var(--pf-muted); font-size: 16px; }
@media (max-width: 900px) {
  .method__steps { grid-template-columns: 1fr 1fr; row-gap: 40px; }
  .method__steps::before { display: none; }
}
@media (max-width: 540px) { .method__steps { grid-template-columns: 1fr; } }
</style>
