<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { tdc } from 'quasar_resaas'

import { profile } from '../portfolio.config'

// The role line types itself and rotates through the three profiles. With reduced
// motion (or before mount) it just shows the first role.
const roles = computed(() => profile.roles.map(role => tdc(role)))
const shown = ref('')
const roleIndex = ref(0)

let timer = null
const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function type() {
  const word = roles.value[roleIndex.value % roles.value.length]
  let position = 0
  let deleting = false

  const step = () => {
    if (!deleting) {
      position += 1
      shown.value = word.slice(0, position)

      if (position === word.length) {
        deleting = true
        timer = setTimeout(step, 1700)
        return
      }
    } else {
      position -= 1
      shown.value = word.slice(0, position)

      if (position === 0) {
        roleIndex.value += 1
        timer = setTimeout(type, 280)
        return
      }
    }

    timer = setTimeout(step, deleting ? 38 : 72)
  }

  step()
}

onMounted(() => {
  shown.value = roles.value[0]
  if (!reduce) type()
})

onBeforeUnmount(() => clearTimeout(timer))

// the terminal: engineering and forensics in one session
const lines = [
  { prompt: true, text: 'git log --oneline -1', out: 'a1f9c2e feat: tenant isolation on every relation' },
  { prompt: true, text: 'pytest -q', out: '1214 passed' },
  { prompt: true, text: 'sha256sum evidence.img', out: '9f2c…b71e  evidence.img' },
  { prompt: true, text: 'verify --chain-of-custody', out: 'integrity verified', ok: true }
]
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__grid" aria-hidden="true" />
    <div class="hero__glow" aria-hidden="true" />

    <div class="pf-wrap hero__inner">
      <div class="hero__copy">
        <p class="pf-path">$ whoami</p>

        <h1 id="hero-title" class="hero__name">{{ profile.name }}</h1>

        <p class="hero__role" aria-live="off">
          <span class="hero__typed" data-test="hero-role">{{ shown }}</span><span class="hero__caret" aria-hidden="true" />
        </p>

        <p class="hero__pitch">
          {{ tdc('I build secure, multi-tenant software, and I know how to investigate it when something goes wrong. Engineering and forensics share one discipline: evidence, rigour and reproducible results.') }}
        </p>

        <div class="hero__actions">
          <a class="pf-btn pf-btn--primary" href="#projects" data-test="cta-projects">
            {{ tdc('View projects') }}
            <q-icon name="arrow_downward" size="18px" />
          </a>
          <a class="pf-btn" href="#contact" data-test="cta-contact">{{ tdc('Contact me') }}</a>
        </div>
      </div>

      <div class="hero__terminal" role="img" :aria-label="tdc('A terminal session mixing software engineering and digital forensics')">
        <div class="hero__bar">
          <span class="dot dot--r" /><span class="dot dot--y" /><span class="dot dot--g" />
          <span class="hero__bar-title">metano@lab: ~/cases</span>
        </div>

        <div class="hero__screen">
          <div v-for="(line, index) in lines" :key="index" class="hero__line" :style="{ '--i': index }">
            <div><span class="prompt">$</span> {{ line.text }}</div>
            <div class="out" :class="{ 'out--ok': line.ok }">{{ line.ok ? '✓ ' : '' }}{{ line.out }}</div>
          </div>
          <div class="hero__line hero__line--live" :style="{ '--i': lines.length }">
            <span class="prompt">$</span> <span class="hero__caret hero__caret--block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; overflow: hidden; padding-top: calc(var(--pf-nav) + clamp(40px, 8vw, 96px)); padding-bottom: clamp(64px, 9vw, 120px); }

.hero__grid {
  position: absolute; inset: 0; opacity: .55;
  background-image:
    linear-gradient(var(--pf-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--pf-line) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 30% 30%, #000 0%, transparent 72%);
}

.hero__glow {
  position: absolute; width: 60vw; max-width: 720px; aspect-ratio: 1; right: -12%; top: -18%;
  background: radial-gradient(closest-side, var(--pf-glow), transparent 70%);
  pointer-events: none;
}

.hero__inner { position: relative; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: clamp(32px, 5vw, 72px); align-items: center; }

.hero__name { font-size: clamp(44px, 8.4vw, 96px); }

.hero__role {
  margin-top: 18px; font-family: var(--pf-font-mono); font-size: clamp(16px, 2.2vw, 22px);
  color: var(--pf-cool); min-height: 1.6em;
}

.hero__caret { display: inline-block; width: 2px; height: 1.05em; margin-left: 3px; vertical-align: -0.15em; background: var(--pf-accent); animation: blink 1.05s steps(1) infinite; }
.hero__caret--block { width: 9px; height: 1.05em; margin-left: 2px; }
@keyframes blink { 50% { opacity: 0; } }

.hero__pitch { margin-top: 26px; max-width: 54ch; color: var(--pf-muted); font-size: clamp(16px, 1.6vw, 19px); }
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }

.hero__terminal {
  background: var(--pf-surface); border: 1px solid var(--pf-line); border-radius: var(--pf-radius);
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, .55); overflow: hidden;
  transform: rotate(-1.2deg);
}
.hero__bar { display: flex; align-items: center; gap: 7px; padding: 12px 14px; background: var(--pf-surface-2); border-bottom: 1px solid var(--pf-line); }
.dot { width: 11px; height: 11px; border-radius: 50%; }
.dot--r { background: #ff5f57; } .dot--y { background: #febc2e; } .dot--g { background: #28c840; }
.hero__bar-title { margin-left: 10px; font-family: var(--pf-font-mono); font-size: 12.5px; color: var(--pf-muted); }

.hero__screen { padding: 20px 20px 24px; font-family: var(--pf-font-mono); font-size: 14px; line-height: 1.75; min-height: 250px; }
.hero__line { opacity: 0; animation: line-in .5s ease forwards; animation-delay: calc(var(--i) * .55s + .3s); }
.hero__line .prompt { color: var(--pf-accent); }
.hero__line .out { color: var(--pf-muted); padding-left: 1.4ch; }
.hero__line .out--ok { color: var(--pf-ok); }
@keyframes line-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) { .hero__line { opacity: 1; } }

@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__terminal { transform: none; }
}
</style>
