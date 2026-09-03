<template>
  <q-page class="q-pa-sm pos-page">

    <!-- ===================== RECEIPT / SUCCESS ===================== -->
    <div v-if="receipt" class="flex flex-center" style="min-height: 70vh">
      <s-card flat bordered style="width: 100%; max-width: 420px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" color="positive" size="64px" />
          <div class="text-h6 q-mt-sm">{{ tdc('Venda Concluída') }}</div>
          <div class="text-caption text-grey-6">{{ tdc('Venda') }} #{{ receipt.saleId.slice(0, 8) }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row justify-between q-py-xs">
            <span>{{ tdc('Itens') }}</span>
            <span>{{ receipt.numItens }}</span>
          </div>
          <div class="row justify-between q-py-xs text-h6">
            <span>{{ tdc('Total') }}</span>
            <span>{{ formatMoney(receipt.total) }}</span>
          </div>

          <q-separator class="q-my-sm" />

          <div class="text-caption text-grey-7 q-mb-xs">
            {{ receipt.pagamentos.length > 1 ? tdc('Pagamento Dividido') : tdc('Pagamento') }}
          </div>
          <div v-for="(p, i) in receipt.pagamentos" :key="i" class="row justify-between q-py-xs">
            <span>{{ formaPagamentoLabel(p.forma_pagamento) }}</span>
            <span>{{ formatMoney(p.valor) }}</span>
          </div>

          <template v-if="receipt.totalTroco > 0">
            <q-separator class="q-my-sm" />
            <div class="row justify-between q-py-xs">
              <span>{{ tdc('Valor Recebido') }}</span>
              <span>{{ formatMoney(receipt.totalRecebido) }}</span>
            </div>
            <div class="row justify-between q-py-xs text-positive text-weight-bold">
              <span>{{ tdc('Troco') }}</span>
              <span>{{ formatMoney(receipt.totalTroco) }}</span>
            </div>
          </template>
        </q-card-section>

        <q-card-actions class="q-pa-md">
          <q-btn
            color="primary" unelevated class="full-width" size="lg"
            icon="qr_code_scanner" :label="tdc('Nova Venda')"
            @click="resetPOS"
          />
        </q-card-actions>
      </s-card>
    </div>

    <!-- ===================== PDV ===================== -->
    <template v-else>

      <div class="row q-col-gutter-md">

        <!-- ============== ESQUERDA: SCANNER + CARRINHO ============== -->
        <div class="col-12 col-md-8">

          <!-- SCANNER -->
          <s-card flat bordered class="q-mb-md">
            <q-card-section>
              <q-input
                ref="barcodeRef"
                v-model="barcodeInput"
                :label="tdc('Ler código de barras / QR (ou digitar e Enter)')"
                outlined dense autofocus
                :color="scanFeedback === 'error' ? 'negative' : scanFeedback === 'ok' ? 'positive' : 'primary'"
                @keyup.enter="onScan"
              >
                <template #prepend><q-icon name="qr_code_scanner" /></template>
                <template #append>
                  <q-spinner v-if="scanning" size="20px" />
                  <q-icon v-else-if="scanFeedback === 'ok'" name="check" color="positive" />
                  <q-icon v-else-if="scanFeedback === 'error'" name="close" color="negative" />
                  <q-separator vertical inset class="q-mx-xs" />
                  <q-btn
                    flat round dense icon="photo_camera" color="primary"
                    :title="tdc('Ler com a câmara')"
                    @click="showCameraScanner = true"
                  />
                </template>
              </q-input>
              <div v-if="scanError" class="text-negative text-caption q-mt-xs">{{ scanError }}</div>

              <!-- fallback: pesquisa manual por nome -->
              <s-select
                class="q-mt-sm"
                :model-value="null"
                :api="productSelectUrl"
                option-label="label" option-value="value"
                emit-value map-options
                :label="tdc('Ou pesquisar produto por nome')"
                @update:model-value="onManualPick"
              />
            </q-card-section>
          </s-card>

          <!-- PRODUTOS RÁPIDOS (bebidas/itens sem código de barras) -->
          <s-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <div class="text-subtitle2">{{ tdc('Produtos Rápidos') }}</div>
                <q-space />
                <q-input
                  v-model="quickSearch" dense outlined
                  :placeholder="tdc('Filtrar')" style="width: 160px"
                  debounce="300"
                  @update:model-value="loadQuickProducts"
                >
                  <template #prepend><q-icon name="search" size="18px" /></template>
                </q-input>
              </div>

              <div v-if="quickLoading" class="flex flex-center q-pa-md">
                <q-spinner color="primary" size="24px" />
              </div>
              <div v-else-if="!quickProducts.length" class="text-caption text-grey-6">
                {{ tdc('Sem produtos') }}
              </div>
              <div v-else class="row q-col-gutter-sm">
                <div v-for="p in quickProducts" :key="p.id" class="col-6 col-sm-4">
                  <q-btn
                    outline no-caps color="primary" class="full-width quick-product-btn"
                    @click="addProductToCart(p); focusScanner()"
                  >
                    <div class="column items-center">
                      <div class="text-caption ellipsis-2-lines">{{ p.nome }}</div>
                      <div class="text-caption text-grey-6">{{ formatMoney(p.preco_base) }}</div>
                    </div>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </s-card>

          <!-- CARRINHO -->
          <s-card flat bordered>
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Carrinho') }} ({{ cart.length }})</div>

              <div v-if="!cart.length" class="text-caption text-grey-6 q-pa-md text-center">
                {{ tdc('Carrinho vazio — lê um código de barras para começar') }}
              </div>

              <div v-else class="cart-lines">
                <div
                  v-for="(line, i) in cart" :key="line.product_id"
                  class="row items-center no-wrap q-gutter-xs cart-line"
                >
                  <div class="col cart-line-name">
                    <div class="ellipsis">{{ line.product_nome }}</div>
                    <div class="text-caption text-grey-6 ellipsis">
                      {{ line.codigo || '—' }} · {{ formatMoney(line.preco_unitario) }}
                    </div>
                  </div>

                  <q-btn flat dense round icon="remove" size="sm" @click="changeQty(line, -1)" />
                  <q-input
                    v-model.number="line.quantidade"
                    type="number" dense outlined square
                    class="cart-qty-input"
                    min="0.001" step="0.001"
                    @update:model-value="recompute"
                  />
                  <q-btn flat dense round icon="add" size="sm" @click="changeQty(line, 1)" />

                  <q-input
                    v-model.number="line.desconto_valor"
                    type="number" dense outlined square
                    class="cart-desc-input"
                    :placeholder="tdc('Desc.')"
                    step="0.01"
                    @update:model-value="recompute"
                  />

                  <div class="text-weight-bold cart-subtotal">
                    {{ formatMoney(lineSubtotal(line)) }}
                  </div>

                  <q-btn flat dense round icon="delete" color="negative" size="sm" @click="removeLine(i)" />
                </div>
              </div>
            </q-card-section>
          </s-card>
        </div>

        <!-- ============== DIREITA: CLIENTE / ARMAZÉM / TOTAIS ============== -->
        <div class="col-12 col-md-4">

          <s-card flat bordered class="q-mb-md">
            <q-card-section class="q-gutter-sm">
              <s-select
                v-model="customerId"
                :api="customerSelectUrl"
                option-label="label" option-value="value"
                emit-value map-options clearable
                :label="tdc('Cliente') + ' (' + tdc('opcional') + ')'"
                :hint="tdc('Vazio = Cliente Balcão')"
              />
              <s-select
                v-model="warehouseId"
                :api="warehouseSelectUrl"
                option-label="label" option-value="value"
                emit-value map-options clearable
                :label="tdc('Armazém')"
                :hint="!warehouseId ? tdc('Sem armazém, a venda não movimenta stock') : ''"
              />
            </q-card-section>
          </s-card>

          <s-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="row justify-between text-caption q-py-xs">
                <span>{{ tdc('Subtotal') }}</span>
                <span>{{ formatMoney(totals.subtotal) }}</span>
              </div>
              <div class="row justify-between text-caption q-py-xs">
                <span>{{ tdc('Desconto') }}</span>
                <span>{{ formatMoney(totals.desconto) }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-h5 text-weight-bold q-py-xs">
                <span>{{ tdc('Total') }}</span>
                <span>{{ formatMoney(totals.total) }}</span>
              </div>
            </q-card-section>
          </s-card>

          <div v-if="checkoutError" class="q-mb-md">
            <q-banner class="bg-negative text-white" dense>{{ checkoutError }}</q-banner>
          </div>

          <q-btn
            color="positive" unelevated size="lg" class="full-width q-mb-sm"
            icon="point_of_sale" :label="tdc('Finalizar Venda')"
            :disable="!cart.length"
            :loading="checkingOut"
            @click="goToCheckout"
          />
          <q-btn
            v-if="cart.length || pendingSaleId"
            flat color="negative" class="full-width"
            icon="cancel" :label="tdc('Cancelar Venda')"
            @click="cancelPOS"
          />
        </div>

      </div>
    </template>

    <!-- ===================== DIALOG PAGAMENTO (suporta divisão) ===================== -->
    <q-dialog v-model="showPaymentDialog" persistent>
      <q-card style="min-width: 380px">
        <q-card-section class="text-h6">{{ tdc('Pagamento') }}</q-card-section>

        <q-card-section>
          <div class="row justify-between text-caption q-py-xs">
            <span>{{ tdc('Total') }}</span>
            <span>{{ formatMoney(totals.total) }}</span>
          </div>
          <div class="row justify-between text-caption q-py-xs">
            <span>{{ tdc('Já Pago') }}</span>
            <span>{{ formatMoney(totalJaPago) }}</span>
          </div>
          <q-separator class="q-my-xs" />
          <div class="row justify-between text-h6 text-weight-bold">
            <span>{{ tdc('Falta Pagar') }}</span>
            <span>{{ formatMoney(saldoEmFalta) }}</span>
          </div>

          <q-list v-if="paymentsDone.length" dense class="q-mt-sm">
            <q-item v-for="(p, i) in paymentsDone" :key="i" class="q-px-none">
              <q-item-section>{{ formaPagamentoLabel(p.forma_pagamento) }}</q-item-section>
              <q-item-section side>{{ formatMoney(p.valor) }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-select
            v-model="payment.forma_pagamento"
            :options="formaPagamentoOptions"
            emit-value map-options
            :label="tdc('Forma de Pagamento')"
          />

          <q-input
            v-model.number="payment.valorAPagar"
            type="number" step="0.01"
            :label="tdc('Valor a Registar')"
          />

          <q-input
            v-if="payment.forma_pagamento === 'numerario'"
            v-model.number="payment.recebido"
            type="number" step="0.01"
            :label="tdc('Valor Recebido do Cliente')"
          />

          <div v-if="payment.forma_pagamento === 'numerario'" class="row justify-between text-h6">
            <span>{{ tdc('Troco') }}</span>
            <span :class="troco < 0 ? 'text-negative' : 'text-positive'">{{ formatMoney(troco) }}</span>
          </div>

          <q-input
            v-else
            v-model="payment.referencia"
            :label="tdc('Referência') + ' (' + tdc('opcional') + ')'"
          />

          <div v-if="paymentError" class="text-negative text-caption">{{ paymentError }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="tdc('Cancelar Venda')" :disable="payingLoading" @click="showPaymentDialog = false; cancelPOS()" />
          <q-btn
            color="positive"
            :label="isLastPayment ? tdc('Finalizar') : tdc('Registar e Continuar')"
            :loading="payingLoading"
            :disable="payment.forma_pagamento === 'numerario' && troco < 0"
            @click="confirmPayment"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===================== DIALOG CÂMARA ===================== -->
    <camera-scanner-dialog
      v-model="showCameraScanner"
      @decoded="onCameraDecoded"
    />

  </q-page>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { tdc, url, HTTPAuth } from 'quasar_resaas'
import { useSaleStore } from './saleStore'
import { useSaleitemStore } from './saleitemStore'
import CameraScannerDialog from 'src/components/CameraScannerDialog.vue'

const Sale = useSaleStore()
const Saleitem = useSaleitemStore()

const customerSelectUrl = url({ type: 'u', url: 'sales/customers', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })
const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })

// ---------------- CONTEXTO DA VENDA ----------------
const customerId = ref(null)
const warehouseId = ref(null)
const cart = ref([])
const pendingSaleId = ref(null)

// auto-seleciona o armazém se só existir um
;(async () => {
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true', page_size: 2 } }))
    const rows = data.results ?? data
    if (rows.length === 1) warehouseId.value = rows[0].value
  } catch {
    // sem armazéns ainda — cashier escolhe manualmente depois de os criar
  }
})()

