<template>
  <q-page class="q-pa-md vendas-dashboard">

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="dashboard" size="28px" class="q-mr-sm text-primary" />
        {{ tdc('Dashboard') }} — {{ tdc('Vendas') }}
      </div>

      <div class="row q-gutter-sm items-center">
        <q-btn-toggle
          v-model="periodPreset"
          dense no-caps
          toggle-color="primary"
          :options="[
            { label: tdc('Hoje'), value: 'today' },
            { label: tdc('7 dias'), value: '7d' },
            { label: tdc('30 dias'), value: '30d' },
            { label: tdc('Personalizado'), value: 'custom' },
          ]"
          @update:model-value="onPresetChange"
        />
        <template v-if="periodPreset === 'custom'">
          <q-input v-model="dataInicio" type="date" dense outlined @update:model-value="reloadAll" />
          <q-input v-model="dataFim" type="date" dense outlined @update:model-value="reloadAll" />
        </template>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3" v-for="kpi in kpis" :key="kpi.label">
        <s-card flat bordered class="full-height">
          <q-card-section class="row items-center no-wrap">
            <q-avatar :color="kpi.color" text-color="white" :icon="kpi.icon" size="42px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-7">{{ tdc(kpi.label) }}</div>
              <div v-if="summary.loading" class="text-caption text-grey-5">{{ tdc('a carregar...') }}</div>
              <div v-else-if="summary.error" class="text-caption text-negative">{{ tdc('erro') }}</div>
              <div v-else class="text-h6 text-weight-bold">{{ kpi.value() }}</div>
            </div>
          </q-card-section>
        </s-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">

      <!-- SÉRIE TEMPORAL -->
      <div class="col-12 col-md-7">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-md">{{ tdc('Vendas ao Longo do Tempo') }}</div>

            <div v-if="timeseries.loading" class="flex flex-center q-pa-xl"><q-spinner color="primary" size="32px" /></div>
            <div v-else-if="timeseries.error" class="text-negative text-caption">{{ timeseries.error }}</div>
            <div v-else-if="!timeseries.data?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <div v-else>
              <div v-for="(d, i) in timeseriesBars" :key="i" class="q-mb-sm">
                <div class="row items-center justify-between text-caption q-mb-xs">
                  <span>{{ d.label }}</span>
                  <span class="text-weight-medium">{{ formatCurrency(d.value) }}</span>
                </div>
                <div class="bar-track"><div class="bar-fill" :style="{ width: d.pct + '%', background: 'var(--q-primary)' }" /></div>
              </div>
            </div>
          </q-card-section>
        </s-card>
      </div>

      <!-- VENDAS POR ESTADO -->
      <div class="col-12 col-md-5">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-md">{{ tdc('Vendas por Estado') }}</div>

            <div v-if="byEstado.loading" class="flex flex-center q-pa-xl"><q-spinner color="primary" size="32px" /></div>
            <div v-else-if="byEstado.error" class="text-negative text-caption">{{ byEstado.error }}</div>
            <div v-else-if="!byEstado.data?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <div v-else v-for="row in byEstado.data" :key="row.estado" class="row items-center justify-between q-py-2">
              <q-badge :color="estadoColor(row.estado)">{{ row.estado }}</q-badge>
              <span class="text-caption">{{ row.num_vendas }} · {{ formatCurrency(row.total) }}</span>
            </div>
          </q-card-section>
        </s-card>
      </div>

    </div>

    <div class="row q-col-gutter-md q-mb-md">

      <!-- TOP PRODUTOS -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Top Produtos') }}</div>
            <div v-if="topProducts.loading" class="flex flex-center q-pa-md"><q-spinner color="primary" size="28px" /></div>
            <div v-else-if="topProducts.error" class="text-negative text-caption">{{ topProducts.error }}</div>
            <div v-else-if="!topProducts.data?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <q-list v-else dense separator>
              <q-item v-for="p in topProducts.data" :key="p.product_id">
                <q-item-section>{{ p.product_nome }}</q-item-section>
                <q-item-section side>{{ formatCurrency(p.receita) }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </s-card>
      </div>

      <!-- TOP CLIENTES -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Top Clientes') }}</div>
            <div v-if="topCustomers.loading" class="flex flex-center q-pa-md"><q-spinner color="primary" size="28px" /></div>
            <div v-else-if="topCustomers.error" class="text-negative text-caption">{{ topCustomers.error }}</div>
            <div v-else-if="!topCustomers.data?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <q-list v-else dense separator>
              <q-item v-for="c in topCustomers.data" :key="c.customer_id">
                <q-item-section>{{ c.cliente }}</q-item-section>
                <q-item-section side>{{ formatCurrency(c.receita) }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </s-card>
      </div>

      <!-- CONTAS A RECEBER -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="full-height cursor-pointer" @click="router.push({ name: 'list_sale' })">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm row items-center">
              <q-icon name="account_balance_wallet" color="negative" class="q-mr-xs" />
              {{ tdc('Contas a Receber') }}
            </div>
            <div v-if="receivables.loading" class="flex flex-center q-pa-md"><q-spinner color="primary" size="28px" /></div>
            <div v-else-if="receivables.error" class="text-negative text-caption">{{ receivables.error }}</div>
            <template v-else>
              <div class="text-h6 text-weight-bold q-mb-sm">{{ formatCurrency(receivables.data?.total_em_divida) }}</div>
              <div class="row items-center justify-between text-caption q-py-1" v-for="(v, k) in receivables.data?.envelhecimento || {}" :key="k">
                <span>{{ k }} {{ tdc('dias') }}</span>
                <span class="text-weight-medium">{{ formatCurrency(v) }}</span>
              </div>
            </template>
          </q-card-section>
        </s-card>
      </div>

    </div>

    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Quick Access') }}</div>
          <div class="row q-gutter-sm">
          <s-btn outline no-caps color="primary" icon="point_of_sale" :label="tdc('Vendas')" @click="router.push({ name: 'list_sale' })" />
          <s-btn outline no-caps color="primary" icon="groups" :label="tdc('Clientes')" @click="router.push({ name: 'list_customer' })" />
          <s-btn outline no-caps color="primary" icon="payments" :label="tdc('Pagamentos')" @click="router.push({ name: 'list_payment' })" />
        </div>
      </q-card-section>
    </s-card>

  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc, url, HTTPAuth } from 'quasar_resaas'

const router = useRouter()

function cardState() {
  return reactive({ loading: true, error: null, data: null })
}

const summary = cardState()
const timeseries = cardState()
const topProducts = cardState()
const topCustomers = cardState()
const byEstado = cardState()
const receivables = cardState()

const periodPreset = ref('30d')
const dataInicio = ref('')
const dataFim = ref('')

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function applyPreset() {
  const hoje = new Date()
  const fim = todayISO()
  let inicio = fim

  if (periodPreset.value === '7d') {
    const d = new Date(hoje); d.setDate(d.getDate() - 6)
    inicio = d.toISOString().slice(0, 10)
  } else if (periodPreset.value === '30d') {
    const d = new Date(hoje); d.setDate(d.getDate() - 29)
    inicio = d.toISOString().slice(0, 10)
  }

  if (periodPreset.value !== 'custom') {
    dataInicio.value = inicio
    dataFim.value = fim
  }
}

function onPresetChange() {
  applyPreset()
  reloadAll()
}

async function loadCard(card, endpoint, extraParams = {}) {
  card.loading = true
  card.error = null
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: `sales/${endpoint}`,
      params: { data_inicio: dataInicio.value, data_fim: dataFim.value, ...extraParams },
    }))
    card.data = data
  } catch (e) {
    card.error = e?.response?.data?.detail || tdc('Erro ao carregar')
  } finally {
    card.loading = false
  }
}

