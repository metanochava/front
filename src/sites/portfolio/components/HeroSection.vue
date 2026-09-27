<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { tdc } from 'quasar_resaas'

import { profile, highlights } from '../portfolio.config'

// The role line types itself and rotates through the three profiles. With reduced
// motion (or before mount) it just shows the first role.
const roles = computed(() => profile.roles.map(role => tdc(role)))
const shown = ref('')

// Shown while profile.photo is empty (see portfolio.config.js): the initials of the
// first and last name, never a placeholder photo of someone else.
const initials = computed(() => {
  const words = profile.name.trim().split(/\s+/)
  return ((words[0]?.[0] || '') + (words[words.length - 1]?.[0] || '')).toUpperCase()
})
// the surname gets the accent gradient
const nameWords = profile.name.trim().split(/\s+/)
const surname = nameWords[nameWords.length - 1]
const nameStart = nameWords.slice(0, -1).join(' ')

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

        <h1 id="hero-title" class="hero__name">
          {{ nameStart }} <span class="hero__surname">{{ surname }}</span>
        </h1>

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

        <dl class="hero__stats" data-test="hero-stats">
          <div v-for="item in highlights" :key="item.label" class="hero__stat">
            <dt>{{ item.value }}</dt>
            <dd>{{ tdc(item.label) }}</dd>
          </div>
        </dl>
      </div>

      <!-- the portrait is the centrepiece; the terminal session overlaps it -->
      <div class="hero__visual">
        <div class="hero__frame">
          <div class="hero__portrait" role="img" :aria-label="profile.name" data-test="hero-portrait">
            <img v-if="profile.photo" :src="profile.photo" :alt="profile.name">
            <span v-else class="hero__portrait-fallback" aria-hidden="true">{{ initials }}</span>
          </div>

          <div class="hero__badge">
            <span class="hero__badge-dot" aria-hidden="true" />
            {{ tdc('Available for projects') }}
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

.hero__inner { position: relative; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); gap: clamp(32px, 5vw, 72px); align-items: center; }

/* THE VISUAL: a large 4:5 portrait (the CV/ID-photo ratio, object-fit: cover) in an
   accent frame, with the terminal session overlapping its lower-left corner. */
.hero__visual { position: relative; justify-self: end; width: min(100%, 440px); padding: 0 0 70px 60px; }

.hero__frame { position: relative; }
.hero__frame::before {
  content: ''; position: absolute; inset: -14px -14px 14px 14px; border-radius: calc(var(--pf-radius) + 10px);
  border: 1px solid color-mix(in srgb, var(--pf-accent) 55%, transparent);
  background: linear-gradient(150deg, color-mix(in srgb, var(--pf-accent) 22%, transparent), transparent 60%);
}
.hero__frame::after {
  content: ''; position: absolute; inset: 12% -18% -8% 18%; z-index: -1;
  background: radial-gradient(closest-side, var(--pf-glow), transparent 75%); filter: blur(10px);
}

.hero__portrait {
  position: relative; width: 100%; aspect-ratio: 4 / 5; border-radius: calc(var(--pf-radius) + 6px);
  overflow: hidden; border: 1px solid var(--pf-line); background: var(--pf-surface-2);
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, .7);
}
/* scale(1.05) trims the photo's own edges (the source has a light mark in a corner) */
.hero__portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; display: block; transform: scale(1.05); }
.hero__portrait::after {
  /* a soft fade at the bottom so the overlapping terminal sits on it cleanly */
  content: ''; position: absolute; inset: auto 0 0 0; height: 35%;
  background: linear-gradient(transparent, color-mix(in srgb, var(--pf-bg) 55%, transparent));
}
.hero__portrait-fallback {
  width: 100%; height: 100%; display: grid; place-items: center;
  font-family: var(--pf-font-display); font-weight: 700; font-size: 72px;
  color: var(--pf-accent); background: linear-gradient(160deg, var(--pf-surface-2), var(--pf-surface));
}

