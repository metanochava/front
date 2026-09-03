<template>
  <q-page class="q-pa-md saude-dashboard">

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="dashboard" size="28px" class="q-mr-sm text-primary" />
        {{ tdc('Dashboard') }} — {{ tdc('Saúde') }}
      </div>
      <div class="text-caption text-grey-7">{{ todayLabel }}</div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="48px" />
    </div>

    <template v-else>

      <!-- KPI CARDS -->
      <div class="row q-col-gutter-md q-mb-md">
        <div
          v-for="kpi in kpis" :key="kpi.label"
          class="col-12 col-sm-6 col-md-4 col-lg-2"
        >
          <s-card
            flat bordered
            class="kpi-card cursor-pointer"
            @click="router.push({ name: kpi.route })"
          >
            <q-card-section class="row items-center no-wrap">
              <q-avatar :color="kpi.color" text-color="white" :icon="kpi.icon" size="42px" class="q-mr-md" />
              <div>
                <div class="text-caption text-grey-7">{{ tdc(kpi.label) }}</div>
                <div class="text-h6 text-weight-bold">{{ kpi.value }}</div>
                <div v-if="kpi.hint" class="text-caption text-grey-6">{{ kpi.hint }}</div>
              </div>
            </q-card-section>
          </s-card>
        </div>
      </div>

      <!-- CHARTS ROW 1 -->
      <div class="row q-col-gutter-md q-mb-md">

        <div class="col-12 col-md-7">
          <s-card flat bordered class="full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                {{ tdc('Consultas nos últimos 7 dias') }}
              </div>

              <div v-for="(d, i) in consultasPorDia" :key="d.label + i" class="q-mb-sm">
                <div class="row items-center justify-between text-caption q-mb-xs">
                  <span>{{ d.label }}</span>
                  <span class="text-weight-medium">{{ d.value }}</span>
                </div>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{ width: d.pct + '%', background: chartColors[i % chartColors.length] }"
                  />
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <div class="col-12 col-md-5">
          <s-card flat bordered class="full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                {{ tdc('Pedidos de Exame') }}
              </div>

              <div class="row items-center q-col-gutter-md">
                <div class="col-5">
                  <svg viewBox="0 0 42 42" class="donut-chart">
                    <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="rgba(128,128,128,.15)" stroke-width="6" />
                    <circle
                      v-for="seg in pedidosDonut" :key="seg.label"
                      cx="21" cy="21" r="15.9"
                      fill="transparent"
                      :stroke="seg.color"
                      stroke-width="6"
                      stroke-linecap="round"
                      :stroke-dasharray="`${seg.pct} ${100 - seg.pct}`"
                      :stroke-dashoffset="seg.dashoffset"
                    />
                    <text x="21" y="24" text-anchor="middle" class="donut-center">{{ pedidos.length }}</text>
                  </svg>
                </div>
                <div class="col-7">
                  <div v-for="seg in pedidosDonut" :key="'l' + seg.label" class="row items-center q-mb-xs">
                    <div class="legend-dot" :style="{ background: seg.color }" />
                    <div class="text-caption q-ml-xs">{{ tdc(seg.label) }} — {{ seg.value }}</div>
                  </div>
                  <div v-if="!pedidos.length" class="text-caption text-grey-6">
                    {{ tdc('No data') }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

      </div>

      <!-- CHARTS ROW 2 -->
      <div class="row q-col-gutter-md q-mb-md">

        <div class="col-12 col-md-5">
          <s-card flat bordered class="full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                {{ tdc('Exames por Classe') }}
              </div>

              <div v-if="!examesPorClasse.length" class="text-caption text-grey-6">
                {{ tdc('No data') }}
              </div>

              <div v-for="(d, i) in examesPorClasse" :key="d.label" class="q-mb-sm">
                <div class="row items-center justify-between text-caption q-mb-xs">
                  <span>{{ d.label }}</span>
                  <span class="text-weight-medium">{{ d.value }}</span>
                </div>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{ width: d.pct + '%', background: chartColors[i % chartColors.length] }"
                  />
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <div class="col-12 col-md-7">
          <s-card flat bordered class="full-height">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                {{ tdc('Consultas Recentes') }}
              </div>

              <q-list v-if="consultasRecentes.length" separator>
                <q-item
                  v-for="c in consultasRecentes" :key="c.id"
                  clickable
                  @click="router.push({ name: 'view_consulta', params: { id: c.id } })"
                >
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="person" size="36px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ c.paciente?.label || tdc('Paciente') }}</q-item-label>
                    <q-item-label caption lines="1">{{ c.diagnostico || c.dc || '—' }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{ c.data }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <div v-else class="text-caption text-grey-6">
                {{ tdc('No data') }}
              </div>
            </q-card-section>
          </s-card>
        </div>

      </div>

      <!-- QUICK ACCESS -->
      <s-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Quick Access') }}
          <div class="row q-gutter-sm">
            <s-btn
              v-for="link in quickLinks" :key="link.route"
              outline no-caps color="primary"
              :icon="link.icon" :label="tdc(link.label)"
              @click="router.push({ name: link.route })"
            />&nbsp;&nbsp;
          </div>
        </q-card-section>
      </s-card>

    </template>
  </q-page>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tdc } from 'quasar_resaas'

import { usePacienteStore } from './paciente/pacienteStore'
import { useConsultaStore } from './consulta/consultaStore'
import { usePedidoexamemedicoStore } from './pedidoexamemedico/pedidoexamemedicoStore'
import { useExamemedicoStore } from './examemedico/examemedicoStore'
import { useReceitamedicaStore } from './receitamedica/receitamedicaStore'
import { useAtestadomedicoStore } from './atestadomedico/atestadomedicoStore'
import { useGuiatransferenciaStore } from './guiatransferencia/guiatransferenciaStore'

const router = useRouter()

const Paciente = usePacienteStore()
const Consulta = useConsultaStore()
const Pedido = usePedidoexamemedicoStore()
const Exame = useExamemedicoStore()
const Receita = useReceitamedicaStore()
const Atestado = useAtestadomedicoStore()
const Guia = useGuiatransferenciaStore()

const loading = ref(true)

const todayISO = new Date().toISOString().slice(0, 10)
const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

const chartColors = [
  'var(--q-primary)', 'var(--q-secondary)', 'var(--q-accent)',
  'var(--q-info)', 'var(--q-warning)', 'var(--q-positive)'
]

onMounted(async () => {
  loading.value = true

  await Promise.all([
    Paciente.loadData({ page_size: 1 }),
    Consulta.loadData({ page_size: 500 }),
    Pedido.loadData({ page_size: 500 }),
    Exame.loadData({ page_size: 500 }),
    Receita.loadData({ page_size: 1 }),
    Atestado.loadData({ page_size: 1 }),
    Guia.loadData({ page_size: 1 })
  ])

  loading.value = false
})

const consultas = computed(() => Consulta.rows || [])
const pedidos = computed(() => Pedido.rows || [])
const exames = computed(() => Exame.rows || [])

const consultasHoje = computed(() => consultas.value.filter(c => c.data === todayISO))

const consultasRecentes = computed(() => consultas.value.slice(0, 5))

const last7Days = computed(() => {
  const arr = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    arr.push(d.toISOString().slice(0, 10))
  }
  return arr
})

