<template>
  <div class="nf fullscreen" :class="{ 'nf--dark': $q.dark.isActive }" data-test="not-found">
    <div class="nf__glow nf__glow--a" />
    <div class="nf__glow nf__glow--b" />
    <div class="nf__grid" />

    <main class="nf__content">
      <div v-if="brandName" class="nf__brand" data-test="not-found-brand">
        <img v-if="brandLogo" :src="brandLogo" :alt="brandName" class="nf__logo">
        <span>{{ brandName }}</span>
      </div>

      <div class="nf__badge">
        <q-icon name="explore_off" size="18px" />
        <span>{{ tdc('Error') }} 404</span>
      </div>

      <h1 class="nf__code" aria-hidden="true">
        <span>4</span>
        <span class="nf__orbit"><q-icon name="travel_explore" class="nf__orbit-icon" /></span>
        <span>4</span>
      </h1>

      <h2 class="nf__title">{{ tdc('Page not found') }}</h2>
      <p class="nf__text">
        {{ tdc('The page you are looking for does not exist, was moved, or you do not have access to it.') }}
      </p>

      <code v-if="path" class="nf__path" data-test="not-found-path">{{ path }}</code>

      <div class="nf__actions">
        <s-btn
          unelevated rounded no-caps color="primary" icon="home"
          :label="tdc('Go home')" to="/" class="nf__btn" data-test="not-found-home"
        />
        <s-btn
          outline rounded no-caps color="primary" icon="arrow_back"
          :label="tdc('Go back')" class="nf__btn" data-test="not-found-back" @click="goBack"
        />
      </div>
    </main>

    <footer class="nf__footer">
      <span class="nf__dot" />
      {{ tdc('Powered by') }} <strong>RESAAS</strong>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tdc, useUserStore, useEntityStore } from 'quasar_resaas'

const route = useRoute()
const router = useRouter()
const User = useUserStore()
const Entity = useEntityStore()

const path = computed(() => (route.fullPath && route.fullPath !== '/' ? route.fullPath : ''))

// The colours are the Theme's (--q-primary / --q-secondary): the user's entity
// type / entity inside the app, the site's Entity (or its entity type) on a
// public site. Here the brand name/logo of that Entity, when known.
const brandName = computed(() => User.Entity?.name || '')
const brandLogo = computed(() => {
  const logo = User.Entity?.logo
  return typeof logo === 'string' ? logo : logo?.url || null
})

onMounted(() => {
  // A site's 404 renders outside the site's layout, which is what normally
  // loads its branding: load it here (public GET site/, resolved by host) when
  // no theme was applied yet. On the app's own host nothing matches and the
  // default theme stays.
  if (!User.Entity && !Object.keys(User.Theme || {}).length) {
    Entity.getSettings()
  }
})

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<style scoped>
.nf {
  --nf-bg: #f6f8fc;
  --nf-text: #1d2433;
  --nf-muted: #5f6b80;
  --nf-card: rgba(255, 255, 255, 0.72);
  --nf-line: rgba(29, 36, 51, 0.06);

  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 24px 16px;
  background: var(--nf-bg);
  color: var(--nf-text);
  text-align: center;
}

.nf--dark {
  --nf-bg: #0e1220;
  --nf-text: #eef1f8;
  --nf-muted: #a3adc2;
  --nf-card: rgba(22, 27, 45, 0.72);
  --nf-line: rgba(238, 241, 248, 0.05);
}

/* soft light in the theme's colours */
.nf__glow {
  position: absolute;
  width: 46vmax;
  height: 46vmax;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
  animation: nf-float 14s ease-in-out infinite alternate;
}
.nf__glow--a {
  top: -18vmax;
  left: -12vmax;
  background: var(--q-primary);
}
.nf__glow--b {
  bottom: -20vmax;
  right: -14vmax;
  background: var(--q-secondary, var(--q-primary));
  animation-delay: -7s;
}
.nf--dark .nf__glow {
  opacity: 0.22;
}

.nf__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--nf-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--nf-line) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
  pointer-events: none;
}

.nf__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 560px;
  padding: 40px 28px 32px;
  border-radius: 28px;
  background: var(--nf-card);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px -30px rgba(15, 23, 42, 0.35);
  animation: nf-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.nf__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
  font-weight: 700;
  font-size: 16px;
}
.nf__logo {
  height: 36px;
  max-width: 140px;
  object-fit: contain;
}

.nf__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--q-primary);
  background: color-mix(in srgb, var(--q-primary) 12%, transparent);
}

.nf__code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.08em;
  margin: 18px 0 6px;
  font-size: clamp(88px, 22vw, 168px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}
.nf__code > span:not(.nf__orbit) {
  background: linear-gradient(160deg, var(--q-primary), color-mix(in srgb, var(--q-primary) 45%, var(--nf-text)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nf__orbit {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.82em;
  height: 0.82em;
  border-radius: 50%;
  border: 0.07em solid var(--q-primary);
}
.nf__orbit::after {
  content: "";
  position: absolute;
  top: -0.06em;
  left: 50%;
  width: 0.12em;
  height: 0.12em;
  margin-left: -0.06em;
  border-radius: 50%;
  background: var(--q-primary);
  transform-origin: 0.06em 0.47em;
  animation: nf-spin 6s linear infinite;
}
.nf__orbit-icon {
  font-size: 0.42em;
  color: var(--q-primary);
}

.nf__title {
  margin: 8px 0;
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 700;
  line-height: 1.25;
}

.nf__text {
  max-width: 420px;
  margin: 0 auto;
  font-size: 15px;
  line-height: 1.6;
  color: var(--nf-muted);
}

.nf__path {
  display: inline-block;
  max-width: 100%;
  margin-top: 16px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 13px;
  color: var(--nf-muted);
  background: color-mix(in srgb, var(--nf-text) 6%, transparent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nf__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}
.nf__btn {
  min-width: 150px;
  padding: 4px 18px;
}

.nf__footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 28px;
  font-size: 12px;
  color: var(--nf-muted);
}
.nf__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--q-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--q-primary) 20%, transparent);
}

@keyframes nf-in {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
@keyframes nf-float {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(4vmax, 3vmax) scale(1.08); }
}
@keyframes nf-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .nf__content { padding: 32px 20px 24px; border-radius: 22px; }
  .nf__btn { flex: 1 1 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .nf__glow, .nf__orbit::after, .nf__content { animation: none; }
}
</style>