.hero__badge {
  position: absolute; top: 18px; right: -12px; display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 999px; font-size: 13.5px; font-weight: 600;
  color: var(--pf-text); background: color-mix(in srgb, var(--pf-surface) 88%, transparent);
  border: 1px solid var(--pf-line); backdrop-filter: blur(8px);
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, .6);
}
.hero__badge-dot {
  width: 9px; height: 9px; border-radius: 50%; background: var(--pf-ok);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--pf-ok) 60%, transparent); animation: pulse 2.2s ease-out infinite;
}
@keyframes pulse { 70% { box-shadow: 0 0 0 9px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }

.hero__name { font-size: clamp(42px, 6.4vw, 84px); line-height: 1.02; }
.hero__surname {
  background: linear-gradient(100deg, var(--pf-accent) 0%, color-mix(in srgb, var(--pf-accent) 55%, #fff) 45%, var(--pf-cool) 55%, var(--pf-accent) 100%);
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shine 7s ease-in-out infinite;
}
@keyframes shine { 0%, 100% { background-position: 100% 0; } 50% { background-position: 0 0; } }

.hero__role {
  margin-top: 18px; font-family: var(--pf-font-mono); font-size: clamp(16px, 2.2vw, 22px);
  color: var(--pf-cool); min-height: 1.6em;
}

.hero__caret { display: inline-block; width: 2px; height: 1.05em; margin-left: 3px; vertical-align: -0.15em; background: var(--pf-accent); animation: blink 1.05s steps(1) infinite; }
.hero__caret--block { width: 9px; height: 1.05em; margin-left: 2px; }
@keyframes blink { 50% { opacity: 0; } }

.hero__pitch { margin-top: 26px; max-width: 54ch; color: var(--pf-muted); font-size: clamp(16px, 1.6vw, 19px); }
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }

.hero__stats { display: flex; flex-wrap: wrap; gap: 14px 36px; margin: 44px 0 0; padding-top: 26px; border-top: 1px solid var(--pf-line); }
.hero__stat { max-width: 150px; }
.hero__stat dt {
  font-family: var(--pf-font-display); font-weight: 800; font-size: clamp(30px, 3.4vw, 42px); line-height: 1;
  background: linear-gradient(135deg, var(--pf-text), var(--pf-accent)); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero__stat dd { margin: 8px 0 0; font-size: 13.5px; line-height: 1.4; color: var(--pf-muted); }

.hero__terminal {
  position: absolute; left: 0; bottom: 0; width: min(88%, 340px);
  background: color-mix(in srgb, var(--pf-surface) 94%, transparent); backdrop-filter: blur(10px);
  border: 1px solid var(--pf-line); border-radius: var(--pf-radius);
  box-shadow: 0 30px 70px -28px rgba(0, 0, 0, .7); overflow: hidden;
  transform: rotate(-1.5deg);
}
.hero__bar { display: flex; align-items: center; gap: 7px; padding: 12px 14px; background: var(--pf-surface-2); border-bottom: 1px solid var(--pf-line); }
.dot { width: 11px; height: 11px; border-radius: 50%; }
.dot--r { background: #ff5f57; } .dot--y { background: #febc2e; } .dot--g { background: #28c840; }
.hero__bar-title { margin-left: 10px; font-family: var(--pf-font-mono); font-size: 12.5px; color: var(--pf-muted); }

.hero__screen { padding: 14px 16px 16px; font-family: var(--pf-font-mono); font-size: 12.5px; line-height: 1.65; min-height: 196px; }
.hero__line { opacity: 0; animation: line-in .5s ease forwards; animation-delay: calc(var(--i) * .55s + .3s); }
.hero__line .prompt { color: var(--pf-accent); }
.hero__line .out { color: var(--pf-muted); padding-left: 1.4ch; }
.hero__line .out--ok { color: var(--pf-ok); }
@keyframes line-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) { .hero__line { opacity: 1; } }

@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__visual { justify-self: center; order: -1; width: min(100%, 360px); padding: 14px 14px 0 0; }
  .hero__badge { right: 8px; }
  /* on a narrow screen the terminal goes under the photo (it would cover the face),
     just touching its lower edge */
  .hero__terminal { position: relative; width: 100%; margin-top: -36px; transform: none; }
}
</style>
