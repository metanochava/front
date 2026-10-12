<template>
  <q-page class="q-pa-sm" v-if="order">
    <div class="text-h6 q-mb-sm row items-center q-gutter-sm">
      <q-icon name="receipt_long" />
      <span data-test="po-title">{{ order.number }} — {{ order.supplier_label || order.supplier?.label }}</span>
      <q-badge :color="statusColor(status)" data-test="po-status">{{ order.status?.label || status }}</q-badge>
      <q-space />

      <s-btn
        v-if="status === 'draft' && User.can('submit_purchaseorder')"
        color="primary" icon="send" :label="tdc('Submit')"
        :disable="!Line.rows.length" :loading="acting" data-test="po-submit"
        @click="run(() => PurchaseOrder.submit(id))"
      />
      <s-btn
        v-if="status === 'submitted' && User.can('approve_purchaseorder')"
        color="positive" icon="task_alt" :label="tdc('Approve')" :loading="acting" data-test="po-approve"
        @click="run(() => PurchaseOrder.approve(id))"
      />
      <s-btn
        v-if="status === 'submitted' && User.can('return_to_draft_purchaseorder')"
        flat icon="undo" :label="tdc('Return to draft')" :loading="acting"
        @click="run(() => PurchaseOrder.returnToDraft(id))"
      />
      <s-btn
        v-if="receivable && User.can('receive_purchaseorder')"
        color="primary" icon="move_to_inbox" :label="tdc('Receive goods')" :loading="acting" data-test="po-receive"
        @click="openReceive"
      />
      <s-btn
        v-if="cancellable && User.can('cancel_purchaseorder')"
        flat color="negative" icon="cancel" :label="tdc('Cancel purchase order')" :loading="acting"
        @click="showCancel = true"
      />
    </div>

    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-6 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Order date') }}</div>
          <div class="text-subtitle1">{{ order.order_date || '—' }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-6 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Expected date') }}</div>
          <div class="text-subtitle1">{{ order.expected_date || '—' }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-6 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Supplier reference') }}</div>
          <div class="text-subtitle1">{{ order.supplier_reference || '—' }}</div>
        </q-card-section></s-card>
      </div>
      <div class="col-6 col-sm-3">
        <s-card flat bordered><q-card-section>
          <div class="text-caption text-grey-7">{{ tdc('Total') }}</div>
          <div class="text-subtitle1 text-weight-bold" data-test="po-total">{{ order.total }}</div>
        </q-card-section></s-card>
      </div>
    </div>

    <q-banner v-if="status === 'cancelled'" dense class="bg-negative text-white q-mb-sm">
      {{ tdc('Cancelled') }}: {{ order.cancel_reason }}
    </q-banner>

    <!-- LINES -->
    <s-card flat bordered class="q-mb-sm">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Lines') }}</div>

        <q-table
          flat dense
          :rows="Line.rows" :columns="lineColumns" row-key="id"
          hide-pagination :rows-per-page-options="[0]"
          :no-data-label="tdc('No data')"
          data-test="po-lines"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <s-btn
                v-if="status === 'draft' && User.can('delete_purchaseorderline')"
                flat dense round icon="delete" color="negative"
                @click="removeLine(props.row)"
              />
            </q-td>
          </template>
        </q-table>

        <div v-if="status === 'draft' && User.can('add_purchaseorderline')" class="row q-col-gutter-sm items-start q-mt-sm">
          <div class="col-12 col-sm-4" v-if="User.can('list_product')">
            <s-select
              v-model="newLine.product_id" :api="productSelectUrl"
              option-label="label" option-value="value" emit-value map-options clearable
              :label="tdc('Product')" :error="!!lineErrors.product_id" :error-message="lineErrors.product_id"
            />
          </div>
          <div class="col-12 col-sm">
            <s-input
              v-model="newLine.description" :label="tdc('Description')"
              :error="!!lineErrors.description" :error-message="lineErrors.description"
            />
          </div>
          <div class="col-6 col-sm-2">
            <s-input
              v-model.number="newLine.quantity" type="number" step="0.001" :label="tdc('Quantity')"
              :error="!!lineErrors.quantity" :error-message="lineErrors.quantity"
            />
          </div>
          <div class="col-6 col-sm-2">
            <s-input
              v-model.number="newLine.unit_cost" type="number" step="0.01" :label="tdc('Unit cost')"
              :error="!!lineErrors.unit_cost" :error-message="lineErrors.unit_cost"
            />
          </div>
          <div class="col-12 col-sm-auto">
            <s-btn color="primary" icon="add" :label="tdc('Add line')" :loading="addingLine" data-test="po-add-line" @click="addLine" />
          </div>
        </div>
      </q-card-section>
    </s-card>

    <!-- RECEIPTS -->
    <s-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ tdc('Goods receipts') }}</div>
        <div v-if="!Receipt.rows.length" class="text-caption text-grey-7">{{ tdc('No data') }}</div>
        <q-list v-else dense separator data-test="po-receipts">
          <q-item v-for="receipt in Receipt.rows" :key="receipt.id">
            <q-item-section>
              <q-item-label>{{ formatDate(receipt.received_at) }}</q-item-label>
              <q-item-label caption>{{ receipt.notes || '—' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="receipt.stock_tracked ? 'positive' : 'grey'">
                {{ receipt.stock_tracked ? tdc('Stock updated') : tdc('No stock control') }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </s-card>

    <!-- RECEIVE -->
    <q-dialog v-model="showReceive" persistent>
      <s-modal-card :title="tdc('Receive goods')" icon="move_to_inbox" width="640px" form @close="showReceive = false" @submit="receive">
        <q-markup-table flat dense separator="horizontal">
          <thead>
            <tr>
              <th class="text-left">{{ tdc('Product') }}</th>
              <th class="text-right">{{ tdc('Outstanding') }}</th>
              <th class="text-right" style="width: 140px">{{ tdc('Received') }}</th>
              <th v-if="anyTracked" style="width: 150px">{{ tdc('Lot') }}</th>
              <th v-if="anyTracked" style="width: 160px">{{ tdc('Expiry date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in openLines" :key="line.id">
              <td>{{ line.label }}</td>
              <td class="text-right">{{ line.outstanding_quantity }}</td>
              <td>
                <s-input v-model.number="receiveForm.quantities[line.id]" type="number" step="0.001" min="0" :max="line.outstanding_quantity" />
              </td>
              <td v-if="anyTracked">
                <s-input v-if="line.track_batches" v-model="receiveForm.lots[line.id].lot_number" dense
                  :rules="[v => !receiveForm.quantities[line.id] || !!v || tdc('Required')]" />
              </td>
              <td v-if="anyTracked">
                <s-date v-if="line.track_batches" v-model="receiveForm.lots[line.id].expiry_date" dense />
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <s-select
          v-if="User.can('list_warehouse')"
          v-model="receiveForm.warehouse_id" :api="warehouseSelectUrl"
          option-label="label" option-value="value" emit-value map-options clearable
          class="q-mt-sm" :label="tdc('Warehouse')"
        />
        <s-input v-model="receiveForm.notes" type="textarea" autogrow class="q-mt-sm" :label="tdc('Notes')" />

        <template #footer>
          <s-btn flat :label="tdc('Cancel')" @click="showReceive = false" />
          <s-btn color="primary" type="submit" :label="tdc('Record receipt')" :loading="acting" data-test="po-receive-confirm" />
        </template>
      </s-modal-card>
    </q-dialog>

    <!-- CANCEL -->
    <q-dialog v-model="showCancel" persistent>
      <s-modal-card :title="tdc('Cancel purchase order')" icon="cancel" width="420px" form @close="showCancel = false" @submit="cancel">
        <s-input v-model="cancelReason" type="textarea" autogrow :label="tdc('Reason')" :rules="[v => !!(v && v.trim()) || tdc('A reason is required.')]" />
        <template #footer>
          <s-btn flat :label="tdc('Close')" @click="showCancel = false" />
          <s-btn color="negative" type="submit" :label="tdc('Cancel purchase order')" :loading="acting" />
        </template>
      </s-modal-card>
    </q-dialog>
  </q-page>

  <q-page v-else class="flex flex-center">
    <q-spinner color="primary" size="48px" />
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tdc, url, useUserStore, sDialog } from 'quasar_resaas'
import { usePurchaseOrderStore } from './purchaseOrderStore'
import { usePurchaseOrderLineStore } from './purchaseOrderLineStore'
import { useGoodsReceiptStore } from '../goodsreceipt/goodsReceiptStore'
import { statusColor, statusOf } from './status'

const route = useRoute()
const User = useUserStore()
const PurchaseOrder = usePurchaseOrderStore()
const Line = usePurchaseOrderLineStore()
const Receipt = useGoodsReceiptStore()

const id = computed(() => route.params.id)
const order = computed(() => (PurchaseOrder.row?.id === id.value ? PurchaseOrder.row : null))
const status = computed(() => statusOf(order.value))
const receivable = computed(() => ['approved', 'partially_received'].includes(status.value))
const cancellable = computed(() => ['draft', 'submitted', 'approved'].includes(status.value))
const openLines = computed(() => Line.rows.filter(line => Number(line.outstanding_quantity) > 0))

const productSelectUrl = url({ type: 'u', url: 'inventory/products', params: { select: 'true' } })
const warehouseSelectUrl = url({ type: 'u', url: 'inventory/warehouses', params: { select: 'true' } })

const lineColumns = [
  { name: 'label', label: tdc('Product'), field: 'label', align: 'left' },
  { name: 'quantity', label: tdc('Quantity'), field: 'quantity', align: 'right' },
  { name: 'unit_cost', label: tdc('Unit cost'), field: 'unit_cost', align: 'right' },
  { name: 'line_total', label: tdc('Line total'), field: 'line_total', align: 'right' },
  { name: 'received_quantity', label: tdc('Received'), field: 'received_quantity', align: 'right' },
  { name: 'actions', label: '', field: 'actions', align: 'center' },
]

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : '—'
}

async function refresh() {
  await PurchaseOrder.getById(id.value)
  await Line.loadData({ order: id.value, page_size: 500 })
  await Receipt.loadData({ order: id.value, page_size: 100 })
}

// ---------------- ACTIONS ----------------
const acting = ref(false)

// errors reach the user through the app's alert funnel (HTTPAuth); the page
// only reloads so it shows the order as the backend has it
async function run(action) {
  acting.value = true
  try {
    await action()
  } catch {
    // shown by the alert funnel
  } finally {
    await refresh()
    acting.value = false
  }
}

// ---------------- LINES ----------------
const newLine = reactive({ product_id: null, description: '', quantity: null, unit_cost: null })
const addingLine = ref(false)
const lineErrors = computed(() => Line.errors || {})

async function addLine() {
  addingLine.value = true
  try {
    Line.form = { order: id.value, ...newLine }
    await Line.create()
    Object.assign(newLine, { product_id: null, description: '', quantity: null, unit_cost: null })
    await refresh()
  } catch {
    // field messages are in Line.errors
  } finally {
    addingLine.value = false
  }
}

function removeLine(line) {
  sDialog({
    title: tdc('Remove line'),
    message: tdc('Remove this line from the purchase order?'),
    cancel: true,
  }).onOk(async () => {
    Line.form = { id: line.id }
    await Line.remove()
    await refresh()
  })
}

// ---------------- RECEIVE ----------------
const showReceive = ref(false)
const receiveForm = reactive({ quantities: {}, lots: {}, warehouse_id: null, notes: '', idempotency_key: null })
const anyTracked = computed(() => openLines.value.some(line => line.track_batches))

function openReceive() {
  receiveForm.quantities = Object.fromEntries(openLines.value.map(line => [line.id, Number(line.outstanding_quantity)]))
  receiveForm.lots = Object.fromEntries(openLines.value.map(line => [line.id, { lot_number: '', expiry_date: null }]))
  receiveForm.warehouse_id = order.value?.warehouse_id || null
  receiveForm.notes = ''
  // one key per opened dialog: a double click or a retry records one receipt
  receiveForm.idempotency_key = crypto.randomUUID()
  showReceive.value = true
}

async function receive() {
  const lines = Object.entries(receiveForm.quantities)
    .filter(([, quantity]) => Number(quantity) > 0)
    .map(([line, quantity]) => ({ line, quantity, ...(receiveForm.lots[line] || {}) }))

  await run(async () => {
    await PurchaseOrder.receive(id.value, {
      lines,
      warehouse_id: receiveForm.warehouse_id,
      notes: receiveForm.notes,
      idempotency_key: receiveForm.idempotency_key,
    })
    showReceive.value = false
  })
}

// ---------------- CANCEL ----------------
const showCancel = ref(false)
const cancelReason = ref('')

async function cancel() {
  await run(async () => {
    await PurchaseOrder.cancel(id.value, cancelReason.value)
    showCancel.value = false
    cancelReason.value = ''
  })
}

onMounted(refresh)
</script>
