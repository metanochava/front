<template>
  <section
    id="marcacao"
    class="marcacao-section amal-section"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl amal-on-light">

      <div class="text-center col-12">
        <h2 class="amal-title" :style="ps?.typography?.font_size_h1 ? { fontSize: ps.typography.font_size_h1 + 'px' } : null">
          {{ tdc('Book appointment') }}
        </h2>
      </div>

    </div>


    <!-- FORM -->
    <div class="row justify-center">

      <div class="col-md-6 col-12">

        <s-card class="amal-card marcacao-card">

          <q-card-section>

            <q-form ref="formRef" data-test="booking-form" @submit.prevent="submit">

              <div v-if="doctorsError" class="text-negative q-mb-md" data-test="booking-unavailable">
                {{ tdc('Online booking is not available at the moment. Please call us to book.') }}
              </div>


              <div class="row q-col-gutter-md">

                <!-- NOME -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.name"
                    outlined
                    :label="tdc('Name')"
                    :rules="[v => !!v || tdc('Enter the name')]"
                  />
                </div>

                <!-- TELEFONE -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.phone"
                    outlined
                    :label="tdc('Phone')"
                    mask="+258 ## ### ####"
                    :rules="[v => !!v || tdc('Enter the phone number')]"
                  />
                </div>

                <!-- ESPECIALIDADE (first) and MEDICO: each filters the other, so
                     the visitor can start by either one -->
                <div class="col-md-6 col-12">
                  <q-select
                    v-model="form.specialty"
                    outlined
                    clearable
                    :label="tdc('Specialty')"
                    :options="specialtyOptions"
                    option-label="title"
                    option-value="id"
                    emit-value
                    map-options
                    :disable="!doctors.length"
                    data-test="booking-specialty"
                    @update:model-value="onSpecialtyChange"
                  />
                </div>

                <div class="col-md-6 col-12">
                  <q-select
                    v-model="form.doctor"
                    outlined
                    clearable
                    :label="tdc('Doctor')"
                    :options="doctorOptions"
                    option-label="name"
                    option-value="id"
                    emit-value
                    map-options
                    :disable="!doctors.length"
                    :hint="form.specialty ? tdc('Doctors of the chosen specialty') : ''"
                    :rules="[v => !!v || tdc('Select the doctor')]"
                    data-test="booking-doctor"
                    @update:model-value="onDoctorChange"
                  >
                    <template #option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <q-avatar size="32px" color="primary" text-color="white">
                            <img v-if="scope.opt.photo" :src="scope.opt.photo" alt="">
                            <span v-else>{{ scope.opt.name.charAt(0) }}</span>
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.name }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.specialties.map(item => item.title).join(', ') }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <!-- DATA -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.date"
                    outlined
                    :label="tdc('Date')"
                    readonly
                    :rules="[v => !!v || tdc('Select the date')]"
                  >
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="form.date"
                            mask="YYYY-MM-DD"
                            :options="notInThePast"
                            @update:model-value="onDateChange"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <!-- HORARIO -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.time"
                    outlined
                    :label="tdc('Time')"
                    readonly
                    :hint="tdc('Choose one of the available times below.')"
                    :rules="[v => !!v || tdc('Select the time')]"
                    data-test="booking-time"
                  >
                    <template #append>
                      <q-icon name="schedule" />
                    </template>
                  </q-input>
                </div>

                <!-- MOTIVO -->
                <div class="col-12">
                  <q-input
                    v-model="form.reason"
                    outlined
                    type="textarea"
                    autogrow
                    maxlength="1000"
                    :label="tdc('Reason for the appointment (optional)')"
                  />
                  <!-- honeypot: hidden from people, bots fill it in (the server ignores those) -->
                  <input
                    v-model="form.website"
                    type="text"
                    name="website"
                    tabindex="-1"
                    autocomplete="off"
                    aria-hidden="true"
                    class="booking-honeypot"
                  >
                </div>

                <!-- HORARIOS DISPONIVEIS -->
                <div class="col-12">

                  <div class="text-subtitle2 q-mb-sm">
                    {{ tdc('Available times') }}
                  </div>

                  <div v-if="!form.doctor || !form.date" class="text-caption text-grey-7" data-test="booking-slots-hint">
                    {{ tdc('Choose a doctor and a date to see the available times.') }}
                  </div>

                  <div v-else-if="slotsLoading" class="row items-center text-caption text-grey-7">
                    <q-spinner size="18px" class="q-mr-sm" />
                    {{ tdc('Loading the available times...') }}
                  </div>

                  <div v-else-if="slotsError" class="text-caption text-negative" data-test="booking-slots-error">
                    {{ tdc('The available times could not be loaded. Please call us to book.') }}
                  </div>

                  <div v-else-if="!slots.length" class="text-caption text-grey-7" data-test="booking-slots-empty">
                    {{ tdc('No times available on this day. Choose another date.') }}
                  </div>

                  <div v-else class="row q-gutter-sm" data-test="booking-slots">
                    <s-btn
                      v-for="slot in slots"
                      :key="slot.time"
                      size="sm"
                      no-caps
                      :unelevated="form.time === slot.time"
                      :color="slot.booked ? 'grey-5' : 'primary'"
                      :outline="!slot.booked && form.time !== slot.time"
                      :disable="slot.booked"
                      :label="slot.time"
                      :aria-pressed="form.time === slot.time"
                      @click="selectTime(slot)"
                    />
                  </div>

                </div>

                <!-- BOTAO -->
                <div class="col-12 text-center q-mt-md">

                  <div v-if="bookingError" class="text-negative q-mb-sm" data-test="booking-error">
                    {{ tdc('The appointment could not be booked. Please call us to book.') }}
                  </div>

                  <q-btn
                    type="submit"
                    color="primary"
                    icon="event"
                    :label="tdc('Confirm appointment')"
                    :loading="loading"
                  />

                </div>

              </div>

            </q-form>

          </q-card-section>

        </s-card>

      </div>

    </div>

  </section>
