<template>
  <section
    id="medicos"
    class="medicos-section q-py-xl"
  >

    <!-- TÍTULO -->
    <div class="row justify-center q-mb-lg">

      <div
        class="text-weight-bold text-primary text-center col-12"
        :style="{ fontSize: ps?.typography?.font_size_h1 + 'px' }"
      >
        {{ tdc('Our doctors') }}
      </div>

      <div
        class="text-center col-12 text-white q-mt-sm"
        :style="{ fontSize: ps?.typography?.font_size_body + 'px' }"
      >
        {{ tdc('Qualified specialists with availability for booking') }}
      </div>

    </div>


    <!-- LISTA HORIZONTAL -->
    <div class="doctor-scroll-wrapper">

      <div class="doctor-scroll row no-wrap q-gutter-lg">

        <div
          v-for="doctor in doctors"
          :key="doctor.id"
          class="doctor-card-col"
        >

          <s-card class="doctor-card">

            <q-card-section class="text-center">

              <div
                class="doctor-photo-wrapper"
                @mousemove="tilt($event)"
                @mouseleave="resetTilt"
              >
                <q-avatar
                  size="110px"
                  class="doctor-avatar"
                >
                  <img :src="doctor.photo">
                </q-avatar>
              </div>

              <div class="text-h6 q-mt-md text-weight-bold">
                {{ doctor.name }}
              </div>

              <div class="q-mt-xs q-mb-sm">

                <q-chip
                  v-for="specialty in doctor.specialties"
                  :key="specialty"
                  dense
                  color="white"
                  text-color="primary"
                  class="q-ma-xs"
                >
                  {{ tdc(specialty) }}
                </q-chip>

              </div>

              <div class="stars q-mb-md">

                <q-icon
                  v-for="n in 5"
                  :key="n"
                  name="star"
                  size="18px"
                  :color="n <= doctor.rating ? 'amber' : 'grey-4'"
                />

              </div>

              <div class="row justify-center q-gutter-sm">

                <s-btn
                  color="primary"
                  icon="event"
                  :label="tdc('Book appointment')"
                  @click="openBookingModal(doctor)"
                  unelevated
                />

                <s-btn
                  color="white"
                  text-color="primary"
                  icon="visibility"
                  :label="tdc('View profile')"
                  @click="openProfileModal(doctor)"
                  outline
                />

              </div>

            </q-card-section>

          </s-card>

        </div>

      </div>

    </div>



    <!-- MODAL PERFIL -->
    <q-dialog
      v-model="profileModal"
      transition-show="scale"
      transition-hide="scale"
      maximized-on-mobile
    >

      <s-modal-card :title="selectedDoctor.name" width="900px" class="doctor-modal profile-modal">

        <div>

          <div class="row q-col-gutter-xl items-start">

            <div class="col-md-4 col-12 text-center">

              <div class="profile-photo-wrap">
                <q-avatar size="130px" class="profile-avatar">
                  <img :src="selectedDoctor.photo">
                </q-avatar>
              </div>

              <div class="text-h5 text-weight-bold q-mt-md">
                {{ selectedDoctor.name }}
              </div>

              <div class="text-grey-7 q-mt-xs">
                {{ selectedDoctor.specialties?.map(item => tdc(item)).join(' • ') }}
              </div>

              <div class="stars q-mt-md justify-center">

                <q-icon
                  v-for="n in 5"
                  :key="n"
                  name="star"
                  size="20px"
                  :color="n <= (selectedDoctor.rating || 0) ? 'amber' : 'grey-4'"
                />

              </div>

            </div>


            <div class="col-md-8 col-12">

              <div class="row q-col-gutter-md">

                <div class="col-md-6 col-12">
                  <div class="info-box">
                    <div class="info-label">{{ tdc('Age') }}</div>
                    <div class="info-value">{{ selectedDoctor.age }}</div>
                  </div>
                </div>

                <div class="col-md-6 col-12">
                  <div class="info-box">
                    <div class="info-label">{{ tdc('Experience') }}</div>
                    <div class="info-value">{{ tdc(selectedDoctor.experience) }}</div>
                  </div>
                </div>

                <div class="col-md-6 col-12">
                  <div class="info-box">
                    <div class="info-label">{{ tdc('Phone') }}</div>
                    <div class="info-value">{{ selectedDoctor.phone }}</div>
                  </div>
                </div>

                <div class="col-md-6 col-12">
                  <div class="info-box">
                    <div class="info-label">{{ tdc('Email') }}</div>
                    <div class="info-value">{{ selectedDoctor.email }}</div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="info-box">
                    <div class="info-label">{{ tdc('Qualifications') }}</div>

                    <ul class="education-list">
                      <li
                        v-for="(education, index) in selectedDoctor.educations || []"
                        :key="index"
                      >
                        {{ tdc(education) }}
                      </li>
                    </ul>

                  </div>
                </div>

                <div class="col-12">
                  <div class="info-box">
                    <div class="info-label">{{ tdc('About the doctor') }}</div>
                    <div class="info-value">
                      {{ tdc(selectedDoctor.bio) }}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>


        <template #footer>
          <s-btn
            color="primary"
            icon="event"
            :label="tdc('Book appointment')"
            @click="switchToBooking"
            unelevated
          />
          <q-btn
            flat
            color="grey-7"
            :label="tdc('Close')"
            v-close-popup
          />
        </template>

      </s-modal-card>

    </q-dialog>



    <!-- MODAL MARCAR CONSULTA -->
    <q-dialog
      v-model="bookingModal"
      transition-show="scale"
      transition-hide="scale"
      maximized-on-mobile
    >

      <s-modal-card :title="tdc('Book appointment')" width="820px" class="doctor-modal booking-modal">

        <div>

          <div class="text-h5 text-weight-bold text-center">
            {{ tdc('Book appointment') }}
          </div>

          <div class="text-center text-grey-7 q-mt-sm">
            {{ selectedDoctor.name }} • {{ selectedDoctor.specialties?.map(item => tdc(item)).join(' • ') }}
          </div>

        </div>


        <div>

          <q-form @submit.prevent="bookConsultation">

            <div class="row q-col-gutter-md">

              <div class="col-md-6 col-12">
                <q-input
                  v-model="bookingForm.patient_name"
                  outlined
                  :label="tdc('Patient name')"
                  :rules="[v => !!v || tdc('Enter the name')]"
                />
              </div>

              <div class="col-md-6 col-12">
                <q-input
                  v-model="bookingForm.patient_phone"
                  outlined
                  :label="tdc('Phone')"
                  mask="+258 ## ### ####"
                  :rules="[v => !!v || tdc('Enter the phone number')]"
                />
              </div>

              <div class="col-md-6 col-12">
                <q-input
                  v-model="bookingForm.patient_email"
                  outlined
                  type="email"
                  :label="tdc('Email')"
                />
              </div>

              <div class="col-md-6 col-12">
                <q-select
                  v-model="bookingForm.specialty"
                  outlined
                  :label="tdc('Specialty')"
                  :options="(selectedDoctor.specialties || []).map(item => tdc(item))"
                  :rules="[v => !!v || tdc('Select the specialty')]"
                />
              </div>

              <div class="col-md-6 col-12">
                <q-input
                  v-model="bookingForm.date"
                  outlined
                  :label="tdc('Date')"
                  readonly
                  :rules="[v => !!v || 'Selecione a data']"
                >
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="bookingForm.date"
                          mask="YYYY-MM-DD"
                          :options="allowedDates"
                          @update:model-value="loadScheduleForDate"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-md-6 col-12">
                <q-input
                  v-model="bookingForm.time"
                  outlined
                  :label="tdc('Selected time')"
                  readonly
                  :rules="[v => !!v || tdc('Select the time')]"
                />
              </div>

              <div class="col-12">
                <div class="text-subtitle1 text-weight-medium q-mb-sm">
                  {{ tdc('Available times') }}
                </div>

                <div class="row q-gutter-sm">

                  <q-btn
                    v-for="slot in availableSlots"
                    :key="slot.time"
                    size="sm"
                    :outline="bookingForm.time !== slot.time"
                    :unelevated="bookingForm.time === slot.time"
                    :disable="slot.booked"
                    :color="slot.booked ? 'grey-5' : 'primary'"
                    :label="slot.booked ? `${slot.time} • Ocupado` : slot.time"
                    @click="selectTime(slot)"
                  />

                </div>
              </div>

              <div class="col-12">
                <q-input
                  v-model="bookingForm.notes"
                  outlined
                  type="textarea"
                  :label="tdc('Notes')"
                  autogrow
                />
              </div>

            </div>

          </q-form>

        </div>


        <template #footer>
          <s-btn
            color="primary"
            icon="event"
            :label="tdc('Confirm appointment')"
            :loading="bookingLoading"
            @click="bookConsultation"
            unelevated
          />
          <q-btn
            flat
            color="grey-7"
            :label="tdc('Close')"
            v-close-popup
          />
        </template>

      </s-modal-card>

    </q-dialog>

  </section>
