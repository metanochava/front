<template>
  <q-page class="q-pa-sm" v-if="Sale.row">
    <div class="text-h6 q-mb-sm row items-center">
      <q-icon name="point_of_sale" class="q-mr-sm" />
      {{ tdc('Venda') }} — {{ Sale.row.cliente_label || Sale.row.customer?.label || tdc('Cliente Balcão') }}
      <q-badge class="q-ml-sm" :color="estadoColor">{{ Sale.row.estado?.label || estado }}</q-badge>
      <q-badge v-if="Sale.row.warehouse_id && !Sale.row.stock_tracked && estado !== 'rascunho'" class="q-ml-sm" color="warning">
        {{ tdc('Sem controlo de stock') }}
      </q-badge>
      <q-space />

      <q-btn
        v-if="estado === 'rascunho'"
        color="positive" icon="check_circle" :label="tdc('Confirmar Venda')"
        :disable="!Saleitem.rows.length" :loading="acting" class="q-mr-sm"
        @click="confirmar"
      />
      <q-btn
        v-if="estado === 'confirmada' || estado === 'paga'"
        color="primary" icon="payments" :label="tdc('Registar Pagamento')"
        :loading="acting" class="q-mr-sm"
        @click="showPaymentDialog = true"
      />
      <q-btn
        v-if="estado !== 'anulada'"
        color="negative" icon="cancel" :label="tdc('Anular')"
        :loading="acting"
        @click="anular"
      />
    </div>

    <div v-if="actionError" class="q-mb-md">
      <q-banner class="bg-negative text-white" dense>{{ actionError }}</q-banner>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Subtotal') }}</div>
          <div class="text-h6">{{ Sale.row.subtotal }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Desconto') }}</div>
          <div class="text-h6">{{ Sale.row.desconto_total }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Total') }}</div>
          <div class="text-h6 text-weight-bold">{{ Sale.row.total }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-12 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-6">{{ tdc('Saldo em Dívida') }}</div>
          <div class="text-h6" :class="Number(Sale.row.saldo_devedor) > 0 ? 'text-negative' : 'text-positive'">
            {{ Sale.row.saldo_devedor }}
          </div>
        </q-card-section></s-card>
      </div>
    </div>

    <!-- ITENS -->
    <s-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Itens') }}</div>

        <q-table
          flat dense
          :rows="Saleitem.rows"
          :columns="itemColumns"
          row-key="id"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-disponivel="props">
            <q-td :props="props">
              <q-badge v-if="disponibilidadeFor(props.row.product_id) === false" color="negative">
                {{ tdc('Stock insuficiente') }}
              </q-badge>
              <q-icon v-else-if="disponibilidadeFor(props.row.product_id) === true" name="check_circle" color="positive" />
              <span v-else class="text-grey-5">—</span>
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                v-if="estado === 'rascunho'"
                flat dense round icon="delete" color="negative"
                @click="removeItem(props.row)"
              />
            </q-td>
          </template>
        </q-table>

        <!-- NOVA LINHA -->
        <div v-if="estado === 'rascunho'" class="row q-col-gutter-sm items-end q-mt-md">
          <div class="col-12 col-sm-4">
            <s-select
              v-model="newItem.product"
              :api="productSelectUrl"
              option-label="label" option-value="value"
              emit-value map-options
              :label="tdc('Produto')"
              @update:model-value="onProductPicked"
            />
          </div>
          <div class="col-6 col-sm-2">
            <q-input v-model.number="newItem.quantidade" type="number" step="0.001" :label="tdc('Quantidade')" />
          </div>
          <div class="col-6 col-sm-2">
            <q-input v-model.number="newItem.preco_unitario" type="number" step="0.01" :label="tdc('Preço Unitário')" />
          </div>
          <div class="col-6 col-sm-2">
            <q-input v-model.number="newItem.desconto_valor" type="number" step="0.01" :label="tdc('Desconto')" />
          </div>
          <div class="col-6 col-sm-2">
            <q-btn color="primary" icon="add" :label="tdc('Adicionar')" :loading="addingItem" @click="addItem" />
          </div>
          <div class="col-12 text-caption text-grey-6">
            {{ tdc('Subtotal desta linha (preview local)') }}: {{ previewSubtotal }}
          </div>
        </div>
      </q-card-section>
    </s-card>

    <!-- PAGAMENTOS -->
    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Pagamentos') }}</div>
        <div v-if="!Payment.rows.length" class="text-caption text-grey-6">{{ tdc('No data') }}</div>
        <q-list v-else dense separator>
          <q-item v-for="p in Payment.rows" :key="p.id">
            <q-item-section>{{ p.forma_pagamento?.label || p.forma_pagamento }} — {{ p.referencia || '—' }}</q-item-section>
            <q-item-section side>{{ p.valor }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </s-card>

    <!-- DIALOG PAGAMENTO -->
    <q-dialog v-model="showPaymentDialog">
      <q-card style="min-width: 380px">
        <q-card-section class="text-h6">{{ tdc('Registar Pagamento') }}</q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model.number="paymentForm.valor" type="number" step="0.01" :label="tdc('Valor')" />
          <q-select
            v-model="paymentForm.forma_pagamento"
            :options="formaPagamentoOptions"
            emit-value map-options
            :label="tdc('Forma de Pagamento')"
          />
          <q-input v-model="paymentForm.referencia" :label="tdc('Referência') + ' (' + tdc('opcional') + ')'" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="tdc('Cancelar')" v-close-popup />
          <q-btn color="primary" :label="tdc('Registar')" :loading="acting" @click="pagar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="40px" />
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import { useSaleStore } from './saleStore'
import { useSaleitemStore } from './saleitemStore'
import { usePaymentStore } from './../payment/paymentStore'

const route = useRoute()
const Sale = useSaleStore()
const Saleitem = useSaleitemStore()
const Payment = usePaymentStore()

const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })

const estado = computed(() => Sale.row?.estado?.value || Sale.row?.estado)
const estadoColor = computed(() => (
  { rascunho: 'grey', confirmada: 'info', paga: 'positive', anulada: 'negative' }[estado.value] || 'grey'
))

const itemColumns = [
  { name: 'product_nome', label: tdc('Produto'), field: 'product_nome', align: 'left' },
  { name: 'quantidade', label: tdc('Quantidade'), field: 'quantidade', align: 'right' },
  { name: 'preco_unitario', label: tdc('Preço'), field: 'preco_unitario', align: 'right' },
  { name: 'desconto_valor', label: tdc('Desconto'), field: 'desconto_valor', align: 'right' },
  { name: 'disponivel', label: tdc('Stock'), field: 'disponivel', align: 'center' },
  { name: 'acoes', label: '', field: 'acoes', align: 'center' },
]

async function fetchItems() {
  await Saleitem.loadData({ sale: route.params.id, page_size: 500 })
}

async function fetchPayments() {
  await Payment.loadData({ sale: route.params.id, page_size: 500 })
}

async function fetchDisponibilidade() {
  if (estado.value !== 'rascunho') return
  await Sale.getDisponibilidade(route.params.id)
}

function disponibilidadeFor(productId) {
  const row = Sale.disponibilidade?.find(d => d.product_id === productId)
  return row ? row.disponivel : null
}

async function refreshAll() {
  await Sale.getById(route.params.id)
  await fetchItems()
  await fetchPayments()
  await fetchDisponibilidade()
}

// ---------------- NOVA LINHA ----------------
const newItem = reactive({ product: null, quantidade: null, preco_unitario: null, desconto_valor: 0 })
const addingItem = ref(false)

const previewSubtotal = computed(() => {
  const q = Number(newItem.quantidade || 0)
  const p = Number(newItem.preco_unitario || 0)
  const d = Number(newItem.desconto_valor || 0)
  return (q * p - d).toFixed(2)
})

async function onProductPicked(productId) {
  if (!productId) return
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `inventory/products/${productId}/` }))
    newItem.preco_unitario = Number(data.preco_base) || 0
  } catch {
    // preço fica em branco, utilizador preenche manualmente
  }
}