</template>


<script>
import { defineComponent, reactive, computed, ref, onMounted, watch } from "vue"
import { date as qdate } from "quasar"
import { tdc, useUserStore, HTTPClient, url, AlertSuccess, errorCode, parseFieldErrors } from "quasar_resaas"
import { usePublicBooking } from "../usePublicBooking"

export default defineComponent({

  setup () {

    const User =useUserStore()
    const ps = computed(() => User.ps || {})

    const loading = ref(false)
    const datePopup = ref(null)

    const form = reactive({
      name: "",
      phone: "",
      doctor: null,
      specialty: null,
      date: "",
      time: "",
      reason: "",
      website: ""
    })

    const formRef = ref(null)

    // doctors shared with the "Our doctors" section (usePublicBooking)
    const { state: booking, loadDoctors } = usePublicBooking()
    const doctors = computed(() => booking.doctors)
    const doctorsError = computed(() => booking.error)

    onMounted(loadDoctors)

    const slots = ref([])
    const slotsLoading = ref(false)
    const slotsError = ref(false)
    const bookingError = ref(false)

    const hasSpecialty = (doctor, specialtyId) =>
      (doctor.specialties || []).some(item => item.id === specialtyId)

    // specialties: the chosen doctor's, or every specialty of the clinic's doctors
    const specialtyOptions = computed(() => {
      const source = form.doctor ? doctors.value.filter(d => d.id === form.doctor) : doctors.value
      const byId = new Map()
      for (const doctor of source) {
        for (const specialty of doctor.specialties || []) byId.set(specialty.id, specialty)
      }
      return [...byId.values()].sort((x, y) => x.title.localeCompare(y.title))
    })

    // doctors: those of the chosen specialty, or all of them
    const doctorOptions = computed(() =>
      form.specialty ? doctors.value.filter(d => hasSpecialty(d, form.specialty)) : doctors.value
    )

    const today = qdate.formatDate(Date.now(), "YYYY/MM/DD")
    const notInThePast = (day) => day >= today

    // Only a real list of {time, booked} counts: the request used to go to
    // the site's own host, which answers any path with its index.html (200) -
    // v-for then drew one empty button per character of that page.
    function validSlots (data) {
      const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : null
      return list
        ? list.filter(slot => slot && typeof slot.time === "string")
          .map(slot => ({ time: slot.time.slice(0, 5), booked: !!slot.booked }))
        : null
    }

    async function loadSchedule () {
      slots.value = []
      slotsError.value = false
      if (!form.doctor || !form.date) return

      slotsLoading.value = true
      try {
        const response = await HTTPClient.get(
          url({ type: "u", url: "saude/publicbooking/availability/", params: { doctor: form.doctor, date: form.date } })
        )
        const list = validSlots(response.data)
        if (list === null) slotsError.value = true
        else slots.value = list
      } catch {
        // no invented times: the visitor is told to call instead
        slotsError.value = true
      } finally {
        slotsLoading.value = false
      }
    }

    // a specialty first: a doctor who does not have it is cleared
    function onSpecialtyChange () {
      const doctor = doctors.value.find(d => d.id === form.doctor)
      if (doctor && form.specialty && !hasSpecialty(doctor, form.specialty)) {
        form.doctor = null
        form.time = ""
        slots.value = []
      }
    }

    // a doctor first: keep the specialty only when the doctor has it, and fill
    // it in when the doctor has only one; the time belongs to the old doctor
    function onDoctorChange () {
      const doctor = doctors.value.find(d => d.id === form.doctor)
      const own = doctor?.specialties || []
      if (!doctor || (form.specialty && !hasSpecialty(doctor, form.specialty))) form.specialty = null
      if (doctor && !form.specialty && own.length === 1) form.specialty = own[0].id
      form.time = ""
      loadSchedule()
    }

    // "Book appointment" on a doctor card (Our doctors section)
    watch(() => booking.preselect, (choice) => {
      if (!choice) return
      form.doctor = choice.doctor
      form.specialty = choice.specialty
      booking.preselect = null
      onDoctorChange()
    })

    function onDateChange () {
      form.time = ""
      datePopup.value?.hide()
      loadSchedule()
    }

    function selectTime (slot) {
      if (!slot.booked) {
        form.time = slot.time
      }
    }

    async function submit () {
      // only a time offered for this doctor and day can be booked
      if (!slots.value.some(slot => slot.time === form.time && !slot.booked)) {
        form.time = ""
        return
      }

      loading.value = true
      bookingError.value = false

      try {
        // POST saude/publicbooking/requests/: holds the slot; the clinic calls
        // to confirm (the request becomes an appointment when staff confirm it)
        const response = await HTTPClient.post(
          url({ type: "u", url: "saude/publicbooking/requests/" }),
          { ...form, specialty: form.specialty || "", website: form.website || "" }
        )

        // an HTML page is not a confirmation: only the API's own answer is
        if (!response?.data?.received) throw new Error("not an API response")

        AlertSuccess(tdc("Your request was received. We will call you to confirm the appointment."))
        Object.assign(form, { name: "", phone: "", doctor: null, specialty: null, date: "", time: "", reason: "", website: "" })
        slots.value = []
        formRef.value?.resetValidation()
      } catch (error) {
        // the API client already shows the message it received
        if (errorCode(error) === "slot_unavailable") {
          // someone took it meanwhile: show the times as they are now
          form.time = ""
          loadSchedule()
        } else {
          const fields = parseFieldErrors(error?.response?.data)
          if (!Object.keys(fields).length) bookingError.value = true
        }
      } finally {
        loading.value = false
      }
    }

    return {
      tdc,
      ps,
      form,
      doctors,
      doctorsError,
      formRef,
      slots,
      slotsLoading,
      slotsError,
      bookingError,
      loading,
      datePopup,
      specialtyOptions,
      doctorOptions,
      onSpecialtyChange,
      notInThePast,
      onDoctorChange,
      onDateChange,
      selectTime,
      submit
    }

  }

})
</script>


<style scoped>

.booking-honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.marcacao-card {
  padding: 8px;
}

</style>
