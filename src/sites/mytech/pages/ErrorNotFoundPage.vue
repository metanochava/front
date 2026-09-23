<script setup>
import { tdc } from 'quasar_resaas'
</script>

<template>
  <div class="notfound">
    <div class="mt-wrap notfound__inner">
      <p class="mt-eyebrow">404</p>
      <h1 class="mt-title">{{ tdc('Page not found') }}</h1>
      <p class="mt-lead">{{ tdc("The page you're looking for doesn't exist or has moved.") }}</p>
      <router-link class="mt-btn mt-btn--primary" :to="{ name: 'home' }">
        {{ tdc('Back to home') }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.notfound { min-height: 70vh; display: flex; align-items: center; padding-top: var(--mt-nav); }
.notfound__inner { text-align: center; max-width: 30rem; margin-inline: auto; }
.notfound .mt-lead { margin-inline: auto; }
.notfound .mt-btn { margin-top: 28px; }
</style>