const consultasPorDia = computed(() => {
  const counts = {}
  last7Days.value.forEach(d => { counts[d] = 0 })

  consultas.value.forEach(c => {
    if (Object.prototype.hasOwnProperty.call(counts, c.data)) counts[c.data]++
  })

  const max = Math.max(1, ...Object.values(counts))

  return last7Days.value.map(d => {
    const dt = new Date(d + 'T00:00:00')
    return {
      label: dt.toLocaleDateString(undefined, { weekday: 'short' }),
      value: counts[d],
      pct: Math.round((counts[d] / max) * 100)
    }
  })
})

function buildDonut(items) {
  const total = items.reduce((sum, i) => sum + i.value, 0) || 1
  let cumulative = 0

  return items.map(i => {
    const pct = (i.value / total) * 100
    const seg = { ...i, pct, dashoffset: 25 - cumulative }
    cumulative += pct
    return seg
  })
}

const pedidosUrgentes = computed(() => pedidos.value.filter(p => p.urgente).length)
const pedidosNormais = computed(() => pedidos.value.length - pedidosUrgentes.value)

const pedidosDonut = computed(() => buildDonut([
  { label: 'Urgente', value: pedidosUrgentes.value, color: 'var(--q-negative)' },
  { label: 'Normal', value: pedidosNormais.value, color: 'var(--q-primary)' }
]))

