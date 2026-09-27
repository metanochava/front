<template>

  <div class="carousel-bg">

    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      class="bg-transparent"
    >

      <q-carousel-slide
        v-for="item in highlights"
        :key="item.name"
        :name="item.name"
        class="column no-wrap flex-center"
      >
        <div class="q-mt-md text-center slideoverlay">
          <q-icon :name="item.icon" size="56px" />
          <div class="highlight-title q-mt-sm">{{ tdc(item.title) }}</div>
          <div class="highlight-text q-mt-xs">{{ tdc(item.desc) }}</div>
        </div>
      </q-carousel-slide>

    </q-carousel>

  </div>

</template>

<script>
import { ref } from 'vue'
import { tdc } from "quasar_resaas"

export default {
  setup () {
    // the clinic's highlights (they were four "Lorem ipsum" placeholders)
    const highlights = [
      { name: 'open', icon: 'schedule', title: 'Open 24 hours', desc: 'We are here for you day and night.' },
      { name: 'maternity', icon: 'pregnant_woman', title: 'Maternity and operating theatre', desc: 'Complete pregnancy care' },
      { name: 'specialties', icon: 'medical_services', title: 'Consultations in different specialties', desc: 'Experienced doctors in several specialties' },
      { name: 'exams', icon: 'biotech', title: 'Laboratory exams', desc: 'Clinical analyses and laboratory diagnostics' }
    ]

    return {
      slide: ref('open'),
      tdc,
      highlights
    }
  }
}
</script>

<style scoped>

.carousel-bg{
  height:500px;
  border-radius:var(--amal-radius-lg, 24px) !important;
  overflow:hidden;
  box-shadow:var(--amal-shadow);
  background-image:url("../images/13.jpeg");
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
  display:flex;
  align-items:center;
  justify-content:center;
}

.slideoverlay{
  background: color-mix(in srgb, var(--q-primary) 55%, rgba(0, 0, 0, .55));
  backdrop-filter: blur(4px);
  padding:32px 40px;
  border-radius:20px;
  color:white;
  max-width:600px;
}

.highlight-title{
  font-size:22px;
  font-weight:800;
  line-height:1.25;
}

.highlight-text{
  font-size:15px;
  opacity:.9;
}

</style>
