<script setup>
import { tdc } from 'quasar_resaas'

import { work } from '../mytech.config'
</script>

<template>
  <section id="work" class="mt-section work" aria-labelledby="work-title">
    <div class="mt-wrap">
      <p class="mt-eyebrow mt-reveal">{{ tdc('Recent work') }}</p>
      <h2 id="work-title" class="mt-title mt-reveal">{{ tdc('Websites and systems in production') }}</h2>
      <p class="mt-lead mt-reveal">
        {{ tdc('Real projects for real clients, running on the same platform we build for every business.') }}
      </p>

      <div class="work__grid">
        <a
          v-for="(item, i) in work"
          :key="item.id"
          class="mt-card work__card mt-reveal"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          :style="{ transitionDelay: `${i * 90}ms` }"
          :data-test="`work-${item.id}`"
        >
          <!-- a real screenshot of the live site, in a browser frame -->
          <div class="work__shot">
            <div class="mt-window work__window">
              <div class="mt-window__bar"><span /><span /><span /><em>{{ item.domain }}</em></div>
              <img :src="item.image" :alt="item.name" loading="lazy">
            </div>
          </div>

          <div class="work__body">
            <div class="work__head">
              <h3>{{ item.name }}</h3>
              <q-icon name="north_east" size="20px" class="work__arrow" />
            </div>
            <p class="work__text">{{ tdc(item.text) }}</p>
            <ul class="work__tags">
              <li v-for="tag in item.tags" :key="tag">{{ tdc(tag) }}</li>
            </ul>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work { background: var(--mt-surface-2); border-block: 1px solid var(--mt-line); }
.work__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-top: 48px; }
.work__card { display: flex; flex-direction: column; overflow: hidden; color: var(--mt-text); text-decoration: none; }

.work__shot {
  padding: 28px 28px 0; overflow: hidden;
  background: linear-gradient(160deg, color-mix(in srgb, var(--mt-blue) 12%, var(--mt-surface)), var(--mt-surface));
  border-bottom: 1px solid var(--mt-line);
}
.work__window { border-radius: 12px 12px 0 0; border-bottom: 0; transform: translateY(8px); transition: transform .45s cubic-bezier(.2, .7, .2, 1); }
.work__card:hover .work__window { transform: translateY(0); }
.work__window img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }

.work__body { padding: 24px 28px 28px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
.work__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.work__head h3 { font-size: 22px; }
.work__arrow { color: var(--mt-accent); transition: transform .2s ease; }
.work__card:hover .work__arrow { transform: translate(3px, -3px); }
.work__text { color: var(--mt-muted); font-size: 15.5px; }
.work__tags { list-style: none; margin: auto 0 0; padding: 6px 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
.work__tags li { padding: 5px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--mt-accent); background: color-mix(in srgb, var(--mt-accent) 10%, transparent); }

@media (max-width: 860px) { .work__grid { grid-template-columns: 1fr; } }
</style>
