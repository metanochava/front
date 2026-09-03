<template>
  <q-page class="q-pa-md stock-dashboard">

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold row items-center">
        <q-icon name="dashboard" size="28px" class="q-mr-sm text-primary" />
        {{ tdc('Dashboard') }} — {{ tdc('Stock') }}
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">

      <!-- VALOR TOTAL DO STOCK -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Valor Total do Stock') }}</div>

            <div v-if="stockValue.loading" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="32px" />
            </div>
            <div v-else-if="stockValue.error" class="text-negative text-caption">{{ stockValue.error }}</div>
            <template v-else>
              <div class="text-h5 text-weight-bold q-mb-sm">{{ formatCurrency(stockValue.data?.total) }}</div>
              <div v-if="!stockValue.data?.por_armazem?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
              <div v-for="row in stockValue.data?.por_armazem" :key="row.warehouse_id" class="row items-center justify-between text-caption q-py-2">
                <span>{{ row.warehouse__nome }}</span>
                <span class="text-weight-medium">{{ formatCurrency(row.valor) }}</span>
              </div>
            </template>
          </q-card-section>
        </s-card>
      </div>

      <!-- PRODUTOS ABAIXO DO MÍNIMO -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="full-height cursor-pointer" @click="router.push({ name: 'list_product' })">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm row items-center">
              <q-icon name="warning" color="warning" class="q-mr-xs" />
              {{ tdc('Produtos Abaixo do Mínimo') }}
            </div>

            <div v-if="lowStock.loading" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="32px" />
            </div>
            <div v-else-if="lowStock.error" class="text-negative text-caption">{{ lowStock.error }}</div>
            <div v-else-if="!lowStock.data?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <q-list v-else dense separator>
              <q-item v-for="p in lowStock.data.slice(0, 6)" :key="p.id">
                <q-item-section>{{ p.nome }}</q-item-section>
                <q-item-section side>
                  <q-badge color="negative">{{ p.saldo }} / {{ p.estoque_minimo }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </s-card>
      </div>

      <!-- PRODUTOS SEM MOVIMENTO -->
      <div class="col-12 col-md-4">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle1 text-weight-medium">{{ tdc('Stock Parado') }}</div>
              <q-select
                v-model="staleDias" :options="[7, 30, 90]" dense borderless
                style="width: 90px" @update:model-value="loadStale"
              />
            </div>

            <div v-if="stale.loading" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="32px" />
            </div>
            <div v-else-if="stale.error" class="text-negative text-caption">{{ stale.error }}</div>
            <div v-else-if="!stale.data?.produtos?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <q-list v-else dense separator>
              <q-item v-for="p in stale.data.produtos.slice(0, 6)" :key="p.id">
                <q-item-section>{{ p.nome }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </s-card>
      </div>

    </div>

    <div class="row q-col-gutter-md q-mb-md">

      <!-- MOVIMENTOS RECENTES -->
      <div class="col-12 col-md-7">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Movimentos Recentes') }}</div>

            <div v-if="recentMovements.loading" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="32px" />
            </div>
            <div v-else-if="recentMovements.error" class="text-negative text-caption">{{ recentMovements.error }}</div>
            <div v-else-if="!recentMovements.data?.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <q-list v-else separator>
              <q-item v-for="m in recentMovements.data" :key="m.id" clickable @click="router.push({ name: 'list_stockmovement' })">
                <q-item-section>
                  <q-item-label>{{ m.product__nome }} — {{ m.warehouse__nome }}</q-item-label>
                  <q-item-label caption>{{ m.tipo }} · {{ m.motivo || '—' }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <span :class="Number(m.quantidade) < 0 ? 'text-negative' : 'text-positive'">
                    {{ Number(m.quantidade) > 0 ? '+' : '' }}{{ m.quantidade }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </s-card>
      </div>

      <!-- DIVERGÊNCIAS DA ÚLTIMA CONTAGEM -->
      <div class="col-12 col-md-5">
        <s-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Divergências da Última Contagem') }}</div>

            <div v-if="countVariance.loading" class="flex flex-center q-pa-md">
              <q-spinner color="primary" size="32px" />
            </div>
            <div v-else-if="countVariance.error" class="text-negative text-caption">{{ countVariance.error }}</div>
            <div v-else-if="!countVariance.data?.inventory_count" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
            <template v-else>
              <div
                class="text-caption text-grey-7 q-mb-xs cursor-pointer"
                @click="router.push({ name: 'view_inventorycount', params: { id: countVariance.data.inventory_count.id } })"
              >
                {{ countVariance.data.inventory_count.warehouse }} — {{ countVariance.data.inventory_count.data }}
              </div>
              <div v-if="!countVariance.data.linhas.length" class="text-caption text-grey-6">{{ tdc('Sem divergências') }}</div>
              <q-list v-else dense separator>
                <q-item v-for="(l, i) in countVariance.data.linhas" :key="i">
                  <q-item-section>{{ l.product__nome }}</q-item-section>
                  <q-item-section side>
                    <span :class="Number(l.diferenca) < 0 ? 'text-negative' : 'text-positive'">
                      {{ Number(l.diferenca) > 0 ? '+' : '' }}{{ l.diferenca }}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-card-section>
        </s-card>
      </div>

    </div>

    <!-- QUICK ACCESS -->
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

function cardState() {
  return reactive({ loading: true, error: null, data: null })
}

const stockValue = cardState()
const lowStock = cardState()
const stale = cardState()
const recentMovements = cardState()
const countVariance = cardState()

const staleDias = ref(30)

async function loadCard(card, endpoint, params = {}) {
  card.loading = true
  card.error = null
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `inventory/${endpoint}`, params }))
    card.data = data
  } catch (e) {
    card.error = e?.response?.data?.detail || tdc('Erro ao carregar')
  } finally {
    card.loading = false
  }
}

function loadStockValue() { loadCard(stockValue, 'dashboard_stock_value') }
function loadLowStock() { loadCard(lowStock, 'dashboard_low_stock') }
function loadStale() { loadCard(stale, 'dashboard_stale_products', { dias: staleDias.value }) }
function loadRecentMovements() { loadCard(recentMovements, 'dashboard_recent_movements', { limit: 8 }) }
function loadCountVariance() { loadCard(countVariance, 'dashboard_count_variance') }

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)
}

const quickLinks = [
  { label: 'Produtos', icon: 'inventory_2', route: 'list_product' },
  { label: 'Categorias', icon: 'category', route: 'list_productcategory' },
  { label: 'Armazéns', icon: 'warehouse', route: 'list_warehouse' },
  { label: 'Saldo de Stock', icon: 'inventory', route: 'list_stockitem' },
  { label: 'Movimentos', icon: 'receipt_long', route: 'list_stockmovement' },
  { label: 'Contagens Físicas', icon: 'fact_check', route: 'list_inventorycount' },
]

onMounted(() => {
  // cada card busca o seu próprio endpoint independentemente — um
  // falhar/demorar não bloqueia os outros
  loadStockValue()
  loadLowStock()
  loadStale()
  loadRecentMovements()
  loadCountVariance()
})
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