async function addItem() {
  if (!newItem.product || !newItem.quantidade || newItem.preco_unitario === null) return

  addingItem.value = true
  try {
    Saleitem.form = {
      sale: route.params.id,
      product_id: newItem.product,
      quantidade: newItem.quantidade,
      preco_unitario: newItem.preco_unitario,
      desconto_valor: newItem.desconto_valor || 0,
    }
    await Saleitem.create()
    newItem.product = null
    newItem.quantidade = null
    newItem.preco_unitario = null
    newItem.desconto_valor = 0
    await fetchItems()
    await Sale.getById(route.params.id)
    await fetchDisponibilidade()
  } finally {
    addingItem.value = false
  }
}

async function removeItem(item) {
  Saleitem.form = { id: item.id }
  await Saleitem.remove()
  await Sale.getById(route.params.id)
  await fetchDisponibilidade()
}

// ---------------- AÇÕES ----------------
const acting = ref(false)
const actionError = ref('')

async function confirmar() {
  acting.value = true
  actionError.value = ''
  try {
    await Sale.confirmar(route.params.id)
    await refreshAll()
  } catch (e) {
    actionError.value = e?.response?.data?.detail?.[0] || e?.response?.data?.detail || tdc('Erro ao confirmar venda.')
  } finally {
    acting.value = false
  }
}

async function anular() {
  acting.value = true
  actionError.value = ''
  try {
    await Sale.anular(route.params.id)
    await refreshAll()
  } catch (e) {
    actionError.value = e?.response?.data?.detail?.[0] || e?.response?.data?.detail || tdc('Erro ao anular venda.')
  } finally {
    acting.value = false
  }
}

const showPaymentDialog = ref(false)
const formaPagamentoOptions = [
  { label: tdc('Numerário'), value: 'numerario' },
  { label: tdc('M-Pesa'), value: 'mpesa' },
  { label: tdc('e-Mola'), value: 'emola' },
  { label: tdc('mKesh'), value: 'mkesh' },
  { label: tdc('Cartão (Multicaixa/POS)'), value: 'cartao' },
  { label: tdc('Transferência Bancária'), value: 'transferencia' },
  { label: tdc('Cheque'), value: 'cheque' },
  { label: tdc('Outro'), value: 'outro' },
]
const paymentForm = reactive({ valor: null, forma_pagamento: 'numerario', referencia: '' })

async function pagar() {
  acting.value = true
  actionError.value = ''
  try {
    await Sale.pagar(route.params.id, paymentForm)
    showPaymentDialog.value = false
    paymentForm.valor = null
    paymentForm.referencia = ''
    await refreshAll()
  } catch (e) {
    actionError.value = e?.response?.data?.detail?.[0] || e?.response?.data?.detail || tdc('Erro ao registar pagamento.')
  } finally {
    acting.value = false
  }
}

onMounted(async () => {
  await refreshAll()
  paymentForm.valor = Number(Sale.row?.saldo_devedor) || null
})
</script>
