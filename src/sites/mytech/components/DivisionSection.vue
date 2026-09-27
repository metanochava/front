<script setup>
import { tdc } from 'quasar_resaas'

defineProps({
  division: { type: Object, required: true },
  reverse: { type: Boolean, default: false },
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  points: { type: Array, default: () => [] }
})
</script>

<template>
  <section :id="division.id" class="mt-section division" :class="{ 'division--reverse': reverse }" :aria-labelledby="`${division.id}-title`">
    <div class="mt-wrap division__inner">
      <div class="division__copy mt-reveal">
        <p class="mt-eyebrow">{{ tdc(eyebrow) }}</p>
        <h2 :id="`${division.id}-title`" class="mt-title">{{ tdc(title) }}</h2>
        <p class="mt-lead">{{ tdc(text) }}</p>

        <ul v-if="points.length" class="division__points">
          <li v-for="point in points" :key="point">
            <q-icon name="check_circle" size="18px" :color="division.color" />
            {{ tdc(point) }}
          </li>
        </ul>

        <router-link class="mt-btn mt-btn--primary" :to="{ name: 'solution', params: { slug: division.slug } }">
          {{ tdc('Explore') }} {{ tdc(division.title) }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>

      <!-- an illustrated window in the division's colour -->
      <div class="division__visual mt-reveal" :class="`division__visual--${division.color}`" aria-hidden="true">
        <div class="division__grid" />

        <div class="mt-window division__window">
          <div class="mt-window__bar"><span /><span /><span /><em>{{ tdc(division.title) }}</em></div>

          <!-- management systems: a dashboard -->
          <div v-if="division.id === 'management-systems'" class="ill-dash">
            <div class="ill-dash__kpis"><i /><i /><i /></div>
            <div class="ill-dash__rows">
              <div v-for="n in 4" :key="n" class="ill-dash__row"><i /><i /><b /></div>
            </div>
          </div>

          <!-- digital forensics: an evidence session -->
          <div v-else-if="division.id === 'digital-forensics'" class="ill-term">
            <div><span>$</span> acquire --device /dev/sdb</div>
            <div class="ill-term__out">image.E01 · 256 GB</div>
            <div><span>$</span> sha256sum image.E01</div>
            <div class="ill-term__out">9f2c4e…b71e</div>
            <div><span>$</span> verify --chain-of-custody</div>
            <div class="ill-term__ok">✓ integrity verified</div>
          </div>

          <!-- development: a code editor -->
          <div v-else class="ill-code">
            <div v-for="(w, n) in [58, 34, 72, 46, 64, 28, 52]" :key="n" class="ill-code__line" :style="{ '--w': `${w}%`, '--in': `${n % 3 * 18}px` }">
              <em>{{ n + 1 }}</em><i />
            </div>
          </div>
        </div>

        <span class="division__badge" :class="`bg-${division.color}`"><q-icon :name="division.icon" size="24px" color="white" /></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.division__inner { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,0.85fr); gap: clamp(32px,5vw,72px); align-items: center; }
.division--reverse .division__inner { grid-template-columns: minmax(0,0.85fr) minmax(0,1fr); }
.division--reverse .division__copy { order: 2; }
.division--reverse .division__visual { order: 1; }

.division__points { list-style: none; margin: 24px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.division__points li { display: flex; align-items: center; gap: 10px; color: var(--mt-text); font-size: 15.5px; }

.division__copy .mt-btn { margin-top: 28px; }

.division__visual {
  position: relative; aspect-ratio: 4/3; border-radius: calc(var(--mt-radius) + 6px);
  border: 1px solid var(--mt-line); overflow: hidden;
  display: grid; place-items: center; padding: 8%;
}
.division__grid {
  position: absolute; inset: 0; opacity: .7;
  background-image: linear-gradient(var(--mt-line) 1px, transparent 1px), linear-gradient(90deg, var(--mt-line) 1px, transparent 1px);
  background-size: 28px 28px; mask-image: radial-gradient(circle at 50% 50%, #000, transparent 80%);
}
.division__visual--primary { --tone: var(--mt-blue); background: linear-gradient(155deg, color-mix(in srgb, var(--q-primary) 16%, var(--mt-surface)), var(--mt-surface)); }
.division__visual--negative { --tone: var(--mt-red); background: linear-gradient(155deg, color-mix(in srgb, var(--q-negative) 14%, var(--mt-surface)), var(--mt-surface)); }
.division__visual--positive { --tone: var(--mt-green); background: linear-gradient(155deg, color-mix(in srgb, var(--q-positive) 14%, var(--mt-surface)), var(--mt-surface)); }
.division__visual--warning { --tone: var(--mt-gold); background: linear-gradient(155deg, color-mix(in srgb, var(--q-warning) 18%, var(--mt-surface)), var(--mt-surface)); }

.division__window { position: relative; width: 100%; transition: transform .5s cubic-bezier(.2, .7, .2, 1); }
.division__visual:hover .division__window { transform: translateY(-6px) scale(1.01); }
.division__badge { position: absolute; right: 6%; top: 6%; width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; box-shadow: 0 14px 28px -12px var(--tone); }

/* dashboard */
.ill-dash { padding: 16px; display: grid; gap: 14px; }
.ill-dash__kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ill-dash__kpis i { height: 46px; border-radius: 10px; border: 1px solid var(--mt-line); background: color-mix(in srgb, var(--tone) 10%, var(--mt-surface)); }
.ill-dash__kpis i:first-child { background: var(--tone); border-color: transparent; }
.ill-dash__rows { display: grid; gap: 8px; }
.ill-dash__row { display: grid; grid-template-columns: 30px 1fr 60px; align-items: center; gap: 10px; }
.ill-dash__row i:first-child { width: 30px; height: 30px; border-radius: 50%; background: var(--mt-surface-2); }
.ill-dash__row i:nth-child(2) { height: 8px; border-radius: 4px; background: var(--mt-line); }
.ill-dash__row b { height: 18px; border-radius: 999px; background: color-mix(in srgb, var(--tone) 22%, transparent); }

/* terminal */
.ill-term { padding: 16px 18px 18px; font-family: var(--mt-font-mono); font-size: 13px; line-height: 1.8; color: var(--mt-text); background: color-mix(in srgb, var(--mt-text) 4%, var(--mt-surface)); }
.ill-term span { color: var(--tone); }
.ill-term__out { color: var(--mt-muted); padding-left: 1.4ch; }
.ill-term__ok { color: var(--mt-green); padding-left: 1.4ch; font-weight: 600; }

/* code editor */
.ill-code { padding: 16px 16px 18px; display: grid; gap: 10px; }
.ill-code__line { display: flex; align-items: center; gap: 12px; }
.ill-code__line em { width: 14px; font-style: normal; font-family: var(--mt-font-mono); font-size: 11px; color: var(--mt-muted); text-align: right; }
.ill-code__line i { height: 9px; width: var(--w); margin-left: var(--in); border-radius: 5px; background: linear-gradient(90deg, var(--tone), color-mix(in srgb, var(--tone) 35%, var(--mt-line))); }
.ill-code__line:nth-child(3n) i { background: linear-gradient(90deg, var(--mt-blue), color-mix(in srgb, var(--mt-blue) 30%, var(--mt-line))); }

@media (max-width: 860px) {
  .division__inner, .division--reverse .division__inner { grid-template-columns: 1fr; }
  .division--reverse .division__copy, .division--reverse .division__visual { order: initial; }
}
</style>
