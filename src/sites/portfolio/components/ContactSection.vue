<script setup>
import { computed } from 'vue'
import { tdc } from 'quasar_resaas'

import { contact, profile } from '../portfolio.config'

const links = computed(() => [
  contact.github && { label: 'GitHub', href: contact.github, icon: 'code' },
  contact.linkedin && { label: 'LinkedIn', href: contact.linkedin, icon: 'work' },
  contact.whatsapp && { label: 'WhatsApp', href: contact.whatsapp, icon: 'chat' }
].filter(Boolean))
</script>

<template>
  <section id="contact" class="pf-section contact" aria-labelledby="contact-title">
    <div class="pf-wrap contact__inner">
      <p class="pf-path pf-reveal">~/contact</p>
      <h2 id="contact-title" class="contact__title pf-reveal">{{ tdc("Let's build something dependable.") }}</h2>
      <p class="pf-lead pf-reveal">{{ tdc('Open to software projects, collaboration and digital forensics consulting.') }}</p>

      <div class="contact__actions pf-reveal">
        <a v-if="contact.email" class="pf-btn pf-btn--primary" :href="`mailto:${contact.email}`" data-test="contact-email">
          <q-icon name="mail" size="20px" />
          {{ contact.email }}
        </a>

        <a v-for="link in links" :key="link.label" class="pf-btn" :href="link.href" target="_blank" rel="noopener noreferrer">
          <q-icon :name="link.icon" size="20px" />
          {{ link.label }}
        </a>
      </div>

      <p class="contact__note pf-reveal">
        <q-icon name="translate" size="18px" />
        {{ tdc('Available in Portuguese, English, Spanish and French.') }} · {{ profile.location }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.contact { position: relative; border-top: 1px solid var(--pf-line); overflow: hidden; }
.contact::before { content: ''; position: absolute; inset: auto -10% -40% auto; width: 60vw; max-width: 720px; aspect-ratio: 1; background: radial-gradient(closest-side, var(--pf-glow), transparent 70%); pointer-events: none; }
.contact__inner { position: relative; }
.contact__title { font-size: clamp(38px, 7vw, 84px); max-width: 16ch; }
.contact__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px; }
.contact__note { display: flex; align-items: center; gap: 10px; margin-top: 30px; color: var(--pf-muted); font-size: 15px; }
</style>