// ---------------- SCANNER ----------------
const barcodeRef = ref(null)
const barcodeInput = ref('')
const scanning = ref(false)
const scanFeedback = ref(null) // 'ok' | 'error' | null
const scanError = ref('')
let feedbackTimer = null

function focusScanner() {
  nextTick(() => barcodeRef.value?.focus())
}

function flashFeedback(kind) {
  scanFeedback.value = kind
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => { scanFeedback.value = null }, 1200)
}

function addProductToCart(product) {
  const existing = cart.value.find(l => l.product_id === product.id || l.product_id === product.value)
  if (existing) {
    existing.quantidade = Number(existing.quantidade) + 1
  } else {
    cart.value.push({
      product_id: product.id || product.value,
      product_nome: product.nome || product.label,
      codigo: product.codigo || null,
      quantidade: 1,
      preco_unitario: Number(product.preco_base) || 0,
      desconto_valor: 0,
      synced: false,
      itemId: null,
    })
  }
}

async function lookupByCodigo(codigo) {
  scanning.value = true
  scanError.value = ''

  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: 'inventory/products', params: { codigo, page_size: 1 } }))
    const rows = data.results ?? data

    if (rows.length) {
      addProductToCart(rows[0])
      flashFeedback('ok')
      return true
    }

    flashFeedback('error')
    scanError.value = tdc('Produto não encontrado para o código') + ` "${codigo}"`
    return false
  } catch {
    flashFeedback('error')
    scanError.value = tdc('Erro ao procurar produto.')
    return false
  } finally {
    scanning.value = false
  }
}