function reloadAll() {
  loadCard(summary, 'dashboard_summary')
  loadCard(timeseries, 'dashboard_timeseries', { granularidade: 'day' })
  loadCard(topProducts, 'dashboard_top_products', { limit: 8 })
  loadCard(topCustomers, 'dashboard_top_customers', { limit: 8 })
  loadCard(byEstado, 'dashboard_by_estado')
  loadCard(receivables, 'dashboard_receivables')
}

const kpis = [
  { label: 'Nº de Vendas', icon: 'receipt_long', color: 'primary', value: () => summary.data?.num_vendas ?? 0 },
  { label: 'Receita', icon: 'payments', color: 'positive', value: () => formatCurrency(summary.data?.receita) },
  { label: 'Ticket Médio', icon: 'trending_up', color: 'info', value: () => formatCurrency(summary.data?.ticket_medio) },
  { label: 'Contas a Receber', icon: 'account_balance_wallet', color: 'negative', value: () => formatCurrency(receivables.data?.total_em_divida) },
]

const timeseriesBars = computed(() => {
  const rows = timeseries.data || []
  const max = Math.max(1, ...rows.map(r => Number(r.receita || 0)))
  return rows.map(r => ({
    label: (r.periodo || '').toString().slice(0, 10),
    value: Number(r.receita || 0),
    pct: Math.round((Number(r.receita || 0) / max) * 100),
  }))
})

function estadoColor(estado) {
  return { rascunho: 'grey', confirmada: 'info', paga: 'positive', anulada: 'negative' }[estado] || 'grey'
}

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)
}

onMounted(() => {
  applyPreset()
  reloadAll()
})
</script>

<style scoped>
.full-height { height: 100%; }
.bar-track { height: 10px; border-radius: 6px; background: rgba(128,128,128,.15); overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; transition: width .4s ease; }
</style>
