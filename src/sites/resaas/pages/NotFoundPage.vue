<template>
  <section class="rs-404" data-test="site-not-found">
    <p class="rs-404__eyebrow">HTTP 404</p>
    <h1 class="rs-404__title">{{ tdc('Page not found') }}</h1>
    <p class="rs-404__lead">
      {{ tdc('This page is not part of the RESAAS documentation. It may have been renamed or moved.') }}
    </p>

    <div class="rs-404__code">
      <div class="rs-404__code-bar">
        <span>http</span>
      </div>
      <pre><span class="rs-404__method">GET</span> {{ path }}

<span class="rs-404__status">HTTP/1.1 404 Not Found</span>
{
  <span class="rs-404__key">"error"</span>: {
    <span class="rs-404__key">"code"</span>: <span class="rs-404__str">"not_found"</span>,
    <span class="rs-404__key">"message"</span>: <span class="rs-404__str">"{{ tdc('Page not found') }}"</span>
  }
}</pre>
    </div>

    <div class="rs-404__cards">
      <router-link v-for="card in cards" :key="card.to" :to="card.to" class="rs-404__card">
        <q-icon :name="card.icon" class="rs-404__card-icon" :style="{ color: card.color }" />
        <span class="rs-404__card-title">{{ tdc(card.title) }}</span>
        <span class="rs-404__card-text">{{ tdc(card.text) }}</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { tdc } from 'quasar_resaas'

const route = useRoute()
const path = computed(() => route.fullPath || '/')

const cards = [
  { to: '/docs/guide/start-here', icon: 'rocket_launch', color: 'var(--rs-accent)', title: 'Start here', text: 'Guide' },
  { to: '/docs/django-resaas/README', icon: 'dns', color: 'var(--rs-back)', title: 'django_resaas', text: 'Backend' },
  { to: '/docs/quasar-resaas/README', icon: 'web', color: 'var(--rs-front)', title: 'quasar_resaas', text: 'Frontend' },
  { to: '/home', icon: 'home', color: 'var(--rs-muted)', title: 'Home', text: 'RESAAS documentation' },
]
</script>

<style scoped>
.rs-404 {
  max-width: 760px;
  margin: 0 auto;
  padding: calc(var(--rs-header, 64px) + 48px) 20px 64px;
  font-family: var(--rs-font);
  color: var(--rs-text);
}
.rs-404__eyebrow {
  margin: 0 0 8px;
  font-family: var(--rs-mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .08em;
  color: var(--rs-accent);
}
.rs-404__title { margin: 0; font-family: var(--rs-font-display); font-size: clamp(32px, 5vw, 48px); line-height: 1.1; }
.rs-404__lead { margin: 12px 0 28px; max-width: 560px; color: var(--rs-muted); font-size: 17px; line-height: 1.6; }

.rs-404__code {
  border-radius: var(--rs-radius, 12px);
  border: 1px solid var(--rs-line);
  background: var(--rs-code-bg);
  overflow: hidden;
}
.rs-404__code-bar {
  padding: 8px 14px;
  font-family: var(--rs-mono);
  font-size: 12px;
  color: var(--rs-code-bar-text);
  background: var(--rs-code-bar);
}
.rs-404__code pre {
  margin: 0;
  padding: 16px 18px;
  font-family: var(--rs-mono);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--rs-code-text);
  white-space: pre-wrap;
  word-break: break-all;
}
.rs-404__method { color: var(--rs-accent); font-weight: 700; }
.rs-404__status { color: #cf222e; font-weight: 600; }
.rs-404__key { color: #0550ae; }
.rs-404__str { color: #0a3069; }
:global(.body--dark) .rs-404__key { color: #79c0ff; }
:global(.body--dark) .rs-404__str { color: #a5d6ff; }
:global(.body--dark) .rs-404__status { color: #ff7b72; }

.rs-404__cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 28px; }
.rs-404__card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 12px;
  padding: 16px;
  border-radius: var(--rs-radius, 12px);
  border: 1px solid var(--rs-line);
  background: var(--rs-surface);
  color: inherit;
  text-decoration: none;
  transition: transform .2s ease, border-color .2s ease;
}
.rs-404__card:hover { transform: translateY(-2px); border-color: var(--rs-accent); }
.rs-404__card-icon { grid-row: span 2; font-size: 26px; align-self: center; }
.rs-404__card-title { font-weight: 600; }
.rs-404__card-text { font-size: 13px; color: var(--rs-muted); }
@media (max-width: 560px) { .rs-404__cards { grid-template-columns: 1fr; } }
</style>
