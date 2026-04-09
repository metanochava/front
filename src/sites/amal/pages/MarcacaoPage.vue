<template>
  <section
    id="marcacao"
    class="marcacao-section q-py-xl"
  >

    <!-- TITULO -->
    <div class="row justify-center q-mb-xl">

      <div
        class="text-weight-bold text-primary text-center col-12"
        :style="{ fontSize: ps?.typography?.font_size_h1 + 'px' }"
      >
        {{ tdc('Marcar Consulta') }}
      </div>

    </div>


    <!-- FORM -->
    <div class="row justify-center">

      <div class="col-md-6 col-12">

        <s-card class="marcacao-card">

          <q-card-section>

            <q-form @submit.prevent="submit">

              <div class="row q-col-gutter-md">

                <!-- NOME -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.name"
                    outlined
                    label="Nome"
                    :rules="[v => !!v || 'Informe o nome']"
                  />
                </div>

                <!-- TELEFONE -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.phone"
                    outlined
                    label="Telefone"
                    mask="+258 ## ### ####"
                    :rules="[v => !!v || 'Informe o telefone']"
                  />
                </div>

                <!-- MEDICO -->
                <div class="col-md-6 col-12">
                  <q-select
                    v-model="form.doctor"
                    outlined
                    label="Médico"
                    :options="doctors"
                    option-label="name"
                    option-value="id"
                    emit-value
                    map-options
                    @update:model-value="loadSchedule"
                    :rules="[v => !!v || 'Selecione o médico']"
                  />
                </div>

                <!-- ESPECIALIDADE -->
                <div class="col-md-6 col-12">
                  <q-select
                    v-model="form.specialty"
                    outlined
                    label="Especialidade"
                    :options="selectedDoctorSpecialties"
                    :disable="!form.doctor"
                  />
                </div>

                <!-- DATA -->
                <div class="col-md-6 col-12">
                  <q-input
                    v-model="form.date"
                    outlined
                    label="Data"
                    readonly
                    :rules="[v => !!v || 'Selecione a data']"
                  >
                    <template #append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy>
                          <q-date
                            v-model="form.date"
                            mask="YYYY-MM-DD"
                            @update:model-value="loadSchedule"
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
                    label="Horário"
                    readonly
                    :rules="[v => !!v || 'Selecione o horário']"
                  />
                </div>

                <!-- HORARIOS DISPONIVEIS -->
                <div class="col-12">

                  <div class="text-subtitle2 q-mb-sm">
                    Horários disponíveis
                  </div>

                  <div class="row q-gutter-sm">

                    <q-btn
                      v-for="slot in slots"
                      :key="slot.time"
                      size="sm"
                      :color="slot.booked ? 'grey-4' : 'primary'"
                      :outline="form.time !== slot.time"
                      :disable="slot.booked"
                      :label="slot.time"
                      @click="selectTime(slot)"
                    />

                  </div>

                </div>

                <!-- BOTAO -->
                <div class="col-12 text-center q-mt-md">

                  <q-btn
                    type="submit"
                    color="primary"
                    icon="event"
                    label="Confirmar Consulta"
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
import { defineComponent, reactive, computed, ref } from "vue"
import { tdc,useUserStore } from "quasar_resaas"
import axios from "axios"
import { Notify } from "quasar"

export default defineComponent({

  setup () {

    const User =useUserStore()
    const ps = computed(() => User.ps || {})

    const loading = ref(false)

    const form = reactive({
      name: "",
      phone: "",
      doctor: null,
      specialty: "",
      date: "",
      time: ""
    })

    const doctors = ref([
      {
        id: 1,
        name: "Dr João",
        specialties: ["Cardiologia", "Clínica Geral"]
      },
      {
        id: 2,
        name: "Dra Maria",
        specialties: ["Dermatologia"]
      }
    ])

    const slots = ref([])

    const selectedDoctorSpecialties = computed(() => {
      const doctor = doctors.value.find(d => d.id === form.doctor)
      return doctor ? doctor.specialties : []
    })


    async function loadSchedule () {

      if (!form.doctor || !form.date) return

      try {

        const response = await axios.get("/api/appointments/availability/", {
          params: {
            doctor_id: form.doctor,
            date: form.date
          }
        })

        slots.value = response.data

      } catch {

        slots.value = [
          { time: "09:00", booked: false },
          { time: "10:00", booked: true },
          { time: "11:00", booked: false }
        ]

      }

    }


    function selectTime (slot) {

      if (!slot.booked) {
        form.time = slot.time
      }

    }


    async function submit () {

      loading.value = true

      try {

        await axios.post("/api/appointments/", form)

        Notify.create({
          type: "positive",
          message: "Consulta marcada com sucesso"
        })

      } catch {

        Notify.create({
          type: "negative",
          message: "Erro ao marcar consulta"
        })

      } finally {

        loading.value = false

      }

    }


    return {
      tdc,
      ps,
      form,
      doctors,
      slots,
      loading,
      selectedDoctorSpecialties,
      loadSchedule,
      selectTime,
      submit
    }

  }

})
</script>


<style scoped>

.marcacao-section {

  background:
  linear-gradient(
    135deg,
    #c3ddf7,
    #94d5c6
  );

  padding-top: 120px;
  padding-bottom: 90px;

}


.marcacao-card {

  border-radius: 20px;

  box-shadow:
  0 10px 25px rgba(0,0,0,.15);

}

</style>
