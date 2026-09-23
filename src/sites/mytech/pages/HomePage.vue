<script setup>
import { ref, onMounted } from 'vue'

import { useReveal } from '../../shared/useReveal'
import { divisions } from '../mytech.config'
import HeroSection from '../components/HeroSection.vue'
import ValueSection from '../components/ValueSection.vue'
import DivisionSection from '../components/DivisionSection.vue'
import TrainingSection from '../components/TrainingSection.vue'
import EquipmentSection from '../components/EquipmentSection.vue'
import FinalCtaSection from '../components/FinalCtaSection.vue'

const root = ref(null)
useReveal(root, 'mt')

onMounted(() => document.querySelector('.mt')?.classList.add('mt-js'))

const managementSystems = divisions[0]
const digitalForensics = divisions[1]
const development = divisions[2]
</script>

<template>
  <div ref="root" id="solutions">
    <HeroSection />
    <ValueSection />
    <DivisionSection
      :division="managementSystems"
      eyebrow="Management systems"
      title="Systems designed around how your business actually works"
      text="We design and build management systems for companies and institutions - from business operations to healthcare, education, stock and hospitality - so the software follows your process, not the other way round."
      :points="['Built around your real workflow', 'Tenant and permission control from day one', 'Grows with the business, module by module']"
    />
    <DivisionSection
      :division="digitalForensics"
      reverse
      eyebrow="Digital forensics"
      title="Precision and integrity when it matters most"
      text="Our digital forensics work follows a disciplined methodology - evidence acquisition, preservation, analysis and reporting - with integrity and chain of custody documented at every step."
      :points="['Documented chain of custody', 'Verifiable integrity at every step', 'Clear, technical reporting']"
    />
    <DivisionSection
      :division="development"
      eyebrow="Web & software development"
      title="Digital products built to last"
      text="We design and build responsive web applications, business platforms and APIs, integrated with the systems your business already runs on - focused on performance, usability and long-term maintainability."
      :points="['Responsive by default', 'Built for maintainability', 'Integrates with your existing systems']"
    />
    <TrainingSection />
    <EquipmentSection />
    <FinalCtaSection />
  </div>
</template>
