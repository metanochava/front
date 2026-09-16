<template>
  <q-page class="q-pa-sm">
    <s-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="assignment" class="q-mr-xs" />
          {{ tdc('Medical Documents') }}
        </div>
      </q-card-section>

      <q-separator />

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner :color="$q.dark.isActive ? 'white' : 'primary'" size="48px" />
      </div>

      <template v-else>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Certificates') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.atestados_count }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Reports') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.relatorios_count }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Transfer Referrals') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.guias_count }}</div>
              </q-card-section>
            </s-card>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 text-weight-medium q-mb-sm">
            {{ tdc('Recent Certificates') }}
          </div>
          <div v-if="!data.recent_atestados.length" class="text-caption text-grey-6">
            {{ tdc('No data') }}
          </div>
          <q-list v-else separator>
            <q-item v-for="item in data.recent_atestados" :key="item.id">
              <q-item-section>
                {{ item.consulta__paciente__person__full_name || '—' }}
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ item.data_criacao }}</q-item-label>
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
  atestados_count: 0,
  relatorios_count: 0,
  guias_count: 0,
  recent_atestados: [],
})

onMounted(async () => {
  loading.value = true
  try {
    const { data: response } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/dashboard_documentos_medicos',
    }))
    data.value = response
  } finally {
    loading.value = false
  }
})
</script>
