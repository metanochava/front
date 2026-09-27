<template>
  <section
    id="medicos"
    class="medicos-section amal-section amal-section--brand"
  >

    <!-- TÍTULO -->
    <div class="row justify-center q-mb-lg">

      <div class="text-center col-12">
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Our doctors') }}
        </h2>
        <p class="amal-subtitle">
          {{ tdc('Qualified specialists with availability for booking') }}
        </p>
      </div>

    </div>


    <!-- the clinic's doctors (GET saude/publicbooking/doctors/, usePublicBooking) -->
    <div v-if="booking.loading && !doctors.length" class="row justify-center q-pa-lg">
      <q-spinner color="white" size="40px" />
    </div>

    <div v-else-if="booking.error || !doctors.length" class="text-center text-white q-pa-lg" data-test="doctors-empty">
      {{ tdc('Our doctors will be shown here soon. Please call us to book.') }}
    </div>

    <!-- LISTA HORIZONTAL -->
    <div v-else class="doctor-scroll-wrapper" data-test="doctors-list">

      <div class="doctor-scroll row no-wrap q-gutter-lg">

        <div
          v-for="doctor in doctors"
          :key="doctor.id"
          class="doctor-card-col"
        >

          <s-card class="amal-card doctor-card">

            <q-card-section class="text-center">

              <div
                class="doctor-photo-wrapper"
                @mousemove="tilt($event)"
                @mouseleave="resetTilt"
              >
                <q-avatar
                  size="110px"
                  class="doctor-avatar"
                  color="white"
                  text-color="primary"
                >
                  <img v-if="doctor.photo" :src="doctor.photo" :alt="doctor.name">
                  <span v-else class="doctor-initials">{{ initials(doctor.name) }}</span>
                </q-avatar>
              </div>

              <div class="text-h6 q-mt-md text-weight-bold">
                {{ doctor.name }}
              </div>

              <div class="q-mt-xs q-mb-md">
                <q-chip
                  v-for="specialty in doctor.specialties"
                  :key="specialty.id"
                  dense
                  color="white"
                  text-color="primary"
                  class="q-ma-xs"
                >
                  {{ tdc(specialty.title) }}
                </q-chip>
              </div>

              <div class="row justify-center q-gutter-sm">

                <s-btn
                  color="primary"
                  icon="event"
                  no-caps
                  :label="tdc('Book appointment')"
                  unelevated
                  data-test="doctor-book"
                  @click="bookWith(doctor)"
                />

                <s-btn
                  color="white"
                  text-color="primary"
                  icon="visibility"
                  no-caps
                  :label="tdc('View profile')"
                  unelevated
                  @click="openProfileModal(doctor)"
                />

              </div>

            </q-card-section>

          </s-card>

        </div>

      </div>

    </div>


    <!-- MODAL PERFIL: only what the clinic records about the doctor -->
    <q-dialog
      v-model="profileModal"
      transition-show="scale"
      transition-hide="scale"
    >

      <s-modal-card :title="selectedDoctor.name" icon="badge" width="520px" class="doctor-modal profile-modal">

        <div class="text-center q-pa-md">

          <div class="profile-photo-wrap">
            <q-avatar size="130px" class="profile-avatar" color="primary" text-color="white">
              <img v-if="selectedDoctor.photo" :src="selectedDoctor.photo" :alt="selectedDoctor.name">
              <span v-else class="doctor-initials">{{ initials(selectedDoctor.name) }}</span>
            </q-avatar>
          </div>

          <div class="text-h5 text-weight-bold q-mt-md">
            {{ selectedDoctor.name }}
          </div>

          <div class="q-mt-sm">
            <q-chip
              v-for="specialty in selectedDoctor.specialties || []"
              :key="specialty.id"
              color="primary"
              text-color="white"
              class="q-ma-xs"
            >
              {{ tdc(specialty.title) }}
            </q-chip>
          </div>

          <div class="text-grey-7 q-mt-md">
            {{ tdc('Book a consultation online and the clinic will call you to confirm.') }}
          </div>

        </div>

        <template #footer>
          <s-btn
            flat
            no-caps
            color="grey-7"
            :label="tdc('Close')"
            v-close-popup
          />
          <s-btn
            color="primary"
            icon="event"
            no-caps
            unelevated
            :label="tdc('Book appointment')"
            @click="bookFromProfile"
          />
        </template>

      </s-modal-card>

    </q-dialog>

  </section>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from "vue"