async function onScan() {
  const codigo = barcodeInput.value.trim()
  if (!codigo) return

  const found = await lookupByCodigo(codigo)
  if (found) barcodeInput.value = ''
  focusScanner()
}

// ---------------- CÂMARA ----------------
const showCameraScanner = ref(false)

async function onCameraDecoded(decodedText) {
  await lookupByCodigo(decodedText.trim())
}

async function onManualPick(productId) {
  if (!productId) return
  try {
    const { data } = await HTTPAuth.get(url({ type: 'u', url: `inventory/products/${productId}/` }))
    addProductToCart(data)
  } finally {
    focusScanner()
  }
}

// ---------------- PRODUTOS RÁPIDOS ----------------
// Muitos itens de bar (copos, cerveja de pressão, cocktails) não têm
// código de barras — toque único é mais rápido do que ler ou pesquisar.
const quickProducts = ref([])
const quickSearch = ref('')
const quickLoading = ref(false)

async function loadQuickProducts() {
  quickLoading.value = true
  try {
    const { data } = await HTTPAuth.get(url({
      type: 'u',
      url: 'inventory/products',
      params: { search: quickSearch.value, page_size: 12, ativo: true },
    }))
    quickProducts.value = data.results ?? data
  } finally {
    quickLoading.value = false
  }
}

