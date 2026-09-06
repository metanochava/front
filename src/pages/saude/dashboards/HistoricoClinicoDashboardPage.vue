<template>
  <q-page class="q-pa-sm">
    <s-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="history_edu" class="q-mr-xs" />
          {{ tdc('Histórico Clínico') }}
        </div>
      </q-card-section>

      <q-separator />

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner size="40px" color="primary" />
      </div>

      <template v-else>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Doenças Correntes') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.doencas_count }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Alergias') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.alergias_count }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Dados Vitais Registados') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.dados_vitais_count }}</div>
              </q-card-section>
            </s-card>
          </div>
        </q-card-section>

        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              {{ tdc('Doenças mais comuns') }}
            </div>
            <div v-if="!data.top_doencas.length" class="text-caption text-grey-6">
              {{ tdc('Sem dados') }}
            </div>
            <q-list v-else separator>
              <q-item v-for="item in data.top_doencas" :key="item.nome">
                <q-item-section>{{ item.nome }}</q-item-section>
                <q-item-section side><q-badge color="warning">{{ item.total }}</q-badge></q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              {{ tdc('Alergias mais comuns') }}
            </div>
            <div v-if="!data.top_alergias.length" class="text-caption text-grey-6">
              {{ tdc('Sem dados') }}
            </div>
            <q-list v-else separator>
              <q-item v-for="item in data.top_alergias" :key="item.nome">
                <q-item-section>{{ item.nome }}</q-item-section>
                <q-item-section side><q-badge color="negative">{{ item.total }}</q-badge></q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </template>
    </s-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tdc, HTTPAuth, url } from 'quasar_resaas'

const loading = ref(true)
const data = ref({
  doencas_count: 0,
  alergias_count: 0,
  dados_vitais_count: 0,
  top_doencas: [],
  top_alergias: [],
})

onMounted(async () => {
  loading.value = true
  try {
    const { data: response } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/dashboard_historico_clinico',
    }))
    data.value = response
  } finally {
    loading.value = false
  }
})
</script>
