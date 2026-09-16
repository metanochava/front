<template>
  <q-page class="q-pa-sm">
    <s-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="medication" class="q-mr-xs" />
          {{ tdc('Medication') }}
        </div>
      </q-card-section>

      <q-separator />

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
      </div>

      <template v-else>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-6 col-md-3">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Prescriptions') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.total_receitas }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-6 col-md-3">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Current Medication') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.medicacao_corrente_count }}</div>
              </q-card-section>
            </s-card>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 text-weight-medium q-mb-sm">
            {{ tdc('Most Prescribed Medicines') }}
          </div>
          <div v-if="!data.top_medicamentos.length" class="text-caption text-grey-6">
            {{ tdc('No data') }}
          </div>
          <q-list v-else separator>
            <q-item v-for="item in data.top_medicamentos" :key="item.medicamento__descricao">
              <q-item-section>{{ item.medicamento__descricao || tdc('No description') }}</q-item-section>
              <q-item-section side>
                <q-badge color="primary">{{ item.total }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
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
  total_receitas: 0,
  medicacao_corrente_count: 0,
  top_medicamentos: [],
})

onMounted(async () => {
  loading.value = true
  try {
    const { data: response } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/dashboard_medicacao',
    }))
    data.value = response
  } finally {
    loading.value = false
  }
})
</script>