// ---------------- CARRINHO ----------------
function changeQty(line, delta) {
  const next = Number(line.quantidade) + delta
  line.quantidade = next > 0 ? next : line.quantidade
}

function lineSubtotal(line) {
  return Number(line.quantidade || 0) * Number(line.preco_unitario || 0) - Number(line.desconto_valor || 0)
}

async function removeLine(index) {
  const line = cart.value[index]

  if (line.synced && line.itemId) {
    Saleitem.form = { id: line.itemId }
    await Saleitem.remove()
  }

  cart.value.splice(index, 1)
}

function recompute() {
  // no-op trigger — totals é computed, só aqui para clareza no template
}

const totals = computed(() => {
  const subtotal = cart.value.reduce((sum, l) => sum + Number(l.quantidade || 0) * Number(l.preco_unitario || 0), 0)
  const desconto = cart.value.reduce((sum, l) => sum + Number(l.desconto_valor || 0), 0)
  return { subtotal, desconto, total: subtotal - desconto }
})

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0)
}

// ---------------- CHECKOUT ----------------
const checkingOut = ref(false)
const checkoutError = ref('')
const showPaymentDialog = ref(false)

async function ensureSaleAndItems() {
  if (!pendingSaleId.value) {
    Sale.form = {
      customer: customerId.value || null,
      warehouse_id: warehouseId.value,
      observacao: null,
    }
    const created = await Sale.create()
    pendingSaleId.value = created.id
  }

  for (const line of cart.value) {
    if (line.synced) continue

    Saleitem.form = {
      sale: pendingSaleId.value,
      product_id: line.product_id,
      quantidade: line.quantidade,
      preco_unitario: line.preco_unitario,
      desconto_valor: line.desconto_valor || 0,
    }
    const item = await Saleitem.create()
    line.synced = true
    line.itemId = item.id
  }
}

function extractError(e) {
  const d = e?.response?.data?.detail
  if (Array.isArray(d)) return d[0]
  return d || tdc('Ocorreu um erro. Tenta novamente.')
}

