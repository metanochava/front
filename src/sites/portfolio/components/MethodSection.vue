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
      <p class="pf-path pf-reveal">~/method</p>
      <h2 id="method-title" class="pf-title pf-reveal">{{ tdc('The same method in the lab and in the code') }}</h2>

      <ol class="method__steps">
        <li v-for="(step, index) in steps" :key="step.title" class="pf-reveal" :style="{ transitionDelay: `${index * 100}ms` }">
          <span class="method__n" aria-hidden="true">{{ index + 1 }}</span>
          <h3>{{ tdc(step.title) }}</h3>
          <p>{{ tdc(step.text) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.method { background: var(--pf-surface); border-block: 1px solid var(--pf-line); }
.method__steps { list-style: none; margin: 52px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; counter-reset: none; }
.method__steps li { position: relative; padding: 0 28px 0 0; }
.method__steps li + li { padding-left: 28px; border-left: 1px solid var(--pf-line); }
.method__n { font-family: var(--pf-font-mono); font-size: 14px; color: var(--pf-accent); display: block; margin-bottom: 14px; }
.method__steps h3 { font-size: 24px; margin-bottom: 10px; }
.method__steps p { color: var(--pf-muted); font-size: 16px; }
@media (max-width: 900px) {
  .method__steps { grid-template-columns: 1fr 1fr; row-gap: 40px; }
  .method__steps li:nth-child(odd) { padding-left: 0; border-left: 0; }
}
@media (max-width: 540px) {
  .method__steps { grid-template-columns: 1fr; }
  .method__steps li + li { padding-left: 0; border-left: 0; padding-top: 28px; border-top: 1px solid var(--pf-line); }
}
</style>
