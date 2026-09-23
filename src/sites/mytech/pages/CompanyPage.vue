<script setup>
import { tdc } from 'quasar_resaas'
import { divisions } from '../mytech.config'
</script>

<template>
  <div class="company-page">
    <section class="mt-section" style="padding-top: calc(var(--mt-nav) + 48px)">
      <div class="mt-wrap">
        <p class="mt-eyebrow">{{ tdc('Company') }}</p>
        <h1 class="mt-title" style="max-width:22ch">{{ tdc('About MyTech') }}</h1>
        <p class="mt-lead">
          {{ tdc('MyTech is a technology company operating across four complementary areas: management systems, digital forensics, web and software development, and IT equipment.') }}
        </p>
      </div>
    </section>

    <section class="mt-section" style="padding-top:0">
      <div class="mt-wrap company-body">
        <p class="company-body__p">
          {{ tdc('The same team designs and supports every system MyTech builds - one point of contact from the first conversation through to ongoing support, rather than separate vendors for software, hardware and training.') }}
        </p>

        <h2 class="company-body__h2">{{ tdc('What we do') }}</h2>
        <div class="company-grid">
          <div v-for="d in divisions" :key="d.id" class="mt-card company-item">
            <q-icon :name="d.icon" size="26px" :color="d.color" />
            <span>{{ tdc(d.title) }}</span>
          </div>
        </div>

        <router-link class="mt-btn mt-btn--primary" style="margin-top:32px" :to="{ name: 'contact' }">
          {{ tdc('Talk to MyTech') }}
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.company-body { max-width: 46rem; }
.company-body__p { color: var(--mt-muted); font-size: 17px; line-height: 1.75; }
.company-body__h2 { font-size: 24px; margin: 36px 0 18px; font-family: var(--mt-font-display); }
.company-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
.company-item { display: flex; align-items: center; gap: 12px; padding: 16px 18px; font-weight: 600; font-size: 15px; }
@media (max-width: 600px) { .company-grid { grid-template-columns: 1fr; } }
</style>
