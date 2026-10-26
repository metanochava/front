<template>
  <section class="pf-404" data-test="site-not-found">
    <div class="pf-404__term">
      <div class="pf-404__bar">
        <span /><span /><span />
        <em>~/{{ shortPath }}</em>
      </div>
      <pre class="pf-404__body"><span class="pf-404__prompt">$</span> cd {{ path }}
<span class="pf-404__err">bash: cd: {{ path }}: {{ tdc('No such file or directory') }}</span>
<span class="pf-404__prompt">$</span> echo $?
<span class="pf-404__code">404</span>
<span class="pf-404__prompt">$</span> <span class="pf-404__cursor" /></pre>
    </div>

    <h1 class="pf-404__title">{{ tdc('Page not found') }}</h1>
    <p class="pf-404__text">{{ tdc('This route was never deployed. Head back to the main page.') }}</p>
    <router-link to="/home" class="pf-404__btn">
      <q-icon name="terminal" /> cd ~/home
    </router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { tdc } from 'quasar_resaas'

const route = useRoute()
const path = computed(() => route.path || '/')
const shortPath = computed(() => path.value.replace(/^\//, '').slice(0, 32))
</script>

<style scoped>
.pf-404 {
  min-height: calc(100vh - var(--pf-nav, 68px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 16px 56px;
  text-align: center;
  color: var(--pf-text);
  background:
    radial-gradient(circle at 50% 0%, var(--pf-glow), transparent 60%),
    var(--pf-bg);
}
.pf-404__term {
  width: 100%;
  max-width: 560px;
  text-align: left;
  border-radius: var(--pf-radius, 14px);
  background: var(--pf-surface);
  border: 1px solid var(--pf-line);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .6);
  overflow: hidden;
}
.pf-404__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--pf-surface-2);
  border-bottom: 1px solid var(--pf-line);
}
.pf-404__bar span { width: 11px; height: 11px; border-radius: 50%; background: #8a8a8a; }
.pf-404__bar span:nth-child(2) { background: #6e6e6e; }
.pf-404__bar span:nth-child(3) { background: #525252; }
.pf-404__bar em { margin-left: 10px; font-style: normal; font-family: var(--pf-font-mono); font-size: 12px; color: var(--pf-muted); }
.pf-404__body {
  margin: 0;
  padding: 18px 20px 22px;
  font-family: var(--pf-font-mono);
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--pf-text);
}
.pf-404__prompt { color: var(--pf-ok); }
.pf-404__err { color: var(--pf-muted); }
.pf-404__code { color: var(--pf-accent); font-weight: 700; }
.pf-404__cursor {
  display: inline-block;
  width: 9px;
  height: 17px;
  vertical-align: text-bottom;
  background: var(--pf-accent);
  animation: pf-blink 1s steps(1) infinite;
}
.pf-404__title { margin: 36px 0 8px; font-family: var(--pf-font-display); font-size: clamp(28px, 5vw, 44px); }
.pf-404__text { margin: 0; max-width: 420px; color: var(--pf-muted); }
.pf-404__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
  padding: 12px 22px;
  border-radius: 999px;
  font-family: var(--pf-font-mono);
  font-weight: 600;
  text-decoration: none;
  color: var(--pf-accent-ink);
  background: var(--pf-accent);
  transition: transform .2s ease;
}
.pf-404__btn:hover { transform: translateY(-2px); }
@keyframes pf-blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .pf-404__cursor { animation: none; } }
</style>
