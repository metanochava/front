<script setup>
import { ref, onMounted } from 'vue'

import { useReveal } from '../useReveal'
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import MethodSection from '../components/MethodSection.vue'
import StackSection from '../components/StackSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import ContactSection from '../components/ContactSection.vue'

const root = ref(null)

useReveal(root)

// the reveal animation only applies once the page is running; without it everything is visible
onMounted(() => document.querySelector('.pf')?.classList.add('pf-js'))
</script>

<template>
  <div ref="root">
    <HeroSection />
    <AboutSection />
    <MethodSection />
    <StackSection />
    <ProjectsSection />
    <ContactSection />
  </div>
</template>
