<template>

  <q-page  class="bg-grey-2">
    <PacienteHeader />

    <div padding>

    <!-- HERO -->
      <s-card class="q-pa-md q-mb-md shadow-3 rounded-borders">


        <div padding class="row items-center q-col-gutter-md">

          <q-avatar size="90px" color="primary" text-color="white">
            {{ paciente?.nome?.charAt(0) }}
          </q-avatar>

          <div class="col">
            <div class="text-h5 text-weight-bold">
              {{ paciente?.nome }}
            </div>

            <div class="text-grey-7">
              {{ paciente?.email }}
            </div>

            <div class="q-mt-sm">

              <q-chip :color="paciente?.estado ? 'primary' : 'secondary'" text-color="white">
                {{ paciente?.estado ? 'Ativo' : 'Inativo' }}
              </q-chip>

              <q-chip v-if="paciente?.alergia" color="negative" text-color="white">
                ⚠ Alergia
              </q-chip>

            </div>
          </div>

          <div>
            <s-btn round flat icon="edit" color="primary"   :to="{ name: 'change_paciente', params: { id: paciente.id } }"/>
            <s-btn round flat icon="event" color="secondary" @click="marcarconsulta = true"/>
            <s-btn round flat icon="delete" color="negative"/>
          </div>

        </div>

      </s-card>

      <div class="row q-col-gutter-md">

        <!-- SIDEBAR -->
        <div class="col-md-3 col-12">

          <s-card class="q-pa-md shadow-2 rounded-borders">

            <div class="text-subtitle1 q-mb-md text-weight-bold">
              {{ tdc('Indicadores')}}
            </div>

            <q-list dense>

              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ tdc('Idade') }}</q-item-label>
                  <q-item-label>{{ paciente?.idade }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>{{tdc('Sangue')}}</q-item-label>
                  <q-item-label>{{ paciente?.sangue }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ tdc('Medico') }}</q-item-label>
                  <q-item-label>{{ paciente?.medico }}</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>

          </s-card>

        </div>

        <!-- MAIN -->
        <div class="col-md-9 col-12">

          <s-card class="shadow-3 rounded-borders">

            <q-tabs v-model="tab" dense class="text-primary">
              <q-tab name="resumo" label="Resumo"/>
              <q-tab name="timeline" label="Timeline"/>
              <q-tab name="consultas" label="Consultas"/>
              <q-tab name="exames" label="Exames"/>
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>

              <!-- RESUMO -->
              <q-tab-panel name="resumo" padding>

                <div class="row q-col-gutter-md">

                  <s-card class="col-md-6 q-pa-md">
                    <div class="text-subtitle2">{{ tdc('Diagnostico') }}</div>
                    <div>{{ paciente?.diagnostico }}</div>
                  </s-card>

                  <s-card class="col-md-6 q-pa-md">
                    <div class="text-subtitle2">{{ tdc('Observacoes') }}</div>
                    <div>{{ paciente?.obs }}</div>
                  </s-card>

                </div>

              </q-tab-panel>

              <!-- TIMELINE -->
              <q-tab-panel name="timeline">

                <q-timeline color="primary">

                  <q-timeline-entry
                    v-for="item in store.timeline"
                    :key="item.id"
                    :title="item.titulo"
                    :subtitle="item.data"
                  >
                    {{ item.descricao }}
                  </q-timeline-entry>

                </q-timeline>

              </q-tab-panel>

              <!-- CONSULTAS -->
              <q-tab-panel name="consultas">

                <q-table
                  :rows="store.consultas"
                  :columns="columns"
                  row-key="id"
                  flat
                />

              </q-tab-panel>

              <!-- EXAMES -->
              <q-tab-panel name="exames">

                <q-list bordered>

                  <q-item v-for="exame in store.exames" :key="exame.id">
                    <q-item-section>
                      <q-item-label>{{ exame.nome }}</q-item-label>
                      <q-item-label caption>{{ exame.data }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <s-btn flat icon="download"/>
                    </q-item-section>
                  </q-item>

                </q-list>

              </q-tab-panel>

            </q-tab-panels>

          </s-card>

        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PacienteStore } from './pacienteStore'
import  PacienteHeader from './PacienteHeader.vue'

import { tdc } from 'quasar_resaas' // ✅ IMPORT DO TDC

const store = PacienteStore()

const tab = ref('resumo')
const marcarconsulta = ref(false)
const paciente = computed(() => store.actual)

const columns = [
  { name: 'data', label: 'Data', field: 'data' },
  { name: 'medico', label: 'Médico', field: 'medico' },
  { name: 'status', label: 'Status', field: 'status' }
]

onMounted(async () => {
  await store.loadMock()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
