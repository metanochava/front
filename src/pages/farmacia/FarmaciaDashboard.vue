
<template>
  <q-page class="q-pa-md">

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="local_pharmacy" size="28px" class="q-mr-sm text-primary" />
        {{ tdc('Dashboard') }} — {{ tdc('Farmácia') }}
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6 col-md-2" v-for="c in cards" :key="c.estado">
        <s-card
          flat bordered class="full-height cursor-pointer"
          @click="router.push({ name: 'list_filafarmacia' })"
        >
          <q-card-section>
            <div class="text-caption text-grey-6">{{ tdc(c.label) }}</div>
            <div class="text-h5 text-weight-bold" :class="c.textClass">
              <q-spinner v-if="loading" size="20px" color="primary" />
              <span v-else>{{ counts[c.estado] ?? '—' }}</span>
            </div>
          </q-card-section>
        </s-card>
      </div>
    </div>

    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Quick Access') }}</div>
        <div class="row q-gutter-sm">
          <s-btn
            v-for="link in quickLinks" :key="link.route"
            outline no-caps color="primary"
            :icon="link.icon" :label="tdc(link.label)"
            @click="router.push({ name: link.route })"
          />
        </div>
      </q-card-section>
    </s-card>

  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, HTTPAuth } from 'quasar_resaas'

const router = useRouter()

const cards = [
  { estado: 'pendente', label: 'Pendentes', textClass: '' },
  { estado: 'aprovada', label: 'Aprovadas', textClass: 'text-info' },
  { estado: 'dispensada_parcial', label: 'Parcialmente Dispensadas', textClass: 'text-warning' },
  { estado: 'dispensada', label: 'Dispensadas', textClass: 'text-positive' },
  { estado: 'rejeitada', label: 'Rejeitadas', textClass: 'text-negative' },
]

const counts = reactive({})
const loading = ref(true)

async function loadCounts() {
  loading.value = true
  try {
    await Promise.all(cards.map(async (c) => {
      const { data } = await HTTPAuth.get(
        url({ type: 'u', url: 'farmacia/filafarmacias/', params: { estado: c.estado, page_size: 1 } })
      )
      counts[c.estado] = data.count ?? 0
    }))
  } finally {
    loading.value = false
  }
}

const quickLinks = [
  { label: 'Fila de Farmácia', icon: 'fact_check', route: 'list_filafarmacia' },
  { label: 'Dispensas', icon: 'medication', route: 'list_dispensa' },
]

onMounted(loadCounts)
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
