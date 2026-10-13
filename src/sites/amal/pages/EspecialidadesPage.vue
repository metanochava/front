<template>

<!-- The clinic's real specialties: those of its doctors (public
     saude/publicbooking/doctors/, shared with "Our doctors" and the booking
     form). Without doctors the section is not shown - no invented specialties. -->
<div v-if="specialties.length" id="especialidades" class="amal-section specialties-section" data-test="specialties">

  <!-- TITULO -->
  <div class="row justify-center q-mb-xl q-px-md">
      <div class="text-center col-12">
        <div class="amal-eyebrow">{{ tdc('Amal Clinic') }}</div>
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Specialties') }}
        </h2>
      </div>
  </div>


  <!-- ESPECIALIDADES -->

  <!-- same 10-column width as the other sections (the cards touched the screen edges) -->
  <div class="row justify-center q-px-md">
  <div class="col-12 col-md-10 row justify-center q-col-gutter-lg">

    <div
      class="col-md-3 col-sm-6 col-12"
      v-for="s in specialties"
      :key="s.id"
    >

      <s-card class="amal-card amal-card--hover text-center specialty-card" data-test="specialty-card">

        <q-card-section class="q-pa-lg">

          <span class="amal-icon"><q-icon name="medical_services" size="28px" /></span>

          <div class="text-h6 text-weight-bold q-mt-md">
            {{ tdc(s.title) }}
          </div>

          <div class="q-mt-sm amal-muted specialty-desc">
            {{ s.doctors }} {{ tdc(s.doctors === 1 ? 'Doctor' : 'Doctors') }}
          </div>

          <s-btn
            flat
            rounded
            no-caps
            color="primary"
            icon="event"
            class="q-mt-md"
            :label="tdc('Book appointment')"
            data-test="specialty-book"
            @click="bookSpecialty(s)"
          />

        </q-card-section>

      </s-card>

    </div>

  </div>
  </div>

</div>

</template>


<script>

import { defineComponent, computed, onMounted } from "vue"
import { tdc, useUserStore } from "quasar_resaas"
import { usePublicBooking } from "../usePublicBooking"

export default defineComponent({

setup(){

const User =useUserStore()

const ps = computed(()=>User.ps || {})

const { state: booking, loadDoctors, bookSpecialty } = usePublicBooking()

onMounted(loadDoctors)

// every specialty of the clinic's doctors, once, with how many doctors have it
const specialties = computed(() => {
  const byId = new Map()
  for (const doctor of booking.doctors) {
    for (const specialty of doctor.specialties || []) {
      const item = byId.get(specialty.id) || { ...specialty, doctors: 0 }
      item.doctors += 1
      byId.set(specialty.id, item)
    }
  }
  return [...byId.values()].sort((x, y) => x.title.localeCompare(y.title))
})

return{
tdc,
ps,
specialties,
bookSpecialty
}

}

})

</script>


<style scoped>
/* its own background: a light shade of the theme's primary colour, so the
   section never merges with the white "About us" / plain sections next to it */
.specialties-section{
  background:linear-gradient(var(--amal-tint), var(--amal-tint)), var(--amal-bg);
}
.specialties-section .amal-card{
  background:var(--amal-surface) !important;
}
.specialty-card{
  height:100%;
}
.specialty-desc{
  font-size:14px;
  line-height:1.55;
}
</style>
