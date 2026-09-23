<script setup>
import { tdc } from 'quasar_resaas'

const categories = [
  {
    icon: 'hub', color: 'blue', title: 'Management systems',
    items: ['System usage', 'Administration', 'Implementation', 'Business process digitalisation']
  },
  {
    icon: 'fingerprint', color: 'red', title: 'Digital forensics',
    items: ['Digital forensics fundamentals', 'Evidence acquisition', 'Evidence preservation', 'Forensic analysis', 'Forensic tools', 'Practical laboratory training']
  },
  {
    icon: 'code', color: 'green', title: 'Software & web development',
    items: ['Programming', 'Frontend development', 'Backend development', 'Databases', 'APIs', 'Deployment']
  },
  {
    icon: 'dns', color: 'gold', title: 'IT & infrastructure',
    items: ['Computer hardware', 'Operating systems', 'Linux', 'Networking', 'Servers', 'Troubleshooting']
  },
]
</script>

<template>
  <div class="training-page">
    <section class="mt-section" style="padding-top: calc(var(--mt-nav) + 48px)">
      <div class="mt-wrap">
        <p class="mt-eyebrow">{{ tdc('Training') }}</p>
        <h1 class="mt-title" style="max-width:22ch">{{ tdc("We don't only build technology. We teach it.") }}</h1>
        <p class="mt-lead">{{ tdc('Practical training across every area MyTech works in, for teams adopting a new system and for anyone building their own technical skills. Get in touch for current schedules and pricing.') }}</p>
      </div>
    </section>

    <section class="mt-section" style="padding-top:0">
      <div class="mt-wrap">
        <div class="cat-grid">
          <article v-for="c in categories" :key="c.title" class="mt-card cat-card">
            <q-icon :name="c.icon" size="34px" :class="`cat-card__icon cat-card__icon--${c.color}`" />
            <h2 class="cat-card__title">{{ tdc(c.title) }}</h2>
            <ul class="cat-card__list">
              <li v-for="item in c.items" :key="item">{{ tdc(item) }}</li>
            </ul>
          </article>
        </div>

        <router-link class="mt-btn mt-btn--primary" style="margin-top:36px" :to="{ name: 'contact', query: { service: 'training' } }">
          {{ tdc('Ask about training') }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cat-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 20px; }
.cat-card { padding: 28px; }
.cat-card__icon--blue { color: var(--mt-blue); }
.cat-card__icon--red { color: var(--mt-red); }
.cat-card__icon--green { color: var(--mt-green); }
.cat-card__icon--gold { color: var(--mt-gold); }
.cat-card__title { font-size: 20px; margin: 14px 0 12px; }
.cat-card__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; color: var(--mt-muted); font-size: 15px; }
.cat-card__list li::before { content: '—'; margin-right: 8px; color: var(--mt-line); }
@media (max-width: 700px) { .cat-grid { grid-template-columns: 1fr; } }
</style>