const examesPorClasse = computed(() => {
  const counts = {}

  exames.value.forEach(e => {
    const name = e.classe_exame_medico?.label || tdc('Sem Classe')
    counts[name] = (counts[name] || 0) + 1
  })

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const max = Math.max(1, ...entries.map(([, v]) => v))

  return entries.map(([label, value]) => ({
    label, value, pct: Math.round((value / max) * 100)
  }))
})

const kpis = computed(() => [
  {
    label: 'Pacientes',
    value: Paciente.pagination.rowsNumber || 0,
    icon: 'groups', color: 'primary', route: 'list_paciente'
  },
  {
    label: 'Consultas Hoje',
    value: consultasHoje.value.length,
    hint: `${Consulta.pagination.rowsNumber || 0} ${tdc('total')}`,
    icon: 'event_available', color: 'positive', route: 'list_consulta'
  },
  {
    label: 'Pedidos de Exame',
    value: Pedido.pagination.rowsNumber || 0,
    hint: `${pedidosUrgentes.value} ${tdc('urgentes')}`,
    icon: 'science', color: 'warning', route: 'list_pedidoexamemedico'
  },
  {
    label: 'Receitas Médicas',
    value: Receita.pagination.rowsNumber || 0,
    icon: 'medication', color: 'info', route: 'list_receitamedica'
  },
  {
    label: 'Atestados Médicos',
    value: Atestado.pagination.rowsNumber || 0,
    icon: 'assignment_ind', color: 'accent', route: 'list_atestadomedico'
  },
  {
    label: 'Guias de Transferência',
    value: Guia.pagination.rowsNumber || 0,
    icon: 'sync_alt', color: 'secondary', route: 'list_guiatransferencia'
  }
])

const quickLinks = [
  { label: 'Pacientes', icon: 'groups', route: 'list_paciente' },
  { label: 'Consultas', icon: 'event_available', route: 'list_consulta' },
  { label: 'Pedidos de Exame', icon: 'science', route: 'list_pedidoexamemedico' },
  { label: 'Exames Médicos', icon: 'biotech', route: 'list_examemedico' },
  { label: 'Receitas Médicas', icon: 'medication', route: 'list_receitamedica' },
  { label: 'Atestados Médicos', icon: 'assignment_ind', route: 'list_atestadomedico' },
  { label: 'Guias de Transferência', icon: 'sync_alt', route: 'list_guiatransferencia' },
  { label: 'Relatórios Médicos', icon: 'summarize', route: 'list_relatoriomedico' }
]

</script>

<style scoped>
.kpi-card {
  transition: transform var(--anim-speed, .2s) ease, box-shadow var(--anim-speed, .2s) ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, .08);
}

.bar-track {
  height: 10px;
  border-radius: 6px;
  background: rgba(128, 128, 128, .15);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width .4s ease;
}

.donut-chart {
  width: 100%;
}
.donut-center {
  font-size: 8px;
  font-weight: 700;
  fill: currentColor;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
