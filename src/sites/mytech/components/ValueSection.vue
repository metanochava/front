<script setup>
import { tdc } from 'quasar_resaas'
</script>

<template>
  <section class="mt-section value" aria-labelledby="value-title">
    <div class="mt-wrap value__inner">
      <p class="mt-eyebrow mt-reveal">{{ tdc('One team, four disciplines') }}</p>
      <h2 id="value-title" class="mt-title mt-reveal" style="max-width:22ch">
        {{ tdc('We build technology, investigate it, teach it and supply it.') }}
      </h2>
      <p class="mt-lead mt-reveal">
        {{ tdc('The same team that designs a management system can trace what went wrong when one fails, train the people who run it day to day, and supply the hardware it runs on - one point of contact instead of four.') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.value__inner { max-width: 52rem; }
</style>