</template>

<script>
import { defineComponent, computed, ref } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import axios from "axios"
import { Notify } from "quasar"

export default defineComponent({

  setup () {

    const User =useUserStore()
    const ps = computed(() => User.ps || {})

    const profileModal = ref(false)
    const bookingModal = ref(false)
    const bookingLoading = ref(false)

    const selectedDoctor = ref({
      specialties: [],
      educations: []
    })

    const availableSlots = ref([])

    const bookingForm = ref({
      doctor_id: null,
      specialty: "",
      patient_name: "",
      patient_phone: "",
      patient_email: "",
      date: "",
      time: "",
      notes: ""
    })

    const doctors = [
      {
        id: 1,
        name: "Dr. João Silva",
        specialties: ['Cardiology', 'General practice'],
        rating: 5,
        age: 45,
        experience: '20 years',
        educations: [
          'Degree in Medicine — UEM',
          'Specialisation in Cardiology — University of Lisbon'
        ],
        phone: "+258 84 111 0001",
        email: "joao.silva@clinicaamal.co.mz",
        bio: 'Specialist in cardiovascular disease, prevention and long-term clinical follow-up.',
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        id: 2,
        name: "Dra. Maria Costa",
        specialties: ["Dermatologia", 'Medical aesthetics'],
        rating: 5,
        age: 39,
        experience: '15 years',
        educations: [
          'Degree in Medicine — University of Coimbra',
          'Specialisation in Dermatology — University of Porto'
        ],
        phone: "+258 84 111 0002",
        email: "maria.costa@clinicaamal.co.mz",
        bio: 'Works in the diagnosis and treatment of skin, hair and nail conditions, with a humane approach.',
        photo: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        id: 3,
        name: "Dr. Paulo Mendes",
        specialties: ["Pediatria", "Neonatologia"],
        rating: 5,
        age: 50,
        experience: '25 years',
        educations: [
          'Degree in Medicine — University of Coimbra',
          'Specialisation in Paediatrics — NOVA University of Lisbon'
        ],
        phone: "+258 84 111 0003",
        email: "paulo.mendes@clinicaamal.co.mz",
        bio: 'Paediatrician with wide experience in monitoring children\'s growth and development.',
        photo: "https://randomuser.me/api/portraits/men/45.jpg"
      },
      {
        id: 4,
        name: "Dra. Ana Jorge",
        specialties: ["Ginecologia", 'Obstetrics'],
        rating: 4,
        age: 42,
        experience: '17 years',
        educations: [
          'Degree in Medicine — UEM',
          'Specialisation in Gynaecology and Obstetrics — University of Pretoria'
        ],
        phone: "+258 84 111 0004",
        email: "ana.jorge@clinicaamal.co.mz",
        bio: 'Looks after women\'s health at every stage, including pregnancy, childbirth and the postpartum period.',
        photo: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      {
        id: 5,
        name: "Dr. Carlos Alberto",
        specialties: ["Ortopedia", "Traumatologia"],
        rating: 5,
        age: 47,
        experience: '19 years',
        educations: [
          "Degree in Medicine — Agostinho Neto University",
          'Specialisation in Orthopaedics — University of São Paulo'
        ],
        phone: "+258 84 111 0005",
        email: "carlos.alberto@clinicaamal.co.mz",
        bio: 'Specialist in muscle, joint and bone injuries, focused on functional recovery.',
        photo: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      {
        id: 6,
        name: "Dra. Beatriz Mucavele",
        specialties: ["Neurologia", "Neurofisiologia"],
        rating: 4,
        age: 41,
        experience: '14 years',
        educations: [
          'Degree in Medicine — UEM',
          'Specialisation in Neurology — University of Cape Town'
        ],
        phone: "+258 84 111 0006",
        email: "beatriz.mucavele@clinicaamal.co.mz",
        bio: 'Assesses and treats nervous system disorders with a focus on accurate diagnosis and continuous follow-up.',
        photo: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      {
        id: 7,
        name: "Dr. Eduardo Matola",
        specialties: ["Oftalmologia", "Cirurgia Ocular"],
        rating: 5,
        age: 44,
        experience: '16 years',
        educations: [
          "Degree in Medicine — University of Porto",
          'Specialisation in Ophthalmology — University of Barcelona'
        ],
        phone: "+258 84 111 0007",
        email: "eduardo.matola@clinicaamal.co.mz",
        bio: 'Works in the prevention, diagnosis and surgery of eye diseases, with personalised follow-up.',
        photo: "https://randomuser.me/api/portraits/men/60.jpg"
      },
      {
        id: 8,
        name: "Dra. Lúcia Banze",
        specialties: ['Clinical psychology', "Psicoterapia"],
        rating: 5,
        age: 36,
        experience: '11 years',
        educations: [
          'Degree in Psychology — Pedagogical University',
          'Training in Cognitive-Behavioural Psychotherapy'
        ],
        phone: "+258 84 111 0008",
        email: "lucia.banze@clinicaamal.co.mz",
        bio: 'Specialist in mental health, emotional support and individual psychotherapy.',
        photo: "https://randomuser.me/api/portraits/women/72.jpg"
      },
      {
        id: 9,
        name: "Dr. Samuel Mussá",
        specialties: ['General practice', "Medicina Interna"],
        rating: 4,
        age: 48,
        experience: '22 years',
        educations: [
          'Degree in Medicine — UEM',
          'Specialisation in Internal Medicine — University of Lisbon'
        ],
        phone: "+258 84 111 0009",
        email: "samuel.mussa@clinicaamal.co.mz",
        bio: 'In charge of general consultations, clinical follow-up and diagnostic guidance in complex cases.',
        photo: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      {
        id: 10,
        name: "Dra. Helena Novela",
        specialties: ["Endocrinologia", 'Clinical nutrition'],
        rating: 5,
        age: 40,
        experience: '13 years',
        educations: [
          'Degree in Medicine — University of Coimbra',
          'Specialisation in Endocrinology — University of Lisbon'
        ],
        phone: "+258 84 111 0010",
        email: "helena.novela@clinicaamal.co.mz",
        bio: 'Follows hormonal disorders, diabetes, obesity and multidisciplinary clinical plans.',
        photo: "https://randomuser.me/api/portraits/women/50.jpg"
      }
    ]

    function openProfileModal (doctor) {
      selectedDoctor.value = doctor
      profileModal.value = true
    }

    async function openBookingModal (doctor) {
      selectedDoctor.value = doctor
      bookingForm.value.doctor_id = doctor.id
      bookingForm.value.specialty = doctor.specialties?.[0] || ""
      bookingForm.value.date = ""
      bookingForm.value.time = ""
      availableSlots.value = []
      bookingModal.value = true

      try {
        await loadDoctorAvailability(doctor.id)
      } catch (error) {
        console.log(error)
        setFallbackSlots()
      }
    }

    function switchToBooking () {
      profileModal.value = false
      openBookingModal(selectedDoctor.value)
    }

    function selectTime (slot) {
      if (slot.booked) {
        return
      }

      bookingForm.value.time = slot.time
    }

    function allowedDates () {
      return true
    }

    async function loadDoctorAvailability (doctorId) {
      try {
        const response = await axios.get(`/api/doctors/${doctorId}/availability/`)
        availableSlots.value = normalizeAvailability(response.data)
      } catch (error) {
        console.log(error)
        setFallbackSlots()
      }
    }

    async function loadScheduleForDate () {
      bookingForm.value.time = ""

      if (!bookingForm.value.date || !selectedDoctor.value.id) {
        return
      }

      try {
        const response = await axios.get(
          `/api/doctors/${selectedDoctor.value.id}/availability/`,
          {
            params: {
              date: bookingForm.value.date
            }
          }
        )

        availableSlots.value = normalizeAvailability(response.data)
      } catch (error) {
        console.log(error)
        setFallbackSlots()
      }
    }

    function normalizeAvailability (data) {
      if (Array.isArray(data?.slots)) {
        return data.slots.map(item => ({
          time: item.time,
          booked: !!item.booked
        }))
      }

      if (Array.isArray(data)) {
        return data.map(item => ({
          time: item.time || item,
          booked: !!item.booked
        }))
      }

      return [
        { time: "08:00", booked: false },
        { time: "09:00", booked: true },
        { time: "10:00", booked: false },
        { time: "11:30", booked: false },
        { time: "14:00", booked: true },
        { time: "15:30", booked: false }
      ]
    }

    function setFallbackSlots () {
      availableSlots.value = [
        { time: "08:00", booked: false },
        { time: "09:00", booked: true },
        { time: "10:00", booked: false },
        { time: "11:30", booked: false },
        { time: "14:00", booked: true },
        { time: "15:30", booked: false }
      ]
    }

    async function bookConsultation () {
      if (
        !bookingForm.value.patient_name ||
        !bookingForm.value.patient_phone ||
        !bookingForm.value.specialty ||
        !bookingForm.value.date ||
        !bookingForm.value.time
      ) {
        Notify.create({
          type: "warning",
          message: 'Fill in the required fields and select a time.'
        })
        return
      }

      bookingLoading.value = true

      try {
        await axios.post("/api/appointments/", {
          doctor_id: bookingForm.value.doctor_id,
          specialty: bookingForm.value.specialty,
          patient_name: bookingForm.value.patient_name,
          patient_phone: bookingForm.value.patient_phone,
          patient_email: bookingForm.value.patient_email,
          date: bookingForm.value.date,
          time: bookingForm.value.time,
          notes: bookingForm.value.notes
        })

        Notify.create({
          type: "positive",
          message: 'Appointment booked successfully.'
        })

        bookingModal.value = false

        bookingForm.value = {
          doctor_id: null,
          specialty: "",
          patient_name: "",
          patient_phone: "",
          patient_email: "",
          date: "",
          time: "",
          notes: ""
        }

        availableSlots.value = []
      } catch (error) {
        console.log(error)
        Notify.create({
          type: "negative",
          message: 'The appointment could not be booked.'
        })
      } finally {
        bookingLoading.value = false
      }
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
      User,
      ps,
      tdc,
      doctors,
      profileModal,
      bookingModal,
      selectedDoctor,
      bookingForm,
      availableSlots,
      bookingLoading,
      openProfileModal,
      openBookingModal,
      switchToBooking,
      selectTime,
      allowedDates,
      loadScheduleForDate,
      bookConsultation,
      tilt,
      resetTilt
    }

  }

})
</script>

<style scoped>

.medicos-section {
  padding-top: 80px;
  padding-bottom: 80px;
  background: linear-gradient(135deg, #43CEA2, #185A9D);
  border-top: 6px solid var(--q-primary);
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

.doctor-card {
  border-radius: 24px;
  background: rgba(255,255,255,.12);
  backdrop-filter: blur(12px);
  color: white;
  box-shadow: 0 12px 30px rgba(0,0,0,.18);
  transition: all .35s ease;
}

.doctor-card:hover {
  transform: translateY(-8px);
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
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 60px rgba(0,0,0,.22);
}

.modal-top-gradient {
  height: 8px;
  width: 100%;
  background: linear-gradient(90deg, #43CEA2, #185A9D);
}

.profile-modal .profile-photo-wrap {
  display: inline-block;
  padding: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(67,206,162,.18), rgba(24,90,157,.18));
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
