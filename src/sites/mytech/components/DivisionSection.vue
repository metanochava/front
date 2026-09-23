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

      <div class="division__visual mt-reveal" :class="`division__visual--${division.color}`" aria-hidden="true">
        <div class="division__grid" />
        <q-icon :name="division.icon" size="88px" class="division__icon" :color="division.color" />
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
  position: relative; aspect-ratio: 4/3; border-radius: var(--mt-radius);
  border: 1px solid var(--mt-line); overflow: hidden;
  display: grid; place-items: center;
}
.division__grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--mt-line) 1px, transparent 1px), linear-gradient(90deg, var(--mt-line) 1px, transparent 1px);
  background-size: 28px 28px;
}
.division__icon { position: relative; z-index: 1; }
.division__visual--primary { background: linear-gradient(155deg, color-mix(in srgb, var(--q-primary) 16%, var(--mt-surface)), var(--mt-surface)); }
.division__visual--negative { background: linear-gradient(155deg, color-mix(in srgb, var(--q-negative) 14%, var(--mt-surface)), var(--mt-surface)); }
.division__visual--positive { background: linear-gradient(155deg, color-mix(in srgb, var(--q-positive) 14%, var(--mt-surface)), var(--mt-surface)); }
.division__visual--warning { background: linear-gradient(155deg, color-mix(in srgb, var(--q-warning) 18%, var(--mt-surface)), var(--mt-surface)); }

@media (max-width: 860px) {
  .division__inner, .division--reverse .division__inner { grid-template-columns: 1fr; }
  .division--reverse .division__copy, .division--reverse .division__visual { order: initial; }
}
</style>
