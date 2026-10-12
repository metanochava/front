<template>
  <q-page class="dcd-404" data-test="site-not-found">
    <div class="dcd-404__inner">
      <div class="dcd-404__art" aria-hidden="true">
        <span class="dcd-404__digit">4</span>
        <span class="dcd-404__coin"><q-icon name="savings" /></span>
        <span class="dcd-404__digit">4</span>
      </div>

      <h1 class="dcd-404__title">{{ tdc('Page not found') }}</h1>
      <p class="dcd-404__text">
        {{ tdc('The page you are looking for does not exist or has moved. These may help:') }}
      </p>

      <div class="dcd-404__links">
        <router-link v-for="link in links" :key="link.to" :to="link.to" class="dcd-404__link">
          <q-icon :name="link.icon" class="dcd-404__link-icon" />
          <span>{{ tdc(link.label) }}</span>
          <q-icon name="chevron_right" class="dcd-404__chevron" />
        </router-link>
      </div>

      <q-btn unelevated rounded no-caps color="primary" icon="home" :label="tdc('Back to home')" to="/home" class="q-mt-lg" />
    </div>
  </q-page>
</template>

<script setup>
import { tdc } from 'quasar_resaas'

const links = [
  { to: '/utentes', icon: 'groups', label: 'Patients' },
  { to: '/calculadora', icon: 'contact_phone', label: 'Contacts' },
  { to: '/faqs', icon: 'help_outline', label: 'FAQs' },
  { to: '/blog', icon: 'article', label: 'Blog' },
]
</script>

<style scoped>
.dcd-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  background:
    radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--q-primary) 12%, transparent), transparent 45%),
    radial-gradient(circle at 85% 80%, color-mix(in srgb, var(--q-secondary) 14%, transparent), transparent 45%);
}
.dcd-404__inner { width: 100%; max-width: 560px; text-align: center; }

.dcd-404__art {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: clamp(72px, 16vw, 120px);
  font-weight: 800;
  line-height: 1;
  color: var(--q-primary);
}
.dcd-404__coin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.85em;
  height: 0.85em;
  border-radius: 50%;
  font-size: 1em;
  color: #fff;
  background: linear-gradient(145deg, var(--q-primary), var(--q-secondary));
  box-shadow: 0 16px 36px -12px color-mix(in srgb, var(--q-primary) 70%, transparent);
  animation: dcd-bounce 2.4s ease-in-out infinite;
}
.dcd-404__coin .q-icon { font-size: 0.45em; }

.dcd-404__title { margin: 22px 0 8px; font-size: clamp(24px, 4vw, 32px); font-weight: 700; }
.dcd-404__text { margin: 0 auto 24px; max-width: 420px; opacity: .75; line-height: 1.6; }

.dcd-404__links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; text-align: left; }
.dcd-404__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  background: color-mix(in srgb, var(--q-primary) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--q-primary) 14%, transparent);
  transition: transform .2s ease, background .2s ease;
}
.dcd-404__link:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--q-primary) 12%, transparent); }
.dcd-404__link-icon { font-size: 22px; color: var(--q-primary); }
.dcd-404__chevron { margin-left: auto; opacity: .5; }

@keyframes dcd-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@media (max-width: 480px) {
  .dcd-404__links { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dcd-404__coin { animation: none; }
}
</style>
