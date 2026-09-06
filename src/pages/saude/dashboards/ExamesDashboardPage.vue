<template>
  <q-page class="q-pa-sm">
    <s-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="biotech" class="q-mr-xs" />
          {{ tdc('Exames') }}
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
                <div class="text-caption text-grey-6">{{ tdc('Total de Pedidos') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.total_pedidos }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-4">
            <s-card flat bordered class="border-negative">
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Urgentes') }}</div>
                <div class="text-h5 text-weight-bold text-negative">{{ data.urgentes_count }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-4">
            <s-card flat bordered class="border-warning">
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Pendentes') }}</div>
                <div class="text-h5 text-weight-bold text-warning">{{ data.pendentes_count }}</div>
              </q-card-section>
            </s-card>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 text-weight-medium q-mb-sm">
            {{ tdc('Itens por Estado') }}
          </div>
          <div v-if="!data.por_estado.length" class="text-caption text-grey-6">
            {{ tdc('Sem dados') }}
          </div>
          <div v-else class="row q-gutter-sm">
            <q-badge
              v-for="item in data.por_estado" :key="item.estado_exame"
              :color="estadoColor(item.estado_exame)"
              class="q-pa-sm"
            >
              {{ item.estado_exame }}: {{ item.total }}
            </q-badge>
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
  total_pedidos: 0,
  urgentes_count: 0,
  pendentes_count: 0,
  por_estado: [],
})

function estadoColor(estado) {
  return {
    pendente: 'warning',
    agendado: 'info',
    colhido: 'primary',
    processamento: 'primary',
    concluido: 'positive',
    cancelado: 'negative',
  }[estado] || 'grey'
}

onMounted(async () => {
  loading.value = true
  try {
    const { data: response } = await HTTPAuth.get(url({
      type: 'u',
      url: 'saude/dashboard_exames',
    }))
    data.value = response
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.border-negative {
  border-color: var(--q-negative) !important;
}
.border-warning {
  border-color: var(--q-warning) !important;
}
</style>