async function goToCheckout() {
  checkoutError.value = ''
  checkingOut.value = true
  try {
    await ensureSaleAndItems()
    await Sale.confirmar(pendingSaleId.value)

    paymentsDone.value = []
    resetPaymentForm(totals.value.total)
    paymentError.value = ''
    showPaymentDialog.value = true
  } catch (e) {
    checkoutError.value = extractError(e)
  } finally {
    checkingOut.value = false
  }
}

// ---------------- PAGAMENTO (suporta divisão entre métodos) ----------------
const payment = reactive({ forma_pagamento: 'numerario', valorAPagar: 0, recebido: 0, referencia: '' })
const payingLoading = ref(false)
const paymentError = ref('')
const receipt = ref(null)
const paymentsDone = ref([])

function resetPaymentForm(remaining) {
  payment.forma_pagamento = 'numerario'
  payment.valorAPagar = remaining
  payment.recebido = remaining
  payment.referencia = ''
}

// Métodos usados em Moçambique — só "numerario" (dinheiro físico)
// envolve troco; mobile money/cartão/transferência cobram o valor exato.
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

function formaPagamentoLabel(value) {
  return formaPagamentoOptions.find(o => o.value === value)?.label || value
}

const totalJaPago = computed(() => paymentsDone.value.reduce((sum, p) => sum + Number(p.valor || 0), 0))
const saldoEmFalta = computed(() => Math.max(totals.value.total - totalJaPago.value, 0))
const isLastPayment = computed(() => Number(payment.valorAPagar || 0) >= saldoEmFalta.value - 0.001)
const troco = computed(() => Number(payment.recebido || 0) - Number(payment.valorAPagar || 0))

async function confirmPayment() {
  paymentError.value = ''
  payingLoading.value = true

  const valor = Math.min(Number(payment.valorAPagar || 0), saldoEmFalta.value)

  try {
    const result = await Sale.pagar(pendingSaleId.value, {
      valor,
      forma_pagamento: payment.forma_pagamento,
      referencia: payment.referencia || null,
    })

    paymentsDone.value.push({
      forma_pagamento: payment.forma_pagamento,
      valor,
      recebido: payment.forma_pagamento === 'numerario' ? payment.recebido : valor,
      troco: payment.forma_pagamento === 'numerario' ? troco.value : 0,
    })

    const estadoFinal = result.sale?.estado?.value || result.sale?.estado

    if (estadoFinal === 'paga') {
      receipt.value = {
        saleId: pendingSaleId.value,
        numItens: cart.value.length,
        total: totals.value.total,
        pagamentos: paymentsDone.value,
        totalRecebido: paymentsDone.value.reduce((s, p) => s + Number(p.recebido || 0), 0),
        totalTroco: paymentsDone.value.reduce((s, p) => s + Number(p.troco || 0), 0),
      }
      showPaymentDialog.value = false
    } else {
      resetPaymentForm(saldoEmFalta.value)
    }
  } catch (e) {
    paymentError.value = extractError(e)
  } finally {
    payingLoading.value = false
  }
}

// ---------------- RESET / CANCELAR ----------------
function resetPOS() {
  cart.value = []
  pendingSaleId.value = null
  customerId.value = null
  checkoutError.value = ''
  receipt.value = null
  barcodeInput.value = ''
  focusScanner()
}

async function cancelPOS() {
  if (pendingSaleId.value) {
    try {
      await Sale.anular(pendingSaleId.value)
    } catch {
      // já pode ter sido anulada/paga entretanto — ignora e limpa na mesma
    }
  }
  resetPOS()
}

onMounted(loadQuickProducts)
</script>

<style scoped>
.pos-page :deep(.q-field__control) {
  font-size: 1rem;
}

.quick-product-btn {
  min-height: 56px;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
}

/* CARRINHO: tudo numa única linha por item — nunca quebra, faz
   scroll horizontal em ecrãs muito estreitos em vez de empilhar */
.cart-lines {
  overflow-x: auto;
}

.cart-line {
  padding: 6px 2px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  min-width: 460px;
}

.cart-line:last-child {
  border-bottom: none;
}

.cart-line-name {
  min-width: 120px;
}

.cart-qty-input {
  width: 56px;
  flex: 0 0 auto;
}

.cart-desc-input {
  width: 60px;
  flex: 0 0 auto;
}

.cart-subtotal {
  width: 72px;
  text-align: right;
  flex: 0 0 auto;
  font-size: 0.9rem;
}

.cart-qty-input :deep(input),
.cart-desc-input :deep(input) {
  text-align: center;
}
</style>
