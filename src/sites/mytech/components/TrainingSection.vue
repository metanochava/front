<script setup>
import { tdc } from 'quasar_resaas'

const categories = [
  { icon: 'hub', label: 'Management systems' },
  { icon: 'fingerprint', label: 'Digital forensics' },
  { icon: 'code', label: 'Development' },
  { icon: 'dns', label: 'IT & infrastructure' },
]
</script>

<template>
  <section id="training" class="mt-section training" aria-labelledby="training-title">
    <div class="mt-wrap">
      <p class="mt-eyebrow mt-reveal">{{ tdc('Training') }}</p>
      <h2 id="training-title" class="mt-title mt-reveal">{{ tdc("We don't only build technology. We teach it.") }}</h2>
      <p class="mt-lead mt-reveal">
        {{ tdc('Practical training connected to the same disciplines MyTech works in every day - for teams adopting a new system, and for anyone building their own technical skills.') }}
      </p>

      <div class="training__grid mt-reveal">
        <div v-for="c in categories" :key="c.label" class="training__chip">
          <q-icon :name="c.icon" size="20px" />
          {{ tdc(c.label) }}
        </div>
      </div>

      <router-link class="mt-btn mt-btn--primary mt-reveal" :to="{ name: 'training' }">
        {{ tdc('Explore training') }}
        <q-icon name="arrow_forward" size="16px" />
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.training { background: var(--mt-surface-2); border-block: 1px solid var(--mt-line); }
.training__grid { display: flex; flex-wrap: wrap; gap: 12px; margin: 32px 0 30px; }
.training__chip {
  display: inline-flex; align-items: center; gap: 10px; padding: 12px 18px;
  border: 1px solid var(--mt-line); border-radius: 999px; background: var(--mt-surface);
  font-weight: 500; font-size: 15px;
}
</style>
