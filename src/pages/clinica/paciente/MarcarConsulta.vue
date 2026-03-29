<template>
  <q-card style="min-width: 500px">
    <!-- HEADER -->
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Marcar Consulta</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <!-- FORM -->
    <q-card-section>
      <q-form @submit="submit">

        <div class="row q-col-gutter-md">

          <!-- DATA -->
          <div class="col-6">
            <q-input
              v-model="form.data"
              label="Data"
              type="date"
              outlined
              dense
              required
            />
          </div>

          <!-- HORA -->
          <div class="col-6">
            <q-input
              v-model="form.hora"
              label="Hora"
              type="time"
              outlined
              dense
              required
            />
          </div>

          <!-- MÉDICO -->
          <div class="col-12">
            <q-input
              v-model="form.medico"
              label="Médico"
              outlined
              dense
            />
          </div>

          <!-- TIPO -->
          <div class="col-12">
            <q-select
              v-model="form.tipo"
              :options="tipos"
              label="Tipo de Consulta"
              outlined
              dense
            />
          </div>

          <!-- OBS -->
          <div class="col-12">
            <q-input
              v-model="form.obs"
              label="Observações"
              type="textarea"
              outlined
              dense
            />
          </div>

        </div>

      </q-form>
    </q-card-section>

    <q-separator />

    <!-- ACTIONS -->
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" v-close-popup />
      <q-btn
        color="primary"
        label="Marcar"
        :loading="loading"
        @click="submit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { PacienteStore } from './pacienteStore'

const props = defineProps({
  pacienteId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success'])

const paciente = PacienteStore()

const loading = ref(false)

const form = ref({
  data: '',
  hora: '',
  medico: '',
  tipo: 'Normal',
  obs: ''
})

const tipos = ['Normal', 'Urgente', 'Retorno']

// 🔥 SUBMIT
const submit = async () => {
  if (!form.value.data || !form.value.hora) return

  loading.value = true

  try {
    await paciente.marcarConsulta({
      paciente: props.pacienteId,
      ...form.value
    })

    emit('success')

  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
