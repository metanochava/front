<template>
  <q-page class="amal-404" data-test="site-not-found">
    <section class="amal-404__band">
      <div class="amal-404__bubble amal-404__bubble--a" />
      <div class="amal-404__bubble amal-404__bubble--b" />

      <div class="amal-404__card">
        <div class="amal-404__icon">
          <q-icon name="healing" />
        </div>
        <p class="amal-404__code">404</p>
        <h1 class="amal-404__title">{{ tdc('Page not found') }}</h1>
        <p class="amal-404__text">
          {{ tdc('This page does not exist or has moved. Our team is still here to help you.') }}
        </p>

        <div class="amal-404__actions">
          <router-link to="/home" class="amal-404__btn amal-404__btn--primary">
            <q-icon name="home" /> {{ tdc('Back to home') }}
          </router-link>
          <a href="#" class="amal-404__btn" @click.prevent="router.back()">
            <q-icon name="arrow_back" /> {{ tdc('Go back') }}
          </a>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'

const router = useRouter()
</script>

<style scoped>
.amal-404 {
  background: var(--amal-bg, #f6f8f7);
}
.amal-404__band {
  position: relative;
  /* starts under the header, like the home page slider (margin-top:-70px),
     so no white shows beside the menu bar */
  margin-top: -70px;
  min-height: calc(100vh + 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 16px 64px; /* room for the transparent header */
  overflow: hidden;
  background: var(--amal-gradient, linear-gradient(135deg, var(--q-primary), var(--q-secondary)));
}
.amal-404__bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}
.amal-404__bubble--a { width: 420px; height: 420px; top: -140px; right: -120px; }
.amal-404__bubble--b { width: 260px; height: 260px; bottom: -90px; left: -60px; }

.amal-404__card {
  position: relative;
  width: 100%;
  max-width: 520px;
  padding: 40px 28px;
  text-align: center;
  color: var(--amal-text, #0f172a);
  background: var(--amal-surface, #fff);
  border-radius: var(--amal-radius-lg, 24px);
  box-shadow: var(--amal-shadow-hover, 0 20px 44px rgba(15, 23, 42, .14));
}
.amal-404__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 32px;
  color: var(--amal-primary, var(--q-primary));
  background: var(--amal-tint, rgba(25, 118, 210, .1));
}
.amal-404__code {
  margin: 14px 0 0;
  font-size: clamp(56px, 12vw, 88px);
  font-weight: 800;
  line-height: 1;
  background: var(--amal-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.amal-404__title { margin: 10px 0 8px; font-size: 26px; font-weight: 700; line-height: 1.25; }
.amal-404__text { margin: 0 auto; max-width: 380px; color: var(--amal-muted, #5b6475); line-height: 1.6; }

.amal-404__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 28px; }
.amal-404__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  color: var(--amal-primary);
  border: 1px solid var(--amal-border, #e5e7eb);
  transition: transform .2s ease, box-shadow .2s ease;
}
.amal-404__btn:hover { transform: translateY(-2px); box-shadow: var(--amal-shadow); }
.amal-404__btn--primary {
  color: var(--amal-on-brand, #fff);
  border-color: transparent;
  background: var(--amal-primary);
}
@media (max-width: 480px) {
  .amal-404__btn { flex: 1 1 100%; justify-content: center; }
}
</style>