import { tdc, useUserStore } from "quasar_resaas"
import { usePublicBooking } from "../usePublicBooking"

export default defineComponent({

  setup () {

    const User = useUserStore()
    const ps = computed(() => User.ps || {})

    // the clinic's real doctors - the same list the booking form uses; a
    // booking always goes through that one form (MarcacaoPage)
    const { state: booking, loadDoctors, bookWith } = usePublicBooking()
    const doctors = computed(() => booking.doctors)

    onMounted(loadDoctors)

    const profileModal = ref(false)
    const selectedDoctor = ref({ specialties: [] })

    function openProfileModal (doctor) {
      selectedDoctor.value = doctor
      profileModal.value = true
    }

    function bookFromProfile () {
      profileModal.value = false
      bookWith(selectedDoctor.value)
    }

    function initials (name) {
      return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('') || '?'
    }

    function tilt (event) {
      const card = event.currentTarget
      const rect = card.getBoundingClientRect()

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = -(y - centerY) / 10
      const rotateY = (x - centerX) / 10

      card.style.transform =
        `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    function resetTilt (event) {
      event.currentTarget.style.transform =
        "perspective(700px) rotateX(0deg) rotateY(0deg)"
    }

    return {
      ps,
      tdc,
      booking,
      doctors,
      profileModal,
      selectedDoctor,
      openProfileModal,
      bookFromProfile,
      bookWith,
      initials,
      tilt,
      resetTilt
    }

  }

})
</script>


<style scoped>
.doctor-initials {
  font-size: 34px;
  font-weight: 800;
}


.medicos-section {
  padding-left: 0;
  padding-right: 0;
}

.doctor-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 20px 10px 20px;
  scroll-behavior: smooth;
}

.doctor-scroll-wrapper::-webkit-scrollbar {
  height: 10px;
}

.doctor-scroll-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.35);
  border-radius: 20px;
}

.doctor-scroll-wrapper::-webkit-scrollbar-track {
  background: rgba(255,255,255,.08);
  border-radius: 20px;
}

.doctor-scroll {
  min-width: max-content;
  padding-bottom: 8px;
}

.doctor-card-col {
  width: 300px;
  flex: 0 0 300px;
}

.doctor-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, .18) !important;
}

.doctor-photo-wrapper {
  display: inline-block;
  transition: transform .2s ease;
  transform-style: preserve-3d;
}

.doctor-avatar {
  border: 4px solid rgba(255,255,255,.9);
  box-shadow: 0 8px 25px rgba(0,0,0,.2);
}

.stars {
  display: flex;
  align-items: center;
  gap: 3px;
}

.doctor-modal {
  width: 92%;
  max-width: 900px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.22);
}

.modal-top-gradient {
  height: 8px;
  width: 100%;
  /* dialogs render outside .amal-site: the theme's --q-* variables directly */
  background: linear-gradient(90deg, var(--q-primary), var(--q-secondary));
}

.profile-modal .profile-photo-wrap {
  display: inline-block;
  padding: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--q-primary) 18%, transparent),
    color-mix(in srgb, var(--q-secondary) 18%, transparent));
}

.profile-avatar {
  box-shadow: 0 10px 25px rgba(0,0,0,.15);
}

.info-box {
  background: rgba(24,90,157,.05);
  border: 1px solid rgba(24,90,157,.08);
  border-radius: 18px;
  padding: 16px;
  height: 100%;
}

.info-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--q-primary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.info-value {
  color: #374151;
  line-height: 1.6;
}

.education-list {
  margin: 0;
  padding-left: 18px;
  color: #374151;
  line-height: 1.7;
}

.booking-modal {
  max-width: 820px;
}

@media (max-width: 768px) {
  .doctor-card-col {
    width: 280px;
    flex: 0 0 280px;
  }

  .doctor-modal {
    width: 96%;
    border-radius: 22px;
  }
}

</style>
